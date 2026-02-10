import chalk from 'chalk';
import { Kernel, Route } from '@ereactthohir/core';
import path from 'path';
import fs from 'fs-extra';

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
    // ts-node not found, fallback to native require
}

export async function serve(): Promise<void> {
    const projectRoot = process.cwd();

    if (!fs.existsSync(path.join(projectRoot, 'ereact.json'))) {
        console.error(chalk.red('Error: You are not in an EreactThohir project root.'));
        return;
    }

    // Try to use the project's own core if available to avoid singleton conflicts
    let ProjectRoute = Route;
    let ProjectKernel = Kernel;

    const projectCorePath = path.join(projectRoot, 'node_modules', '@ereactthohir', 'core');
    if (fs.existsSync(projectCorePath)) {
        try {
            const projectCore = require(projectCorePath);
            if (projectCore.Route) ProjectRoute = projectCore.Route;
            if (projectCore.Kernel) ProjectKernel = projectCore.Kernel;
            console.log(chalk.gray('   Using project-local @ereactthohir/core'));
        } catch (e) {
            // Fallback to CLI's core
        }
    }

    console.log(chalk.cyan.bold('\n🚀 EreactThohir Framework - Mode Jalan'));
    console.log(chalk.gray('─────────────────────────────────────────'));
    console.log(chalk.blue('🌱 Menginisialisasi kernel...'));

    try {
        // Dynamic import routes - try .js first, then .ts
        let webRoutesPath = path.join(projectRoot, 'routes/web.js');
        if (!fs.existsSync(webRoutesPath)) {
            webRoutesPath = path.join(projectRoot, 'routes/web.ts');
        }

        let apiRoutesPath = path.join(projectRoot, 'routes/api.js');
        if (!fs.existsSync(apiRoutesPath)) {
            apiRoutesPath = path.join(projectRoot, 'routes/api.ts');
        }

        if (fs.existsSync(webRoutesPath)) {
            try {
                console.log(chalk.blue('📂 Loading web routes...'));
                console.log(chalk.gray(`   File: ${webRoutesPath}`));
                console.log(chalk.gray(`   Routes before load: ${ProjectRoute.getRoutes().length}`));

                // Clear cache if exists
                try {
                    delete require.cache[require.resolve(webRoutesPath)];
                } catch (e) {
                    // Ignore if not in cache
                }

                require(webRoutesPath);
                console.log(chalk.gray(`   Routes after load: ${ProjectRoute.getRoutes().length}`));
                console.log(chalk.green('✓ Web routes loaded'));
            } catch (e) {
                console.error(chalk.red(`Failed to load web routes:`), e);
            }
        }
        if (fs.existsSync(apiRoutesPath)) {
            try {
                console.log(chalk.blue('📂 Loading API routes...'));
                // Clear cache if exists
                try {
                    delete require.cache[require.resolve(apiRoutesPath)];
                } catch (e) {
                    // Ignore if not in cache
                }
                require(apiRoutesPath);
                console.log(chalk.green('✓ API routes loaded'));
            } catch (e) {
                console.error(chalk.red(`Failed to load api routes:`), e);
            }
        }

        console.log(chalk.cyan(`📍 Total routes before Kernel: ${ProjectRoute.getRoutes().length}`));

        const kernel = new ProjectKernel();
        await kernel.handle();

        console.log(chalk.cyan(`📍 Registered ${ProjectRoute.getRoutes().length} route(s)`));

        const port = process.env.PORT ? parseInt(process.env.PORT) : 32026;

        const server = kernel.listen(port, () => {
            console.log(chalk.green(`\n✅ Server Berhasil Dijalankan!`));
            console.log(chalk.white(`   URL: `) + chalk.cyan.underline(`http://localhost:${port}`));
            console.log(chalk.gray('   Tekan Ctrl+C untuk menghentikan server\n'));
        });

        // Handle graceful shutdown
        process.on('SIGINT', () => {
            console.log(chalk.yellow('\n\n⚠️  Menghentikan server...'));
            server.close(() => {
                console.log(chalk.green('✅ Server berhasil dihentikan'));
                process.exit(0);
            });
        });

        process.on('SIGTERM', () => {
            console.log(chalk.yellow('\n\n⚠️  Menghentikan server...'));
            server.close(() => {
                console.log(chalk.green('✅ Server berhasil dihentikan'));
                process.exit(0);
            });
        });

        // Keep the process alive by keeping the event loop busy
        // This prevents the CLI from exiting after starting the server
        setInterval(() => {
            // Do nothing, just keep the process alive
        }, 1000 * 60 * 60); // Check every hour
    } catch (error) {
        console.error(chalk.red('Failed to start server:'), error);
        process.exit(1);
    }
}
