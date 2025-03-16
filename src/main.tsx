import './index.css';

import React from 'react';
import ReactDOM from 'react-dom/client';
import { Toaster } from 'sonner';

import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
    <Toaster richColors closeButton position="top-right" />
  </React.StrictMode>
);
