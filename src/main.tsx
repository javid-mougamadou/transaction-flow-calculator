import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { initGA } from './utils/analytics';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

const root = ReactDOM.createRoot(rootElement);

// Initialize Google Analytics
initGA();

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then((registration) => {
        if (navigator.serviceWorker.controller) {
          navigator.serviceWorker.addEventListener('controllerchange', () => {
            window.location.reload();
          });
        }

        window.addEventListener('online', () => {
          registration.update();
          window.location.reload();
        });
      })
      .catch((error) => {
        console.error('Service worker registration failed:', error);
      });
  });
}
