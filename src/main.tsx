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
    <Toaster richColors closeButton position="top-right" />
  </React.StrictMode>
);
