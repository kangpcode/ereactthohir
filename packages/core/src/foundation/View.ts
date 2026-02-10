import React from 'react';
import { renderToString } from 'react-dom/server';

// Import Rice UI styles
const riceCSS = `
/**
 * Rice UI - Core CSS Framework
 * The default and most powerful CSS framework for EreactThohir
 */

*, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

:root {
    --rice-primary-500: #3b82f6;
    --rice-primary-600: #2563eb;
    --rice-secondary-100: #f1f5f9;
    --rice-secondary-200: #e2e8f0;
    --rice-secondary-600: #475569;
    --rice-secondary-900: #0f172a;
    --rice-success-600: #059669;
    --rice-space-2: 0.5rem;
    --rice-space-4: 1rem;
    --rice-space-6: 1.5rem;
    --rice-space-8: 2rem;
    --rice-space-12: 3rem;
    --rice-space-16: 4rem;
    --rice-text-sm: 0.875rem;
    --rice-text-lg: 1.125rem;
    --rice-text-xl: 1.25rem;
    --rice-text-3xl: 1.875rem;
    --rice-text-5xl: 3rem;
    --rice-text-6xl: 3.75rem;
    --rice-text-7xl: 4.5rem;
    --rice-radius-lg: 0.5rem;
    --rice-radius-xl: 0.75rem;
    --rice-radius-2xl: 1rem;
    --rice-radius-full: 9999px;
    --rice-shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
    --rice-shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1);
    --rice-shadow-2xl: 0 25px 50px -12px rgb(0 0 0 / 0.25);
}

body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
}

.rice-min-h-screen { min-height: 100vh; }
.rice-bg-gradient { background: linear-gradient(135deg, #eff6ff 0%, #f3e8ff 50%, #fce7f3 100%); }
.rice-fixed { position: fixed; }
.rice-inset-0 { top: 0; right: 0; bottom: 0; left: 0; }
.rice-overflow-hidden { overflow: hidden; }
.rice-pointer-events-none { pointer-events: none; }
.rice-absolute { position: absolute; }
.rice-blur-3xl { filter: blur(64px); }
.rice-animate-pulse { animation: rice-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
.rice-relative { position: relative; }
.rice-z-10 { z-index: 10; }
.rice-p-6 { padding: 1.5rem; }
.rice-mb-16 { margin-bottom: 4rem; }
.rice-text-center { text-align: center; }
.rice-inline-flex { display: inline-flex; }
.rice-items-center { align-items: center; }
.rice-gap-2 { gap: 0.5rem; }
.rice-gap-4 { gap: 1rem; }
.rice-gap-6 { gap: 1.5rem; }
.rice-gap-8 { gap: 2rem; }
.rice-px-4 { padding-left: 1rem; padding-right: 1rem; }
.rice-py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
.rice-bg-white { background-color: white; }
.rice-glass { background: rgba(255, 255, 255, 0.6); backdrop-filter: blur(10px); }
.rice-rounded-full { border-radius: 9999px; }
.rice-rounded-lg { border-radius: 0.5rem; }
.rice-rounded-xl { border-radius: 0.75rem; }
.rice-rounded-2xl { border-radius: 1rem; }
.rice-shadow-lg { box-shadow: var(--rice-shadow-lg); }
.rice-shadow-xl { box-shadow: var(--rice-shadow-xl); }
.rice-shadow-2xl { box-shadow: var(--rice-shadow-2xl); }
.rice-border { border: 1px solid rgba(255, 255, 255, 0.2); }
.rice-text-5xl { font-size: 3rem; }
.rice-text-6xl { font-size: 3.75rem; }
.rice-text-7xl { font-size: 4.5rem; }
.rice-text-lg { font-size: 1.125rem; }
.rice-text-xl { font-size: 1.25rem; }
.rice-text-sm { font-size: 0.875rem; }
.rice-text-xs { font-size: 0.75rem; }
.rice-font-black { font-weight: 900; }
.rice-font-bold { font-weight: 700; }
.rice-font-semibold { font-weight: 600; }
.rice-font-medium { font-weight: 500; }
.rice-text-transparent { color: transparent; }
.rice-bg-clip-text { -webkit-background-clip: text; background-clip: text; }
.rice-gradient-primary { background: linear-gradient(to right, #4f46e5, #7c3aed, #ec4899); }
.rice-tracking-tight { letter-spacing: -0.025em; }
.rice-mb-4 { margin-bottom: 1rem; }
.rice-mb-8 { margin-bottom: 2rem; }
.rice-mb-12 { margin-bottom: 3rem; }
.rice-max-w-2xl { max-width: 42rem; }
.rice-mx-auto { margin-left: auto; margin-right: auto; }
.rice-flex { display: flex; }
.rice-flex-wrap { flex-wrap: wrap; }
.rice-justify-center { justify-content: center; }
.rice-grid { display: grid; }
.rice-grid-cols-1 { grid-template-columns: repeat(1, minmax(0, 1fr)); }
.rice-group { position: relative; }
.rice-p-6 { padding: 1.5rem; }
.rice-space-y-5 > * + * { margin-top: 1.25rem; }
.rice-space-y-4 > * + * { margin-top: 1rem; }
.rice-w-full { width: 100%; }
.rice-h-2 { height: 0.5rem; }
.rice-transition { transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1); }
.rice-transition-all { transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1); }
.rice-duration-300 { transition-duration: 300ms; }
.rice-hover-shadow-2xl:hover { box-shadow: var(--rice-shadow-2xl); }
.rice-hover-scale-105:hover { transform: scale(1.05); }
.rice-cursor-pointer { cursor: pointer; }
.rice-flex-col { flex-direction: column; }
.rice-justify-between { justify-content: space-between; }
.rice-mt-20 { margin-top: 5rem; }
.rice-pt-8 { padding-top: 2rem; }
.rice-border-t { border-top: 1px solid rgba(255, 255, 255, 0.3); }

@keyframes rice-pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
}

@keyframes rice-gradient {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
}

.rice-animate-gradient {
    background-size: 200% 200%;
    animation: rice-gradient 3s ease infinite;
}

@media (min-width: 768px) {
    .rice-md-p-10 { padding: 2.5rem; }
    .rice-md-grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .rice-md-text-xl { font-size: 1.25rem; }
    .rice-md-text-6xl { font-size: 3.75rem; }
    .rice-md-flex-row { flex-direction: row; }
}

@media (min-width: 1024px) {
    .rice-lg-p-12 { padding: 3rem; }
    .rice-lg-grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
    .rice-lg-grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
    .rice-lg-text-7xl { font-size: 4.5rem; }
}
`;

export class View {
    public static render(component: React.ReactElement, data: any = {}) {
        const content = renderToString(component);

        return `
            <!DOCTYPE html>
            <html lang="id">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>EreactThohir App</title>
                
                <!-- Google Fonts -->
                <link rel="preconnect" href="https://fonts.googleapis.com">
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
                
                <!-- Rice UI - Default CSS Framework -->
                <style id="rice-ui-core">
                    ${riceCSS}
                </style>
                
                <!-- Optional: Tailwind CSS (if user chooses during installation) -->
                <!-- <script src="https://cdn.tailwindcss.com"></script> -->
                
                <!-- Optional: Bootstrap (if user chooses during installation) -->
                <!-- <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet"> -->
            </head>
            <body>
                <div id="root">${content}</div>
                
                <!-- React for client-side hydration -->
                <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
                <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
                
                <script>
                    // Client-side hydration for interactive components
                    if (typeof React !== 'undefined' && typeof ReactDOM !== 'undefined') {
                        console.log('✅ React loaded - Rice UI Framework active');
                    }
                </script>
            </body>
            </html>
        `;
    }
}

export const view = View.render;
