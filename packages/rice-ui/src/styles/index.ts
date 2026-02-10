/**
 * Rice UI Styles
 * Export CSS as string for injection
 */

import * as fs from 'fs';
import * as path from 'path';

// Read the CSS file
const cssPath = path.join(__dirname, 'rice.css');
export const riceCSS = fs.readFileSync(cssPath, 'utf-8');

// Function to inject Rice UI styles
export function injectRiceStyles(): string {
    return `<style id="rice-ui-styles">${riceCSS}</style>`;
}

export default riceCSS;
