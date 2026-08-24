import MatrixRain from '../MatrixRain';
import Metronome from './Metronome';

const MetronomeStandalone = () => {
  return (
    <div className="relative h-[100dvh] min-h-[100dvh] overflow-y-auto overscroll-contain bg-matrix-black text-matrix-green">
      <MatrixRain />

      <main className="relative z-10 flex min-h-full items-start justify-center px-3 py-4 sm:px-6 sm:py-8 lg:items-center">
        <div className="w-full max-w-5xl border border-matrix-dark-green bg-matrix-black/90 p-3 shadow-[0_0_20px_rgba(0,255,65,0.2)] backdrop-blur-sm sm:p-5 md:p-6">
          <Metronome standalone />
        </div>
      </main>
    </div>
  );
};

export default MetronomeStandalone;
