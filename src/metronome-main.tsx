import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import MetronomeStandalone from './components/metronome/MetronomeStandalone';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MetronomeStandalone />
  </StrictMode>,
);
