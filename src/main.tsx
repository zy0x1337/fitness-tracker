import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
// Selbst gehostete Schriften (offline-first, kein externes CDN).
import '@fontsource-variable/geist/index.css';
import '@fontsource-variable/geist-mono/index.css';
import './styles/theme.css';
import './styles/global.css';
import App from './App.tsx';

// Service Worker registrieren (autoUpdate via vite-plugin-pwa).
registerSW({ immediate: true });

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
