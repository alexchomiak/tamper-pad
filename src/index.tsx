import React from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';

// Mount the app into a new div
const container = document.createElement('div');
document.body.appendChild(container);

const root = createRoot(container);
root.render(<App />);