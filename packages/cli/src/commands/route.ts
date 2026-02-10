
import chalk from 'chalk';
import path from 'path';
import fs from 'fs-extra';
import { Route } from '@ereactthohir/core';

// Register ts-node to handle .ts files
try {
    require('ts-node').register({
        transpileOnly: true,
        compilerOptions: {
            module: 'CommonJS',
            jsx: 'react-jsx',
            esModuleInterop: true,
            target: 'ES2020',
            skipLibCheck: true,
            allowJs: true
        }
    });
} catch (e) {
    // ts-node not found
}

export async function listRoutes(): Promise<void> {
    const projectRoot = process.cwd();

    if (!fs.existsSync(path.join(projectRoot, 'ereact.json'))) {
        console.error(chalk.red('Error: You are not in an EreactThohir project root.'));
        return;
    }

    console.log(chalk.cyan.bold('\n🗺️  EreactThohir Route List'));
    console.log(chalk.gray('─────────────────────────────────────────'));

    // Try to use the project's own core if available
    let ProjectRoute = Route;

    const projectCorePath = path.join(projectRoot, 'node_modules', '@ereactthohir', 'core');
    if (fs.existsSync(projectCorePath)) {
        try {
            const projectCore = require(projectCorePath);
            if (projectCore.Route) ProjectRoute = projectCore.Route;
        } catch (e) {
            // Fallback
        }
    }

    // Load routes
    const routeFiles = [
        path.join(projectRoot, 'routes/web.js'),
        path.join(projectRoot, 'routes/web.ts'),
        path.join(projectRoot, 'routes/api.js'),
        path.join(projectRoot, 'routes/api.ts')
    ];

    let loaded = false;
    for (const file of routeFiles) {
        if (fs.existsSync(file)) {
            try {
                // Clear cache
                try { delete require.cache[require.resolve(file)]; } catch (e) { }
                require(file);
                loaded = true;
            } catch (e) {
                console.error(chalk.red(`Failed to load ${path.basename(file)}:`), e);
            }
        }
    }

    if (!loaded) {
        console.log(chalk.yellow('⚠️  No route files found in routes/ directory.'));
        return;
    }

    const routes = ProjectRoute.getRoutes();

    if (routes.length === 0) {
        console.log(chalk.yellow('No routes registered.'));
        return;
    }

    console.log(chalk.white(`Found ${chalk.bold(routes.length)} routes:\n`));

    // Headers
    console.log(
        chalk.gray(
            pad('Method', 10) +
            pad('URI', 30) +
            pad('Name', 20) +
            pad('Action', 30)
        )
    );
    console.log(chalk.gray('─'.repeat(90)));

    // Rows
    for (const route of routes) {
        const method = route.method.toUpperCase();
        let methodColor = chalk.white;
        if (method === 'GET') methodColor = chalk.blue;
        if (method === 'POST') methodColor = chalk.yellow;
        if (method === 'PUT' || method === 'PATCH') methodColor = chalk.cyan;
        if (method === 'DELETE') methodColor = chalk.red;

        console.log(
            methodColor(pad(method, 10)) +
            chalk.white(pad(route.path, 30)) +
            chalk.gray(pad(route.name || '-', 20)) +
            chalk.gray(pad(typeof route.handler === 'function' ? 'Closure' : JSON.stringify(route.handler), 30))
        );
    }
    console.log('');
}

function pad(str: string, len: number): string {
    return str + ' '.repeat(Math.max(0, len - str.length));
}
