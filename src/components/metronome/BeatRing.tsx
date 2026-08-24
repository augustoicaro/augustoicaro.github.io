import { Pause, Play } from 'lucide-react';

import {
  SUBDIVISION_STEPS,
  type MetronomePosition,
  type Subdivision,
} from '../../lib/metronomeTiming';

interface BeatRingProps {
  isPlaying: boolean;
  position: MetronomePosition | null;
  subdivision: Subdivision;
  onToggle: () => void;
}

const BeatRing = ({
  isPlaying,
  position,
  subdivision,
  onToggle,
}: BeatRingProps) => {
  const isAudible = isPlaying && position?.barPhase === 'audible';
  const stepsPerBeat = SUBDIVISION_STEPS[subdivision];
  const markerCount = 4 * stepsPerBeat;
  const pulseKey = position
    ? `${position.barPhase}-${position.gapBarIndex}-${position.beatIndex}-${position.subdivisionIndex}`
    : 'idle';

  return (
    <div
      className="metronome-beat-ring"
      role="group"
      aria-label={`Four beat measure with ${subdivision} subdivisions`}
    >
      {Array.from({ length: markerCount }, (_, markerIndex) => {
        const beatIndex = Math.floor(markerIndex / stepsPerBeat);
        const subdivisionIndex = markerIndex % stepsPerBeat;
        const isPrimaryBeat = subdivisionIndex === 0;
        const isActive =
          isAudible &&
          position?.beatIndex === beatIndex &&
          position.subdivisionIndex === subdivisionIndex;
        const isDownbeat = isActive && beatIndex === 0 && isPrimaryBeat;
        const angle = (markerIndex / markerCount) * Math.PI * 2 - Math.PI / 2;
        const markerStyle = {
          left: `${50 + Math.cos(angle) * 50}%`,
          top: `${50 + Math.sin(angle) * 50}%`,
        };

        return (
          <span
            key={markerIndex}
            className={[
              'metronome-beat-marker',
              isPrimaryBeat
                ? 'metronome-beat-marker--primary'
                : 'metronome-beat-marker--subdivision',
              isActive ? 'metronome-beat-marker--active' : '',
              isDownbeat ? 'metronome-beat-marker--accent' : '',
            ].join(' ')}
            style={markerStyle}
            aria-hidden="true"
          >
            {isPrimaryBeat ? beatIndex + 1 : null}
          </span>
        );
      })}

      {isAudible && (
        <span
          key={pulseKey}
          className={[
            'metronome-tone-pulse',
            position?.subdivisionIndex === 0
              ? 'metronome-tone-pulse--beat'
              : 'metronome-tone-pulse--subdivision',
            position?.beatIndex === 0 && position.subdivisionIndex === 0
              ? 'metronome-tone-pulse--accent'
              : '',
          ].join(' ')}
          aria-hidden="true"
        />
      )}

      <button
        type="button"
        onClick={onToggle}
        className="metronome-play-button"
        aria-label={isPlaying ? 'Pause metronome' : 'Play metronome'}
        aria-pressed={isPlaying}
      >
        {isPlaying ? (
          <Pause size={34} strokeWidth={1.8} aria-hidden="true" />
        ) : (
          <Play
            size={36}
            strokeWidth={1.8}
            className="translate-x-0.5"
            aria-hidden="true"
          />
        )}
        <span>{isPlaying ? 'PAUSE' : 'PLAY'}</span>
      </button>
    </div>
  );
};

export default BeatRing;
