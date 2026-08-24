import { useCallback, useEffect, useRef, useState } from 'react';

import {
  createStepEvent,
  getNextCycleBarIndex,
  getSecondsPerStep,
  getStepsPerBar,
  type GapBars,
  type MetronomePosition,
  type MetronomeSettings,
  type StepEvent,
  type Subdivision,
} from '../lib/metronomeTiming';

const SCHEDULER_INTERVAL_MS = 25;
const SCHEDULE_AHEAD_SECONDS = 0.1;
const START_DELAY_SECONDS = 0.04;
const MAX_SCHEDULER_LAG_SECONDS = 0.1;

export interface MetronomeController {
  isPlaying: boolean;
  position: MetronomePosition | null;
  play: () => Promise<void>;
  pause: () => void;
  toggle: () => void;
}

export function useMetronome(
  settings: MetronomeSettings,
): MetronomeController {
  const settingsRef = useRef(settings);
  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

  const audioContextRef = useRef<AudioContext | null>(null);
  const schedulerRef = useRef<number | null>(null);
  const visualTimeoutsRef = useRef<Set<number>>(new Set());
  const scheduledNodesRef = useRef<Set<OscillatorNode>>(new Set());
  const nextStepTimeRef = useRef(0);
  const stepIndexRef = useRef(0);
  const cycleBarIndexRef = useRef(0);
  const activeSubdivisionRef = useRef<Subdivision>(settings.subdivision);
  const activeGapBarsRef = useRef<GapBars>(settings.gapBars);
  const playingRef = useRef(false);
  const mountedRef = useRef(true);
  const startRequestRef = useRef(0);

  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState<MetronomePosition | null>(null);

  const clearVisualTimeouts = useCallback(() => {
    for (const timeoutId of visualTimeoutsRef.current) {
      window.clearTimeout(timeoutId);
    }
    visualTimeoutsRef.current.clear();
  }, []);

  const stopScheduledAudio = useCallback(() => {
    for (const oscillator of scheduledNodesRef.current) {
      try {
        oscillator.stop();
      } catch {
        // A node may already have reached its scheduled stop time.
      }
    }
    scheduledNodesRef.current.clear();
  }, []);

  const stopPlayback = useCallback(
    (updateReactState: boolean) => {
      startRequestRef.current += 1;
      playingRef.current = false;

      if (schedulerRef.current !== null) {
        window.clearInterval(schedulerRef.current);
        schedulerRef.current = null;
      }

      clearVisualTimeouts();
      stopScheduledAudio();
      stepIndexRef.current = 0;
      cycleBarIndexRef.current = 0;

      if (updateReactState && mountedRef.current) {
        setIsPlaying(false);
        setPosition(null);
      }
    },
    [clearVisualTimeouts, stopScheduledAudio],
  );

  const scheduleTone = useCallback(
    (context: AudioContext, time: number, event: StepEvent) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      const isSubdivision = event.subdivisionIndex > 0;
      const frequency = event.isAccent ? 1280 : isSubdivision ? 640 : 880;
      const peakGain = event.isAccent ? 0.24 : isSubdivision ? 0.08 : 0.15;
      const duration = isSubdivision ? 0.035 : 0.05;

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(frequency, time);
      gain.gain.setValueAtTime(0.0001, time);
      gain.gain.exponentialRampToValueAtTime(peakGain, time + 0.002);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.onended = () => {
        scheduledNodesRef.current.delete(oscillator);
        oscillator.disconnect();
        gain.disconnect();
      };

      scheduledNodesRef.current.add(oscillator);
      oscillator.start(time);
      oscillator.stop(time + duration + 0.005);
    },
    [],
  );

  const scheduleVisualPosition = useCallback(
    (context: AudioContext, time: number, event: StepEvent) => {
      const delay = Math.max(0, (time - context.currentTime) * 1000);
      const timeoutId = window.setTimeout(() => {
        visualTimeoutsRef.current.delete(timeoutId);
        if (!playingRef.current || !mountedRef.current) {
          return;
        }

        setPosition({
          barPhase: event.barPhase,
          beatIndex: event.beatIndex,
          subdivisionIndex: event.subdivisionIndex,
          gapBarIndex: event.gapBarIndex,
        });
      }, delay);

      visualTimeoutsRef.current.add(timeoutId);
    },
    [],
  );

  const resetSequence = useCallback((context: AudioContext) => {
    stepIndexRef.current = 0;
    cycleBarIndexRef.current = 0;
    activeSubdivisionRef.current = settingsRef.current.subdivision;
    activeGapBarsRef.current = settingsRef.current.gapBars;
    nextStepTimeRef.current = context.currentTime + START_DELAY_SECONDS;
  }, []);

  const runScheduler = useCallback(() => {
    const context = audioContextRef.current;
    if (!context || !playingRef.current) {
      return;
    }

    if (
      nextStepTimeRef.current <
      context.currentTime - MAX_SCHEDULER_LAG_SECONDS
    ) {
      clearVisualTimeouts();
      resetSequence(context);
    }

    while (
      playingRef.current &&
      nextStepTimeRef.current <
        context.currentTime + SCHEDULE_AHEAD_SECONDS
    ) {
      const subdivision = activeSubdivisionRef.current;
      const gapBars = activeGapBarsRef.current;
      const event = createStepEvent(
        stepIndexRef.current,
        cycleBarIndexRef.current,
        subdivision,
        gapBars,
      );

      if (event.shouldClick) {
        scheduleTone(context, nextStepTimeRef.current, event);
      }
      scheduleVisualPosition(context, nextStepTimeRef.current, event);

      nextStepTimeRef.current += getSecondsPerStep(
        settingsRef.current.bpm,
        subdivision,
      );
      stepIndexRef.current += 1;

      if (stepIndexRef.current >= getStepsPerBar(subdivision)) {
        stepIndexRef.current = 0;

        const requestedGapBars = settingsRef.current.gapBars;
        if (requestedGapBars !== gapBars) {
          cycleBarIndexRef.current = 0;
        } else {
          cycleBarIndexRef.current = getNextCycleBarIndex(
            cycleBarIndexRef.current,
            gapBars,
          );
        }

        activeSubdivisionRef.current = settingsRef.current.subdivision;
        activeGapBarsRef.current = requestedGapBars;
      }
    }
  }, [
    clearVisualTimeouts,
    resetSequence,
    scheduleTone,
    scheduleVisualPosition,
  ]);

  const play = useCallback(async () => {
    if (playingRef.current) {
      return;
    }

    const requestId = startRequestRef.current + 1;
    startRequestRef.current = requestId;

    let context = audioContextRef.current;
    if (!context || context.state === 'closed') {
      context = new AudioContext();
      audioContextRef.current = context;
    }

    if (context.state === 'suspended') {
      await context.resume();
    }

    if (
      requestId !== startRequestRef.current ||
      !mountedRef.current ||
      playingRef.current
    ) {
      return;
    }

    resetSequence(context);
    playingRef.current = true;
    setIsPlaying(true);
    runScheduler();
    schedulerRef.current = window.setInterval(
      runScheduler,
      SCHEDULER_INTERVAL_MS,
    );
  }, [resetSequence, runScheduler]);

  const pause = useCallback(() => {
    stopPlayback(true);
  }, [stopPlayback]);

  const toggle = useCallback(() => {
    if (playingRef.current) {
      pause();
    } else {
      void play();
    }
  }, [pause, play]);

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
      stopPlayback(false);
      const context = audioContextRef.current;
      audioContextRef.current = null;
      if (context && context.state !== 'closed') {
        void context.close();
      }
    };
  }, [stopPlayback]);

  return {
    isPlaying,
    position,
    play,
    pause,
    toggle,
  };
}
