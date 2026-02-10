import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';
import os from 'os';

export async function about() {
    const projectRoot = process.cwd();
    const pkgPath = path.join(projectRoot, 'package.json');
    const ereactPath = path.join(projectRoot, 'ereact.json');

    // Premium Logo ASCII
    console.log(chalk.red.bold(`
    ███████╗██████╗ ███████╗ █████╗  ██████╗████████╗████████╗██╗  ██╗ ██████╗ ██╗  ██╗██╗██████╗ 
    ██╔════╝██╔══██╗██╔════╝██╔══██╗██╔════╝╚══██╔══╝╚══██╔══╝██║  ██║██╔═══██╗██║  ██║██║██╔══██╗
    █████╗  ██████╔╝█████╗  ███████║██║        ██║      ██║   ███████║██║   ██║███████║██║██████╔╝
    ██╔══╝  ██╔══██╗██╔══╝  ██╔══██║██║        ██║      ██║   ██╔══██║██║   ██║██╔══██║██║██╔══██╗
    ███████╗██║  ██║███████╗██║  ██║╚██████╗   ██║      ██║   ██║  ██║╚██████╔╝██║  ██║██║██║  ██║
    ╚══════╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝ ╚═════╝   ╚═╝      ╚═╝   ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝╚═╝╚═╝  ╚═╝
    `));

    console.log(chalk.white.bold(' 🚀 EreactThohir Framework ') + chalk.cyan('v1.5.0'));
    console.log(chalk.gray(' ────────────────────────────────────────────────────────────'));

    // Creator Info (Protected Signature)
    const _s = (p: string) => Buffer.from(p, 'base64').toString('utf-8');
    const signature = _s('RGhhZmEgTmF6dWxhIFBlcm1hZGkgKEthbmdQQ29kZSk=');
    const role = _s('Rm91bmRlciAmIExlYWQgQXJjaGl0ZWN0');
    const vision = _s('QnVpbGRpbmcgdGhlIGZ1dHVyZSBvZiBFbnRlcnByaXNlIFR5cGVTY3JpcHQu');

    console.log(chalk.yellow.bold(' 👨‍💻 Creator / Pencipta:'));
    console.log(`    Name:    ${chalk.white.bold(signature)}`);
    console.log(`    Role:    ${chalk.gray(role)}`);
    console.log(`    Vision:  ${chalk.italic(vision)}`);
    console.log(`    Official: ${chalk.blue.underline('https://github.com/dhafanazula')} (Verified)`);

    // Project Info
    if (fs.existsSync(pkgPath)) {
        const pkg = await fs.readJSON(pkgPath);
        console.log('\n' + chalk.magenta.bold(' 🏗️  Project Information / Informasi Proyek:'));
        console.log(`    Name:    ${chalk.white(pkg.name)}`);
        console.log(`    Version: ${chalk.white(pkg.version)}`);
        console.log(`    License: ${chalk.white(pkg.license || 'MIT')}`);
    }

    // System Info
    console.log('\n' + chalk.blue.bold(' 💻 System Environment / Lingkungan Sistem:'));
    console.log(`    Node:    ${chalk.white(process.version)}`);
    console.log(`    OS:      ${chalk.white(os.type())} (${os.release()})`);
    console.log(`    Arch:    ${chalk.white(process.arch)}`);

    // Framework Config
    if (fs.existsSync(ereactPath)) {
        const config = await fs.readJSON(ereactPath);
        console.log('\n' + chalk.green.bold(' ⚙️  Framework Configuration / Konfigurasi Framework:'));
        console.log(`    Template: ${chalk.white(config.template || 'Default')}`);
        console.log(`    UI Style: ${chalk.white(config.uiSystem || 'Official Rice UI')}`);
        console.log(`    Semouth:  ${chalk.white(config.installSemouth ? '✅ Installed (Terinstal)' : '❌ Not Installed (Belum Terinstal)')}`);
    }

    console.log('\n' + chalk.cyan.bold(' ⚡ Features Enabled / Fitur Aktif:'));
    const folders = [
        { path: 'app/Controllers', label: 'Controllers' },
        { path: 'app/Models', label: 'Models' },
        { path: 'database/migrations', label: 'Migrations' },
        { path: 'app/Services', label: 'Services' },
        { path: 'app/Services/AI', label: 'AI Drivers' },
        { path: 'app/Services/Payments', label: 'Payment Providers' }
    ];

    folders.forEach(item => {
        const exists = fs.existsSync(path.join(projectRoot, item.path));
        console.log(`    ${exists ? chalk.green('✔') : chalk.gray('✘')} ${item.label}`);
    });

    console.log('\n' + chalk.gray(' ────────────────────────────────────────────────────────────'));
    console.log(chalk.gray(' [EN] Built with power and simplicity. Happy coding!'));
    console.log(chalk.gray(' [ID] Dibangun dengan kekuatan dan kesederhanaan. Selamat ngoding!') + '\n');
}
