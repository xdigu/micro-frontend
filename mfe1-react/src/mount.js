import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

let root = null;

export function mount(el) {
  root = createRoot(el);
  root.render(<App />);
}

export function unmount(el) {
  if (root) {
    root.unmount();
    root = null;
  }
}
