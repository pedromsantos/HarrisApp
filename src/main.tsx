import './index.css';

import React from 'react';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'sonner';

import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');

createRoot(rootElement).render(
  <React.StrictMode>
    <App />
    <Toaster
      richColors
      closeButton
      position="top-center"
      offset="16px"
      expand={false}
      toastOptions={{
        style: {
          zIndex: 9999,
          width: 'max-content',
          maxWidth: '90vw',
          padding: '12px 16px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          pointerEvents: 'auto',
        },
      }}
    />
  </React.StrictMode>
);
