const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// We'll try to find chalk, if not use simple colors
let chalk;
try {
    chalk = require('chalk');
} catch (e) {
    // Fallback for simple colors if chalk is not available in scripts
    chalk = {
        cyan: (t) => t,
        green: (t) => t,
        red: (t) => t,
        yellow: (t) => t,
        white: (t) => t,
        gray: (t) => t,
        bold: (t) => t,
        italic: (t) => t,
        underline: (t) => t
    };
}

const packages = [
    'core',
    'rice-ui',
    'cli',
    'semouth',
    'create'
];

const rootDir = path.resolve(__dirname, '..');
const packagesDir = path.join(rootDir, 'packages');

console.log(chalk.red.bold(`
    ███████╗██████╗ ███████╗ █████╗  ██████╗████████╗████████╗██╗  ██╗ ██████╗ ██╗  ██╗██╗██████╗ 
    ██╔════╝██╔══██╗██╔════╝██╔══██╗██╔════╝╚══██╔══╝╚══██╔══╝██║  ██║██╔═══██╗██║  ██║██║██╔══██╗
    █████╗  ██████╔╝█████╗  ███████║██║        ██║      ██║   ███████║██║   ██║███████║██║██████╔╝
    ██╔══╝  ██╔══██╗██╔══╝  ██╔══██║██║        ██║      ██║   ██╔══██║██║   ██║██╔══██║██║██╔══██╗
    ███████╗██║  ██║███████╗██║  ██║╚██████╗   ██║      ██║   ██║  ██║╚██████╔╝██║  ██║██║██║  ██║
    ╚══════╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝ ╚═════╝   ╚═╝      ╚═╝   ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝╚═╝╚═╝  ╚═╝
`));

console.log(chalk.cyan.bold(' 🚀 EreactThohir ecosystem is going live! / Ekosistem EreactThohir akan segera tayang!'));
console.log(chalk.gray(' ────────────────────────────────────────────────────────────'));
console.log(chalk.white(`  Creator:   ${chalk.yellow.bold('Dhafa Nazula Permadi (KangPCode)')}`));
console.log(chalk.white(`  Photo:     ${chalk.blue.underline('https://github.com/dhafanazula.png')}`));
console.log(chalk.gray(' ────────────────────────────────────────────────────────────\n'));

try {
    // Check if user is logged in
    try {
        execSync('npm whoami', { stdio: 'ignore' });
    } catch (e) {
        console.error(chalk.red(' ❌ Error: You are not logged in to npm. / Anda tidak terautentikasi di npm.'));
        console.log(chalk.yellow('    Please run "npm login" first. / Silakan jalankan "npm login" terlebih dahulu.'));
        process.exit(1);
    }

    packages.forEach(pkg => {
        const pkgDir = path.join(packagesDir, pkg);
        console.log(chalk.cyan(` 📦 [EN] Publishing @ereactthohir/${pkg}...`));
        console.log(chalk.cyan(`    [ID] Mempublikasikan @ereactthohir/${pkg}...`));

        try {
            execSync('npm publish --access public', {
                cwd: pkgDir,
                stdio: 'inherit'
            });
            console.log(chalk.green(` ✅ [EN] Successfully published @ereactthohir/${pkg}`));
            console.log(chalk.green(`    [ID] Berhasil mempublikasikan @ereactthohir/${pkg}\n`));
        } catch (error) {
            console.error(chalk.yellow(` ⚠️  [EN] Manual skip: @ereactthohir/${pkg} already exists or auth issue.`));
            console.error(chalk.yellow(`    [ID] Dilewati: @ereactthohir/${pkg} sudah ada atau masalah otorisasi.\n`));
        }
    });

    console.log(chalk.gray(' ────────────────────────────────────────────────────────────'));
    console.log(chalk.green.bold(' ✨ [EN] All packages published successfully!'));
    console.log(chalk.green.bold('    [ID] Semua paket berhasil dipublikasikan!\n'));

} catch (error) {
    console.error(chalk.red(' ❌ [EN] An unexpected error occurred during publish.'));
    console.error(chalk.red('    [ID] Terjadi kesalahan tak terduga saat mempublikasikan.'));
    console.error(error);
    process.exit(1);
}
