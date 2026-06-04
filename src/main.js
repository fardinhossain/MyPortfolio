import './index.css';
import { renderApp, initApp } from './App.js';

// Render the full application into the root element
const root = document.getElementById('root');
root.innerHTML = renderApp();

// Initialize all interactive components
initApp();
