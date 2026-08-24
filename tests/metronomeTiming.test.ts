import assert from 'node:assert/strict';
import test from 'node:test';

import {
  clampBpm,
  createStepEvent,
  getGapCycleLength,
  getNextCycleBarIndex,
  getSecondsPerStep,
  getStepsPerBar,
  type GapBars,
  type Subdivision,
} from '../src/lib/metronomeTiming.js';

test('clampBpm enforces the inclusive 20-300 range', () => {
  assert.equal(clampBpm(19), 20);
  assert.equal(clampBpm(20), 20);
  assert.equal(clampBpm(120.4), 120);
  assert.equal(clampBpm(300), 300);
  assert.equal(clampBpm(301), 300);
  assert.equal(clampBpm(Number.NaN), 20);
});

test('subdivisions produce the required number of tones per 4/4 bar', () => {
  const expected: Array<[Subdivision, number]> = [
    ['quarter', 4],
    ['eighth', 8],
    ['sixteenth', 16],
  ];

  for (const [subdivision, steps] of expected) {
    assert.equal(getStepsPerBar(subdivision), steps);

    const events = Array.from({ length: steps }, (_, step) =>
      createStepEvent(step, 0, subdivision, 0),
    );

    assert.equal(events.filter((event) => event.shouldClick).length, steps);
    assert.equal(events.filter((event) => event.isAccent).length, 1);
    assert.equal(events[0]?.isAccent, true);
  }
});

test('step duration follows BPM and subdivision', () => {
  assert.equal(getSecondsPerStep(60, 'quarter'), 1);
  assert.equal(getSecondsPerStep(120, 'quarter'), 0.5);
  assert.equal(getSecondsPerStep(120, 'eighth'), 0.25);
  assert.equal(getSecondsPerStep(120, 'sixteenth'), 1 / 8);
});

test('gap mode alternates one audible bar with the selected silent bars', () => {
  for (const gapBars of [1, 2, 3, 4, 5] as GapBars[]) {
    assert.equal(getGapCycleLength(gapBars), gapBars + 1);

    const phases = Array.from({ length: gapBars + 1 }, (_, bar) =>
      createStepEvent(0, bar, 'quarter', gapBars).barPhase,
    );

    assert.deepEqual(phases, [
      'audible',
      ...Array.from({ length: gapBars }, () => 'gap' as const),
    ]);

    for (let bar = 1; bar <= gapBars; bar += 1) {
      const silentEvents = Array.from({ length: 4 }, (_, step) =>
        createStepEvent(step, bar, 'quarter', gapBars),
      );

      assert.equal(silentEvents.some((event) => event.shouldClick), false);
      assert.equal(silentEvents.some((event) => event.isAccent), false);
    }
  }
});

test('gap bars advance and wrap back to an audible downbeat', () => {
  const gapBars: GapBars = 2;
  let bar = 0;

  bar = getNextCycleBarIndex(bar, gapBars);
  assert.equal(bar, 1);
  assert.equal(createStepEvent(0, bar, 'quarter', gapBars).gapBarIndex, 1);

  bar = getNextCycleBarIndex(bar, gapBars);
  assert.equal(bar, 2);
  assert.equal(createStepEvent(0, bar, 'quarter', gapBars).gapBarIndex, 2);

  bar = getNextCycleBarIndex(bar, gapBars);
  const downbeat = createStepEvent(0, bar, 'quarter', gapBars);
  assert.equal(bar, 0);
  assert.equal(downbeat.barPhase, 'audible');
  assert.equal(downbeat.isAccent, true);
});
