import { registerRootComponent } from 'expo';
import { createElement } from 'react';
import App from '../App';

// Register the app as the root component
registerRootComponent(App);

// For web platform, also create the root and render
if (typeof document !== 'undefined') {
    const root = document.getElementById('root');
    if (root) {
        const { createRoot } = require('react-dom/client');
        const appRoot = createRoot(root);
        appRoot.render(createElement(App));
    }
} 