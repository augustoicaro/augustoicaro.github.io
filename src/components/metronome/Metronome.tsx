import { ArrowLeft, Maximize2, Minus, Plus } from 'lucide-react';
import { useState } from 'react';

import { useMetronome } from '../../hooks/useMetronome';
import {
  MAX_BPM,
  MIN_BPM,
  SUBDIVISION_STEPS,
  clampBpm,
  type GapBars,
  type Subdivision,
} from '../../lib/metronomeTiming';
import BeatRing from './BeatRing';

interface MetronomeProps {
  onBack?: () => void;
  standalone?: boolean;
}

const SUBDIVISIONS: Array<{
  id: Subdivision;
  label: string;
  detail: string;
}> = [
  { id: 'quarter', label: 'QUARTER', detail: '1 per beat' },
  { id: 'eighth', label: 'EIGHTH', detail: '2 per beat' },
  { id: 'sixteenth', label: 'SIXTEENTH', detail: '4 per beat' },
];

const GAP_OPTIONS: GapBars[] = [0, 1, 2, 3, 4, 5];

const Metronome = ({ onBack, standalone = false }: MetronomeProps) => {
  const [bpm, setBpm] = useState(120);
  const [bpmDraft, setBpmDraft] = useState('120');
  const [subdivision, setSubdivision] =
    useState<Subdivision>('quarter');
  const [gapBars, setGapBars] = useState<GapBars>(0);
  const controller = useMetronome({ bpm, subdivision, gapBars });

  const setSafeBpm = (value: number) => {
    const nextBpm = clampBpm(value);
    setBpm(nextBpm);
    setBpmDraft(String(nextBpm));
  };

  const status = !controller.isPlaying
    ? 'READY // PRESS PLAY'
    : controller.position?.barPhase === 'gap'
      ? `GAP ${controller.position.gapBarIndex}/${gapBars} // KEEP COUNTING`
      : controller.position
        ? `AUDIBLE BAR // BEAT ${controller.position.beatIndex + 1}/4`
        : 'SYNCING...';

  const handleBack = () => {
    controller.pause();
    onBack?.();
  };

  return (
    <section className="mx-auto flex w-full max-w-3xl flex-col gap-5 pb-3">
      <header className="flex items-center justify-between gap-3 border-b border-matrix-dark-green pb-2">
        <div>
          <h2 className="text-lg font-bold text-white md:text-xl">
            METRONOME_TRAINER
          </h2>
          <p className="text-xs text-matrix-dark-green">
            FIXED_METER: 4/4 // ACCENT: BEAT_1
          </p>
        </div>
        {!standalone && onBack && (
          <div className="flex shrink-0 items-center gap-2">
            <a
              href="/metronome"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open metronome in an isolated page"
              className="flex items-center gap-1 border border-matrix-dark-green p-2 text-xs transition-colors hover:bg-matrix-green/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-matrix-green sm:px-2 sm:py-1"
            >
              <Maximize2 size={14} aria-hidden="true" />
              <span className="hidden sm:inline">FULLSCREEN</span>
            </a>
            <button
              type="button"
              onClick={handleBack}
              aria-label="Return to projects"
              className="flex items-center gap-1 border border-matrix-dark-green p-2 text-xs transition-colors hover:bg-matrix-green/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-matrix-green sm:px-2 sm:py-1"
            >
              <ArrowLeft size={14} aria-hidden="true" />
              <span className="hidden sm:inline">PROJECTS</span>
            </button>
          </div>
        )}
      </header>

      <div className="grid items-center gap-5 lg:grid-cols-[1fr_1.1fr]">
        <div className="order-2 space-y-4 lg:order-1">
          <fieldset className="border border-matrix-dark-green bg-matrix-dim/10 p-3">
            <legend className="px-1 text-xs font-bold text-matrix-dark-green">
              TEMPO_BPM
            </legend>

            <div className="mb-3 flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setSafeBpm(bpm - 1)}
                disabled={bpm <= MIN_BPM}
                className="metronome-step-button"
                aria-label="Decrease tempo by 1 BPM"
              >
                <Minus size={16} aria-hidden="true" />
              </button>
              <label className="flex items-end gap-1">
                <span className="sr-only">Tempo in beats per minute</span>
                <input
                  type="number"
                  min={MIN_BPM}
                  max={MAX_BPM}
                  inputMode="numeric"
                  value={bpmDraft}
                  onChange={(event) => setBpmDraft(event.currentTarget.value)}
                  onBlur={() => setSafeBpm(Number(bpmDraft))}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      setSafeBpm(Number(bpmDraft));
                    }
                  }}
                  className="w-24 border-b border-matrix-dark-green bg-transparent px-1 text-center text-3xl font-bold text-white outline-none focus:border-matrix-green"
                />
                <span className="pb-1 text-xs text-matrix-dark-green">
                  BPM
                </span>
              </label>
              <button
                type="button"
                onClick={() => setSafeBpm(bpm + 1)}
                disabled={bpm >= MAX_BPM}
                className="metronome-step-button"
                aria-label="Increase tempo by 1 BPM"
              >
                <Plus size={16} aria-hidden="true" />
              </button>
            </div>

            <input
              type="range"
              min={MIN_BPM}
              max={MAX_BPM}
              value={bpm}
              onChange={(event) =>
                setSafeBpm(Number(event.currentTarget.value))
              }
              className="metronome-range w-full"
              aria-label="Tempo from 20 to 300 BPM"
              aria-valuetext={`${bpm} beats per minute`}
            />
            <div
              className="mt-1 flex justify-between text-[10px] text-matrix-dark-green"
              aria-hidden="true"
            >
              <span>{MIN_BPM}</span>
              <span>{MAX_BPM}</span>
            </div>
          </fieldset>

          <fieldset className="border border-matrix-dark-green bg-matrix-dim/10 p-3">
            <legend className="px-1 text-xs font-bold text-matrix-dark-green">
              SUBDIVISION
            </legend>
            <div className="grid grid-cols-3 gap-2">
              {SUBDIVISIONS.map((option) => {
                const selected = subdivision === option.id;

                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setSubdivision(option.id)}
                    aria-pressed={selected}
                    className={[
                      'border px-1 py-2 text-center transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-matrix-green',
                      selected
                        ? 'border-matrix-green bg-matrix-green/20 text-white'
                        : 'border-matrix-dark-green text-matrix-dark-green hover:bg-matrix-green/10 hover:text-matrix-green',
                    ].join(' ')}
                  >
                    <span className="block text-xs font-bold md:text-sm">
                      {option.label}
                    </span>
                    <span className="block text-[10px] opacity-80">
                      {option.detail}
                    </span>
                  </button>
                );
              })}
            </div>
          </fieldset>

          <label className="flex items-center justify-between gap-3 border border-matrix-dark-green bg-matrix-dim/10 p-3">
            <span>
              <span className="block text-xs font-bold text-matrix-dark-green">
                GAP_TRAINING
              </span>
              <span className="block text-[10px] text-matrix-green/70">
                1 audible bar + silent bars
              </span>
            </span>
            <select
              value={gapBars}
              onChange={(event) =>
                setGapBars(Number(event.currentTarget.value) as GapBars)
              }
              className="border border-matrix-dark-green bg-matrix-black px-3 py-2 text-sm text-white outline-none focus:border-matrix-green"
              aria-label="Number of silent gap bars"
            >
              {GAP_OPTIONS.map((value) => (
                <option key={value} value={value}>
                  {value === 0 ? 'OFF' : `${value} BAR${value > 1 ? 'S' : ''}`}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="order-1 flex flex-col items-center justify-center lg:order-2">
          <BeatRing
            isPlaying={controller.isPlaying}
            position={controller.position}
            onToggle={controller.toggle}
            subdivision={subdivision}
          />
          <p
            className="mt-3 min-h-5 text-center text-xs font-bold tracking-wider text-matrix-green"
          >
            {status}
          </p>
          <p className="text-center text-[10px] text-matrix-dark-green">
            {SUBDIVISION_STEPS[subdivision] * 4} TONES/AUDIBLE_BAR
            {gapBars > 0 ? ` // ${gapBars} GAP_BAR${gapBars > 1 ? 'S' : ''}` : ''}
          </p>
        </div>
      </div>
    </section>
  );
};

export default Metronome;
