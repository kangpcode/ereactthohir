
import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';
import crypto from 'crypto';

export async function generateKey(): Promise<void> {
    const projectRoot = process.cwd();
    const envPath = path.join(projectRoot, '.env');
    const envExamplePath = path.join(projectRoot, '.env.example');

    console.log(chalk.cyan.bold('\n🔐 EreactThohir Application Key Generator'));
    console.log(chalk.gray('─────────────────────────────────────────'));

    try {
        // Check if .env exists, if not, copy form .env.example
        if (!fs.existsSync(envPath)) {
            if (fs.existsSync(envExamplePath)) {
                console.log(chalk.yellow('⚠️  .env file not found. Creating from .env.example...'));
                await fs.copy(envExamplePath, envPath);
                console.log(chalk.green('✓ Created .env file'));
            } else {
                console.log(chalk.yellow('⚠️  .env file not found. Creating empty .env...'));
                await fs.writeFile(envPath, '');
                console.log(chalk.green('✓ Created empty .env file'));
            }
        }

        // Generate 32-byte key encoded in base64
        const key = `base64:${crypto.randomBytes(32).toString('base64')}`;
        console.log(chalk.blue(`🔑 Generated key: ${chalk.bold(key)}`));

        // Read current .env content
        let envContent = await fs.readFile(envPath, 'utf8');

        // Define regex for APP_KEY
        const keyRegex = /^APP_KEY=.*$/m;

        if (keyRegex.test(envContent)) {
            // Replace existing key
            envContent = envContent.replace(keyRegex, `APP_KEY=${key}`);
            console.log(chalk.blue('📝 Updating existing APP_KEY in .env...'));
        } else {
            // Append new key
            envContent += `\nAPP_KEY=${key}\n`;
            console.log(chalk.blue('📝 Appending APP_KEY to .env...'));
        }

        await fs.writeFile(envPath, envContent);

        console.log(chalk.green.bold('\n✅ Application key set successfully!'));
        console.log(chalk.gray('─────────────────────────────────────────\n'));

    } catch (error) {
        console.error(chalk.red('\n❌ Failed to generate key:'), error);
        process.exit(1);
    }
}
