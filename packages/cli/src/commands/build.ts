import chalk from 'chalk';
import path from 'path';
import fs from 'fs-extra';
import { build as esbuild } from 'esbuild';

export async function buildWeb(): Promise<void> {
    const projectRoot = process.cwd();
    const distDir = path.join(projectRoot, 'dist');

    if (!fs.existsSync(path.join(projectRoot, 'ereact.json'))) {
        console.error(chalk.red('Error: You are not in an EreactThohir project root.'));
        return;
    }

    console.log(chalk.cyan.bold('\n🏗️  EreactThohir Framework - Building for Web'));
    console.log(chalk.gray('─────────────────────────────────────────'));

    try {
        // Clean dist directory
        console.log(chalk.blue('🧹 Cleaning dist directory...'));
        await fs.remove(distDir);
        await fs.ensureDir(distDir);
        console.log(chalk.green('✓ Dist directory cleaned'));

        // Find entry point
        const viewsDir = path.join(projectRoot, 'resources/views');
        const entryFile = path.join(viewsDir, 'HomeScreen.tsx');

        if (!fs.existsSync(entryFile)) {
            console.error(chalk.red(`Error: Entry file not found at ${entryFile}`));
            return;
        }

        console.log(chalk.blue('📦 Bundling application...'));
        console.log(chalk.gray(`   Entry: ${entryFile}`));

        // Create a temporary entry file that includes React DOM rendering
        const tempEntryFile = path.join(projectRoot, '.ereact-build-entry.tsx');
        const entryContent = `
import React from 'react';
import ReactDOM from 'react-dom/client';
import HomeScreen from './resources/views/HomeScreen';

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<HomeScreen />);
`;
        await fs.writeFile(tempEntryFile, entryContent);

        // Build with esbuild
        await esbuild({
            entryPoints: [tempEntryFile],
            bundle: true,
            minify: true,
            sourcemap: true,
            outfile: path.join(distDir, 'bundle.js'),
            platform: 'browser',
            target: ['es2020'],
            loader: {
                '.tsx': 'tsx',
                '.ts': 'ts',
                '.jsx': 'jsx',
                '.js': 'js',
            },
            jsxFactory: 'React.createElement',
            jsxFragment: 'React.Fragment',
            define: {
                'process.env.NODE_ENV': '"production"',
            },
            external: [],
        });

        // Clean up temp file
        await fs.remove(tempEntryFile);

        console.log(chalk.green('✓ Bundle created'));

        // Create HTML file
        console.log(chalk.blue('📄 Generating HTML...'));
        const htmlContent = `<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EreactThohir App</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        body {
            font-family: 'Inter', sans-serif;
            margin: 0;
            padding: 0;
        }
        @keyframes gradient {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
        }
        .animate-gradient {
            background-size: 200% 200%;
            animation: gradient 3s ease infinite;
        }
    </style>
</head>
<body>
    <div id="root"></div>
    <script src="./bundle.js"></script>
</body>
</html>`;

        await fs.writeFile(path.join(distDir, 'index.html'), htmlContent);
        console.log(chalk.green('✓ HTML generated'));

        // Copy public assets if they exist
        const publicDir = path.join(projectRoot, 'public');
        if (fs.existsSync(publicDir)) {
            console.log(chalk.blue('📁 Copying public assets...'));
            await fs.copy(publicDir, distDir, {
                filter: (src) => !src.includes('node_modules'),
            });
            console.log(chalk.green('✓ Public assets copied'));
        }

        // Get bundle size
        const bundleStats = await fs.stat(path.join(distDir, 'bundle.js'));
        const bundleSize = (bundleStats.size / 1024).toFixed(2);

        console.log(chalk.green.bold('\n✅ Build completed successfully!'));
        console.log(chalk.gray('─────────────────────────────────────────'));
        console.log(chalk.white('   Output directory: ') + chalk.cyan(distDir));
        console.log(chalk.white('   Bundle size: ') + chalk.cyan(`${bundleSize} KB`));
        console.log(chalk.gray('\n   To serve the build, run:'));
        console.log(chalk.cyan('   npx serve dist\n'));

    } catch (error) {
        console.error(chalk.red('\n❌ Build failed:'), error);
        process.exit(1);
    }
}

export async function buildAndroid(): Promise<void> {
    console.log(chalk.yellow('🚧 Android build is not yet implemented'));
    console.log(chalk.gray('This feature is coming soon!'));
}

export async function buildIOS(): Promise<void> {
    console.log(chalk.yellow('🚧 iOS build is not yet implemented'));
    console.log(chalk.gray('This feature is coming soon!'));
}
