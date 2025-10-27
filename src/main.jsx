import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './theme.css';   // <-- MUST be last or near-last import
createRoot(document.getElementById('root')).render(<App />);
