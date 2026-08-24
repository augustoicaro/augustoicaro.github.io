export const MIN_BPM = 20;
export const MAX_BPM = 300;
export const BEATS_PER_BAR = 4;

export type Subdivision = 'quarter' | 'eighth' | 'sixteenth';
export type GapBars = 0 | 1 | 2 | 3 | 4 | 5;
export type BarPhase = 'audible' | 'gap';

export interface MetronomeSettings {
  bpm: number;
  subdivision: Subdivision;
  gapBars: GapBars;
}

export interface MetronomePosition {
  barPhase: BarPhase;
  beatIndex: number;
  subdivisionIndex: number;
  gapBarIndex: number;
}

export interface StepEvent extends MetronomePosition {
  isAccent: boolean;
  shouldClick: boolean;
}

export const SUBDIVISION_STEPS: Record<Subdivision, number> = {
  quarter: 1,
  eighth: 2,
  sixteenth: 4,
};

export function clampBpm(value: number): number {
  if (!Number.isFinite(value)) {
    return MIN_BPM;
  }

  return Math.min(MAX_BPM, Math.max(MIN_BPM, Math.round(value)));
}

export function getStepsPerBeat(subdivision: Subdivision): number {
  return SUBDIVISION_STEPS[subdivision];
}

export function getStepsPerBar(subdivision: Subdivision): number {
  return BEATS_PER_BAR * getStepsPerBeat(subdivision);
}

export function getSecondsPerStep(bpm: number, subdivision: Subdivision): number {
  return 60 / clampBpm(bpm) / getStepsPerBeat(subdivision);
}

export function getGapCycleLength(gapBars: GapBars): number {
  return gapBars === 0 ? 1 : gapBars + 1;
}

export function getNextCycleBarIndex(
  cycleBarIndex: number,
  gapBars: GapBars,
): number {
  return (cycleBarIndex + 1) % getGapCycleLength(gapBars);
}

export function isAudibleBar(cycleBarIndex: number, gapBars: GapBars): boolean {
  return gapBars === 0 || cycleBarIndex === 0;
}

export function createStepEvent(
  stepIndex: number,
  cycleBarIndex: number,
  subdivision: Subdivision,
  gapBars: GapBars,
): StepEvent {
  const stepsPerBeat = getStepsPerBeat(subdivision);
  const normalizedStep =
    ((stepIndex % getStepsPerBar(subdivision)) + getStepsPerBar(subdivision)) %
    getStepsPerBar(subdivision);
  const beatIndex = Math.floor(normalizedStep / stepsPerBeat);
  const subdivisionIndex = normalizedStep % stepsPerBeat;
  const audible = isAudibleBar(cycleBarIndex, gapBars);

  return {
    barPhase: audible ? 'audible' : 'gap',
    beatIndex,
    subdivisionIndex,
    gapBarIndex: audible ? 0 : cycleBarIndex,
    isAccent: audible && beatIndex === 0 && subdivisionIndex === 0,
    shouldClick: audible,
  };
}
