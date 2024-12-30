import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import App from '../App';

// Get the root element
const rootElement = document.getElementById('root');

// Create a root
const root = createRoot(rootElement);

// Render the app
root.render(createElement(App)); 