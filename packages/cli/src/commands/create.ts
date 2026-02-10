import inquirer from 'inquirer';
import chalk from 'chalk';
import fs from 'fs-extra';
import path from 'path';
import ora from 'ora';

export async function create(name: string) {
    console.log(chalk.red.bold(`
    ███████╗██████╗ ███████╗ █████╗  ██████╗████████╗████████╗██╗  ██╗ ██████╗ ██╗  ██╗██╗██████╗ 
    ██╔════╝██╔══██╗██╔════╝██╔══██╗██╔════╝╚══██╔══╝╚══██╔══╝██║  ██║██╔═══██╗██║  ██║██║██╔══██╗
    █████╗  ██████╔╝█████╗  ███████║██║        ██║      ██║   ███████║██║   ██║███████║██║██████╔╝
    ██╔══╝  ██╔══██╗██╔══╝  ██╔══██║██║        ██║      ██║   ██╔══██║██║   ██║██╔══██║██║██╔══██╗
    ███████╗██║  ██║███████╗██║  ██║╚██████╗   ██║      ██║   ██║  ██║╚██████╔╝██║  ██║██║██║  ██║
    ╚══════╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝ ╚═════╝   ╚═╝      ╚═╝   ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝╚═╝╚═╝  ╚═╝
    `));
    console.log(chalk.blue(`\n  🚀 [EN] Initializing EreactThohir Project: ${chalk.bold(name)}`));
    console.log(chalk.blue(`     [ID] Inisialisasi Proyek EreactThohir: ${chalk.bold(name)}`));
    console.log(chalk.gray(`     Powered by ${chalk.white.bold('Dhafa Nazula Permadi')} (KangPCode)\n`));

    let answers;

    if (process.env.CI) {
        console.log(chalk.yellow('   Run in automated CI mode (Skipping prompts)'));
        answers = {
            projectType: 'Fullstack (Mobile + Web)',
            renderingMode: 'Hybrid',
            database: 'sawit.db (default lightweight embedded DB)',
            uiSystem: 'Rice UI (default, official)',
            template: 'Enterprise App Template'
        };
    } else {
        const questions = [
            {
                type: 'list',
                name: 'projectType',
                message: 'What type of app do you want to build?',
                choices: [
                    'Mobile Native (Android)',
                    'Mobile Native (iOS)',
                    'Mobile Native (Android + iOS)',
                    'Web App',
                    'PWA',
                    'Fullstack (Mobile + Web)'
                ]
            },
            {
                type: 'list',
                name: 'renderingMode',
                message: 'Choose rendering mode:',
                choices: ['SPA', 'SSR', 'Hybrid']
            },
            {
                type: 'list',
                name: 'database',
                message: 'Choose database:',
                choices: ['sawit.db (default lightweight embedded DB)', 'MySQL', 'PostgreSQL', 'MongoDB']
            },
            {
                type: 'list',
                name: 'uiSystem',
                message: 'UI Style:',
                choices: [
                    'Rice UI (default, official)',
                    'Tailwind CSS',
                    'Bootstrap 5',
                    'JokoUI',
                    'DaisyUI',
                    'Mantine',
                    'Material UI',
                    'Ant Design',
                    'Chakra UI',
                    'Shadcn/ui',
                    'None (Custom CSS)'
                ]
            },
            {
                type: 'list',
                name: 'template',
                message: 'Choose a starter template:',
                choices: [
                    'None (Blank)',
                    'Mobile App Starter',
                    'Admin Dashboard',
                    'Authentication Starter',
                    'Enterprise App Template',
                    'SaaS Template',
                    'Ecommerce App',
                    'Portfolio Template',
                    'Personal Blog Template',
                    'CMS Template'
                ]
            }
        ];

        answers = await inquirer.prompt(questions);

        // If web-based project, offer Semouth installation
        if (['Web App', 'PWA', 'Fullstack (Mobile + Web)'].includes(answers.projectType)) {
            const semouthQuestions = [
                {
                    type: 'confirm',
                    name: 'installSemouth',
                    message: 'Would you like to install Semouth (pre-built authentication & scaffolding)?',
                    default: true
                }
            ];

            const semouthAnswers = await inquirer.prompt(semouthQuestions);
            answers.installSemouth = semouthAnswers.installSemouth;

            if (answers.installSemouth) {
                const semouthComponentQuestions = [
                    {
                        type: 'checkbox',
                        name: 'semouthComponents',
                        message: 'Select Semouth components to install:',
                        choices: [
                            { name: 'Authentication (Login, Register, Password Reset)', value: 'auth', checked: true },
                            { name: 'User Management Dashboard', value: 'users', checked: true },
                            { name: 'Role & Permission System', value: 'rbac', checked: false },
                            { name: 'Email Verification', value: 'email-verification', checked: false },
                            { name: 'Two-Factor Authentication', value: '2fa', checked: false }
                        ]
                    }
                ];

                const semouthComponentAnswers = await inquirer.prompt(semouthComponentQuestions);
                answers.semouthComponents = semouthComponentAnswers.semouthComponents;
            }
        }
    }

    const spinner = ora('Scaffolding project...').start();

    try {
        const projectDir = path.resolve(process.cwd(), name);
        if (fs.existsSync(projectDir)) {
            spinner.fail('Directory already exists!');
            process.exit(1);
        }

        await fs.ensureDir(projectDir);

        // Define Laravel-like structure
        const structure = [
            'app/Controllers',
            'app/Services',
            'app/Models',
            'app/Providers',
            'app/Middleware',
            'app/Jobs',
            'app/Policies',
            'database/migrations',
            'database/seeders',
            'database/factories',
            'resources/views',
            'resources/rice-ui',
            'resources/assets',
            'routes',
            'config',
            'storage',
            'tests'
        ];

        for (const dir of structure) {
            await fs.ensureDir(path.join(projectDir, dir));
        }

        // Write routes/web.ts
        await fs.writeFile(path.join(projectDir, 'routes/web.ts'), `import { Route } from '@ereactthohir/core';

Route.get('/', (req, res) => {
    return res.view('Welcome');
});
`);

        // Write Welcome component with dynamic UI System
        const welcomeContent = generateWelcomePage(answers.uiSystem, name);
        await fs.writeFile(path.join(projectDir, 'resources/views/Welcome.tsx'), welcomeContent);

        // Write routes/api.ts
        await fs.writeFile(path.join(projectDir, 'routes/api.ts'), `import { Route } from '@ereactthohir/core';

Route.group({ prefix: '/api' }, () => {
    Route.get('/user', (req, res) => {
        return { name: 'John Doe' };
    });
});
`);

        // Write routes/mobile.ts
        await fs.writeFile(path.join(projectDir, 'routes/mobile.ts'), `import { Route } from '@ereactthohir/core';

Route.screen('Home', () => {
    // Screen component
});
`);

        // Write ereactthohir.config.ts
        await fs.writeFile(path.join(projectDir, 'ereactthohir.config.ts'), `export default {
    name: process.env.APP_NAME || '${name}',
    env: process.env.APP_ENV || 'local',
    debug: process.env.APP_DEBUG === 'true',
    url: process.env.APP_URL || 'http://localhost',
    database: {
        driver: process.env.DB_DRIVER || '${answers.database.includes('sawit') ? 'sawit' : answers.database.toLowerCase()}',
        connection: process.env.DB_CONNECTION || 'default'
    },
    template: '${answers.template}'
};
`);

        // Write README.md with template info
        await fs.writeFile(path.join(projectDir, 'README.md'), `# ${name}

This project was created with EreactThohir using the **${answers.template}** template.

## Getting Started

1. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

2. Run development server:
   \`\`\`bash
   ereact jalan
   \`\`\`
`);

        // Write .env
        await fs.writeFile(path.join(projectDir, '.env'), `APP_NAME=${name}
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost

DB_CONNECTION=default
DB_DRIVER=${answers.database.includes('sawit') ? 'sawit' : answers.database.toLowerCase()}
`);

        // Write .env.example
        await fs.copy(path.join(projectDir, '.env'), path.join(projectDir, '.env.example'));

        // Write config/app.json
        await fs.writeJSON(path.join(projectDir, 'config/app.json'), {
            name,
            version: '1.0.0',
            providers: [
                "App\\Providers\\RouteServiceProvider",
                "App\\Providers\\AuthServiceProvider"
            ]
        }, { spaces: 2 });

        // Write ereact.json for project metadata
        await fs.writeJSON(path.join(projectDir, 'ereact.json'), {
            name,
            template: answers.template,
            uiSystem: answers.uiSystem,
            installSemouth: answers.installSemouth,
            createdAt: new Date().toISOString()
        }, { spaces: 2 });

        // Generate template structure based on selection
        if (answers.template !== 'None (Blank)') {
            spinner.text = `Generating ${answers.template} template...`;
            await generateTemplateStructure(projectDir, answers.template, answers.uiSystem);
        }

        // Install Semouth if selected
        if (answers.installSemouth) {
            spinner.text = 'Installing Semouth components...';
            await installSemouthComponents(projectDir, answers.semouthComponents);
        }

        // Write package.json
        const dependencies: any = {
            "@ereactthohir/core": "^1.3.0",
            "@ereactthohir/rice-ui": "^1.3.0",
            "react": "18.2.0",
            "react-dom": "18.2.0"
        };

        // Add UI System dependencies
        const uiDependencies = getUIDependencies(answers.uiSystem);
        Object.assign(dependencies, uiDependencies);

        // Add Template-specific dependencies
        const templateDependencies = getTemplateDependencies(answers.template);
        Object.assign(dependencies, templateDependencies);

        // Add Semouth dependencies if installed
        if (answers.installSemouth) {
            dependencies["@ereactthohir/semouth"] = "^1.3.0";
        }

        // Write Global CSS
        await fs.ensureDir(path.join(projectDir, 'resources/css'));
        let globalCSS = '';
        if (answers.uiSystem === 'Rice UI (default, official)') {
            globalCSS = await fs.readFile(path.join(__dirname, '../../rice-ui/src/styles/rice.css'), 'utf-8');
        } else if (answers.uiSystem === 'JokoUI') {
            globalCSS = await fs.readFile(path.join(__dirname, '../../rice-ui/src/styles/joko.css'), 'utf-8');
        }

        if (globalCSS) {
            await fs.writeFile(path.join(projectDir, 'resources/css/app.css'), globalCSS);
        }

        // Configuration for non-default systems
        if (answers.uiSystem !== 'Rice UI (default, official)') {
            spinner.text = 'Configuring UI system...';
            await configureUISystem(projectDir, answers.uiSystem);
        }

        await fs.writeJSON(path.join(projectDir, 'package.json'), {
            name,
            version: '0.0.1',
            scripts: {
                "dev": "ereact jalan",
                "build": "ereact build",
                "test": "ereact test"
            },
            dependencies,
            devDependencies: {
                "@ereactthohir/cli": "^1.3.0",
                "typescript": "^5.0.0",
                "@types/react": "^18.0.0",
                "@types/react-dom": "^18.0.0",
                ...getUIDevDependencies(answers.uiSystem)
            }
        }, { spaces: 2 });

        spinner.succeed(chalk.green('Project created successfully!'));

        console.log(chalk.yellow('\nNext steps:'));
        console.log(`  cd ${name}`);
        console.log('  npm install');
        console.log('  ereact jalan\n');

    } catch (error) {
        spinner.fail('Failed to create project.');
        console.error(error);
    }
}

/**
 * Install Semouth components (auth scaffolding similar to Laravel Breeze)
 */
async function installSemouthComponents(projectDir: string, components: string[]): Promise<void> {
    const semouthDir = path.join(projectDir, 'app/Semouth');
    await fs.ensureDir(semouthDir);

    // Install Authentication
    if (components.includes('auth')) {
        await fs.ensureDir(path.join(projectDir, 'app/Controllers/Auth'));
        await fs.writeFile(path.join(projectDir, 'app/Controllers/Auth/LoginController.ts'), `import { Controller } from '@ereactthohir/core';

export class LoginController extends Controller {
    /**
     * Show the login form
     */
    public showLoginForm(req: any, res: any) {
        return res.view('auth.login');
    }

    /**
     * Handle login request
     */
    public async store(req: any, res: any) {
        const { email, password } = req.only('email', 'password');
        
        // Validate credentials
        try {
            const user = await req.app.make('auth').attempt(email, password);
            req.session.set('user_id', user.id);
            return res.redirect('/');
        } catch (error) {
            return res.back().withErrors({ email: 'Invalid credentials' });
        }
    }

    /**
     * Handle logout
     */
    public logout(req: any, res: any) {
        req.session.destroy();
        return res.redirect('/login');
    }
}
`);

        await fs.writeFile(path.join(projectDir, 'app/Controllers/Auth/RegisterController.ts'), `import { Controller } from '@ereactthohir/core';

export class RegisterController extends Controller {
    /**
     * Show the registration form
     */
    public showRegistrationForm(req: any, res: any) {
        return res.view('auth.register');
    }

    /**
     * Handle registration request
     */
    public async store(req: any, res: any) {
        const { name, email, password, password_confirmation } = req.all();
        
        // Validate input
        await req.validate({
            name: 'required|string|max:255',
            email: 'required|email|unique:users',
            password: 'required|min:8|confirmed'
        });

        const user = await req.app.make('auth').create({
            name, email, password
        });

        req.session.set('user_id', user.id);
        return res.redirect('/');
    }
}
`);

        // Generate Auth Views (UI/UX)
        await fs.ensureDir(path.join(projectDir, 'resources/views/auth'));

        await fs.writeFile(path.join(projectDir, 'resources/views/auth/login.tsx'), `import React from 'react';

export default function Login() {
    return (
        <div className="rice-min-h-screen rice-bg-secondary-50 rice-flex rice-items-center rice-justify-center rice-p-6">
            <div className="rice-w-full rice-max-w-md rice-bg-white rice-p-10 rice-rounded-[32px] rice-shadow-2xl rice-border rice-relative rice-overflow-hidden">
                <div className="rice-absolute rice-top-0 rice-left-0 rice-w-full rice-h-2 rice-gradient-primary"></div>
                
                <div className="rice-text-center rice-mb-10">
                    <div className="rice-w-16 rice-h-16 rice-bg-secondary-900 rice-rounded-2xl rice-flex rice-items-center rice-justify-center rice-text-white rice-font-black rice-text-2xl rice-mx-auto rice-mb-6">E</div>
                    <h1 className="rice-text-3xl rice-font-black rice-text-secondary-900 rice-mb-2">Welcome Back</h1>
                    <p className="rice-text-secondary-500 rice-font-medium">Please enter your details to sign in.</p>
                </div>

                <form className="rice-space-y-6">
                    <div>
                        <label className="rice-block rice-text-xs rice-font-black rice-text-secondary-400 rice-uppercase rice-tracking-widest rice-mb-2">Email Address</label>
                        <input 
                            type="email" 
                            className="rice-w-full rice-px-6 rice-py-4 rice-bg-secondary-50 rice-border rice-rounded-xl rice-focus-outline-none rice-focus-border-primary-500 rice-transition-all"
                            placeholder="name@company.com"
                        />
                    </div>
                    <div>
                        <div className="rice-flex rice-justify-between rice-mb-2">
                            <label className="rice-block rice-text-xs rice-font-black rice-text-secondary-400 rice-uppercase rice-tracking-widest">Password</label>
                            <a href="#" className="rice-text-xs rice-font-bold rice-text-primary-500 rice-hover-text-primary-600">Forgot?</a>
                        </div>
                        <input 
                            type="password" 
                            className="rice-w-full rice-px-6 rice-py-4 rice-bg-secondary-50 rice-border rice-rounded-xl rice-focus-outline-none rice-focus-border-primary-500 rice-transition-all"
                            placeholder="••••••••"
                        />
                    </div>

                    <button className="rice-w-full rice-py-4 rice-bg-secondary-900 rice-text-white rice-rounded-xl rice-font-black rice-shadow-lg rice-hover-scale-[1.02] rice-transition-all rice-active-scale-95">
                        Sign In
                    </button>
                </form>

                <div className="rice-mt-10 rice-pt-10 rice-border-t rice-text-center">
                    <p className="rice-text-sm rice-text-secondary-500">
                        Don't have an account? <a href="/auth/register" className="rice-font-black rice-text-secondary-900 rice-hover-text-primary-500 rice-transition-all">Sign up for free</a>
                    </p>
                </div>
            </div>
        </div>
    );
}
`);

        await fs.writeFile(path.join(projectDir, 'resources/views/auth/register.tsx'), `import React from 'react';

export default function Register() {
    return (
        <div className="rice-min-h-screen rice-bg-secondary-50 rice-flex rice-items-center rice-justify-center rice-p-6">
            <div className="rice-w-full rice-max-w-md rice-bg-white rice-p-10 rice-rounded-[32px] rice-shadow-2xl rice-border rice-relative rice-overflow-hidden">
                <div className="rice-absolute rice-top-0 rice-left-0 rice-w-full rice-h-2 rice-gradient-primary"></div>
                
                <div className="rice-text-center rice-mb-10">
                    <div className="rice-w-16 rice-h-16 rice-bg-secondary-900 rice-rounded-2xl rice-flex rice-items-center rice-justify-center rice-text-white rice-font-black rice-text-2xl rice-mx-auto rice-mb-6">E</div>
                    <h1 className="rice-text-3xl rice-font-black rice-text-secondary-900 rice-mb-2">Create Account</h1>
                    <p className="rice-text-secondary-500 rice-font-medium">Join thousands of developers worldwide.</p>
                </div>

                <form className="rice-space-y-5">
                    <div>
                        <label className="rice-block rice-text-xs rice-font-black rice-text-secondary-400 rice-uppercase rice-tracking-widest rice-mb-2">Full Name</label>
                        <input 
                            type="text" 
                            className="rice-w-full rice-px-6 rice-py-4 rice-bg-secondary-50 rice-border rice-rounded-xl rice-focus-outline-none rice-focus-border-primary-500 rice-transition-all"
                            placeholder="John Doe"
                        />
                    </div>
                    <div>
                        <label className="rice-block rice-text-xs rice-font-black rice-text-secondary-400 rice-uppercase rice-tracking-widest rice-mb-2">Email Address</label>
                        <input 
                            type="email" 
                            className="rice-w-full rice-px-6 rice-py-4 rice-bg-secondary-50 rice-border rice-rounded-xl rice-focus-outline-none rice-focus-border-primary-500 rice-transition-all"
                            placeholder="name@company.com"
                        />
                    </div>
                    <div>
                        <label className="rice-block rice-text-xs rice-font-black rice-text-secondary-400 rice-uppercase rice-tracking-widest rice-mb-2">Password</label>
                        <input 
                            type="password" 
                            className="rice-w-full rice-px-6 rice-py-4 rice-bg-secondary-50 rice-border rice-rounded-xl rice-focus-outline-none rice-focus-border-primary-500 rice-transition-all"
                            placeholder="••••••••"
                        />
                    </div>

                    <div className="rice-flex rice-items-center rice-gap-2 rice-mb-6">
                        <input type="checkbox" className="rice-w-4 rice-h-4" id="terms" />
                        <label htmlFor="terms" className="rice-text-xs rice-text-secondary-500 rice-font-medium">I agree to the <a href="#" className="rice-text-primary-500">Terms & Conditions</a></label>
                    </div>

                    <button className="rice-w-full rice-py-4 rice-bg-secondary-900 rice-text-white rice-rounded-xl rice-font-black rice-shadow-lg rice-hover-scale-[1.02] rice-transition-all rice-active-scale-95">
                        Create Account
                    </button>
                </form>

                <div className="rice-mt-8 rice-pt-8 rice-border-t rice-text-center">
                    <p className="rice-text-sm rice-text-secondary-500">
                        Already have an account? <a href="/auth/login" className="rice-font-black rice-text-secondary-900 rice-hover-text-primary-500 rice-transition-all">Log in</a>
                    </p>
                </div>
            </div>
        </div>
    );
}
`);

        // Add auth routes
        const authRoutesContent = `
import { LoginController } from '../app/Controllers/Auth/LoginController';
import { RegisterController } from '../app/Controllers/Auth/RegisterController';

Route.group({ prefix: '/auth' }, () => {
    Route.get('/login', [LoginController, 'showLoginForm']).name('login');
    Route.post('/login', [LoginController, 'store']).name('login.store');
    Route.post('/logout', [LoginController, 'logout']).name('logout');
    
    Route.get('/register', [RegisterController, 'showRegistrationForm']).name('register');
    Route.post('/register', [RegisterController, 'store']).name('register.store');
});
`;

        const webRoutesPath = path.join(projectDir, 'routes/web.ts');
        const existingRoutes = await fs.readFile(webRoutesPath, 'utf-8');
        await fs.writeFile(webRoutesPath, existingRoutes + '\n' + authRoutesContent);
    }

    // Install User Management
    if (components.includes('users')) {
        await fs.writeFile(path.join(projectDir, 'app/Controllers/UserController.ts'), `import { Controller } from '@ereactthohir/core';

export class UserController extends Controller {
    /**
     * Display all users
     */
    public async index(req: any, res: any) {
        const users = await req.app.make('db').table('users').paginate(15);
        return res.json(users);
    }

    /**
     * Display user profile
     */
    public async show(req: any, res: any) {
        const user = await req.app.make('db').table('users')
            .where('id', req.param('id'))
            .first();
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        return res.json(user);
    }

    /**
     * Update user
     */
    public async update(req: any, res: any) {
        const { name, email } = req.only('name', 'email');
        
        await req.app.make('db').table('users')
            .where('id', req.param('id'))
            .update({ name, email });

        return res.success('User updated successfully');
    }

    /**
     * Delete user
     */
    public async destroy(req: any, res: any) {
        await req.app.make('db').table('users')
            .where('id', req.param('id'))
            .delete();

        return res.success('User deleted successfully');
    }
}
`);
    }

    // Install RBAC (Role & Permission System)
    if (components.includes('rbac')) {
        await fs.ensureDir(path.join(projectDir, 'app/RBAC'));
        await fs.writeFile(path.join(projectDir, 'app/RBAC/Role.ts'), `import { Model } from '@ereactthohir/core';

export class Role extends Model {
    protected table = 'roles';
    protected fillable = ['name', 'description', 'slug'];

    /**
     * Get permissions for this role
     */
    public permissions() {
        return this.belongsToMany('Permission', 'role_permissions');
    }

    /**
     * Assign permission to role
     */
    public givePermissionTo(permission: string) {
        // Implementation
    }
}
`);

        await fs.writeFile(path.join(projectDir, 'app/RBAC/Permission.ts'), `import { Model } from '@ereactthohir/core';

export class Permission extends Model {
    protected table = 'permissions';
    protected fillable = ['name', 'description', 'slug'];

    /**
     * Get roles for this permission
     */
    public roles() {
        return this.belongsToMany('Role', 'role_permissions');
    }
}
`);

        // Add RBAC migration stub info
        await fs.writeFile(path.join(projectDir, 'database/migrations/RBAC_SETUP.txt'), `
# RBAC Setup Migrations

Run these migrations to set up the role and permission system:

1. Create roles table
2. Create permissions table  
3. Create role_permissions pivot table
4. Seed default roles (Admin, User, Moderator, etc.)
5. Seed default permissions (create, read, update, delete, etc.)

Use: ereact migrate
`);
    }

    // Install Email Verification
    if (components.includes('email-verification')) {
        await fs.writeFile(path.join(projectDir, 'app/Middleware/VerifyEmailMiddleware.ts'), `import { Middleware } from '@ereactthohir/core';

export class VerifyEmailMiddleware implements Middleware {
    public async handle(req: any, res: any, next: () => Promise<void>): Promise<void> {
        const user = req.getAuthenticatedUser();
        
        if (user && !user.email_verified_at) {
            return res.redirect('/email/verify');
        }

        await next();
    }
}
`);
    }

    // Install 2FA (Two-Factor Authentication)
    if (components.includes('2fa')) {
        await fs.writeFile(path.join(projectDir, 'app/Services/TwoFactorService.ts'), `import crypto from 'crypto';

export class TwoFactorService {
    /**
     * Generate 2FA secret
     */
    public generateSecret(): string {
        return crypto.randomBytes(32).toString('hex');
    }

    /**
     * Generate 2FA code
     */
    public generateCode(secret: string): string {
        // TOTP implementation
        const counter = Math.floor(Date.now() / 30000);
        return crypto.createHmac('sha1', Buffer.from(secret, 'hex'))
            .update(counter.toString())
            .digest('hex')
            .slice(0, 6);
    }

    /**
     * Verify 2FA code
     */
    public verifyCode(secret: string, code: string, window: number = 1): boolean {
        const counter = Math.floor(Date.now() / 30000);
        
        for (let i = -window; i <= window; i++) {
            const c = counter + i;
            const expected = crypto.createHmac('sha1', Buffer.from(secret, 'hex'))
                .update(c.toString())
                .digest('hex')
                .slice(0, 6);
            
            if (expected === code) {
                return true;
            }
        }
        
        return false;
    }
}
`);
    }

    // Create Semouth documentation
    await fs.writeFile(path.join(semouthDir, 'README.md'), `# Semouth - EreactThohir Authentication & Scaffolding

Semouth is EreactThohir's built-in authentication and application scaffolding, similar to Laravel's Breeze.

## Installed Components

${components.map(c => `- ${c}`).join('\n')}

## Quick Start

### Authentication
After installation, Benzo provides ready-to-use authentication controllers:

\`\`\`typescript
// routes/web.ts
import { LoginController } from '../app/Controllers/Auth/LoginController';

Route.post('/login', [LoginController, 'store']);
\`\`\`

### User Management
Access the user management dashboard at \`/users\`.

### RBAC (if installed)
Manage roles and permissions through the admin interface.

\`\`\`typescript
import { Role } from '../app/RBAC/Role';

const adminRole = await Role.where('slug', 'admin').first();
adminRole.givePermissionTo('manage-users');
\`\`\`

### Email Verification (if installed)
Users must verify their email before accessing the application:

\`\`\`typescript
Route.middleware([VerifyEmailMiddleware]).group(() => {
    // Protected routes
});
\`\`\`

### Two-Factor Authentication (if installed)
Enable 2FA for enhanced security:

\`\`\`typescript
import { TwoFactorService } from '../app/Services/TwoFactorService';

const 2fa = new TwoFactorService();
const secret = 2fa.generateSecret();
const code = 2fa.generateCode(secret);
\`\`\`

## Documentation

For more information, refer to the [Security Guide](../../docs/SECURITY.md).
`);
}

/**
 * Generate template structure based on template selection
 */
async function generateTemplateStructure(projectDir: string, template: string, uiSystem: string): Promise<void> {
    // Create template-specific directories
    await fs.ensureDir(path.join(projectDir, 'resources/components'));
    await fs.ensureDir(path.join(projectDir, 'resources/pages'));
    await fs.ensureDir(path.join(projectDir, 'resources/stores'));
    await fs.ensureDir(path.join(projectDir, 'resources/hooks'));
    await fs.ensureDir(path.join(projectDir, 'resources/services'));

    switch (template) {
        case 'Mobile App Starter':
            await generateMobileAppTemplate(projectDir, uiSystem);
            break;
        case 'Admin Dashboard':
            await generateAdminDashboardTemplate(projectDir, uiSystem);
            break;
        case 'Authentication Starter':
            await generateAuthenticationTemplate(projectDir, uiSystem);
            break;
        case 'Enterprise App Template':
            await generateEnterpriseTemplate(projectDir, uiSystem);
            break;
        case 'SaaS Template':
            await generateSaaSTemplate(projectDir, uiSystem);
            break;
        case 'Ecommerce App':
            await generateEcommerceTemplate(projectDir, uiSystem);
            break;
        case 'Portfolio Template':
            await generatePortfolioTemplate(projectDir, uiSystem);
            break;
        case 'Personal Blog Template':
            await generateBlogTemplate(projectDir, uiSystem);
            break;
        case 'CMS Template':
            await generateCMSTemplate(projectDir, uiSystem);
            break;
    }
}

/**
 * Generate CMS Template
 */
/**
 * Generate CMS Template
 */
async function generateCMSTemplate(projectDir: string, uiSystem: string): Promise<void> {
    const h = getUIHelper(uiSystem);
    const p = h.cls('rice-', '', 'joko-');

    // Create CMS Dashboard Page
    await fs.writeFile(path.join(projectDir, 'resources/pages/CMSDashboard.tsx'), `import React from 'react';
${uiSystem === 'Material UI' ? "import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText, Typography, Button, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, AppBar, Toolbar, Divider } from '@mui/material';" : ""}
${uiSystem === 'Bootstrap 5' ? "import { Container, Row, Col, Card, Button, Table, Badge, Nav, Navbar } from 'react-bootstrap';" : ""}

export default function CMSDashboard() {
    ${uiSystem === 'Material UI' ? `
    return (
        <Box sx={{ display: 'flex', bgcolor: '#f8fafc', minHeight: '100vh' }}>
            <Drawer variant="permanent" sx={{ width: 280, flexShrink: 0, '& .MuiDrawer-paper': { width: 280, boxSizing: 'border-box', borderRight: '1px solid #e2e8f0', bgcolor: '#fff' } }}>
                <Box sx={{ p: 4, display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box sx={{ width: 32, height: 32, bgcolor: 'primary.main', borderRadius: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 900 }}>C</Box>
                    <Typography variant="h6" sx={{ fontWeight: 900, color: 'text.primary' }}>RiceCMS</Typography>
                </Box>
                <Divider sx={{ mb: 2 }} />
                <List sx={{ px: 2 }}>
                    {['Dashboard', 'Posts', 'Categories', 'Media', 'Staff', 'Settings'].map((text, index) => (
                        <ListItem button key={text} selected={index === 0} sx={{ borderRadius: 3, mb: 1, py: 1.5, '&.Mui-selected': { bgcolor: 'primary.main', color: 'primary.contrastText', '&:hover': { bgcolor: 'primary.dark' } } }}>
                            <ListItemText primary={text} primaryTypographyProps={{ fontWeight: 700, fontSize: '0.9rem' }} />
                        </ListItem>
                    ))}
                </List>
            </Drawer>

            <Box component="main" sx={{ flexGrow: 1, p: 8 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 8 }}>
                    <Box>
                        <Typography variant="h3" sx={{ fontWeight: 900, mb: 1, tracking: -1 }}>Content Overview</Typography>
                        <Typography color="textSecondary" sx={{ fontWeight: 500 }}>Manage your publication and track performance.</Typography>
                    </Box>
                    <Button variant="contained" sx={{ py: 2, px: 4, fontWeight: 900, borderRadius: 3, textTransform: 'none', fontSize: '1rem', boxShadow: '0 4px 14px 0 rgba(0,118,255,0.39)' }}>
                        + New Entry
                    </Button>
                </Box>

                <Grid container spacing={4} sx={{ mb: 8 }}>
                    {[{t: 'Total Posts', v: '1,280', c: '#6366f1'}, {t: 'Total Views', v: '48.2K', c: '#10b981'}, {t: 'Pending', v: '12', c: '#f59e0b'}].map(s => (
                        <Grid item xs={12} md={4} key={s.t}>
                            <Paper sx={{ p: 4, borderRadius: 6, border: '1px solid #e2e8f0', boxShadow: '0 1px 3px 0 rgba(0,0,0,0.1)' }}>
                                <Typography color="textSecondary" sx={{ fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: 1, mb: 2 }}>{s.t}</Typography>
                                <Typography variant="h4" sx={{ fontWeight: 900, color: s.c }}>{s.v}</Typography>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>

                <TableContainer component={Paper} sx={{ borderRadius: 6, border: '1px solid #e2e8f0', boxShadow: 'none', overflow: 'hidden' }}>
                    <Table>
                        <TableHead sx={{ bgcolor: '#f8fafc' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 900, py: 3, ps: 4 }}>TITLE</TableCell>
                                <TableCell sx={{ fontWeight: 900, py: 3 }}>AUTHOR</TableCell>
                                <TableCell sx={{ fontWeight: 900, py: 3 }}>STATUS</TableCell>
                                <TableCell sx={{ fontWeight: 900, py: 3, pe: 4 }}>DATE</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {['The Art of Minimalist Living', 'Explaining EreactThohir Architecture', 'Designing with Rice UI'].map((title, i) => (
                                <TableRow key={title} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell sx={{ fontWeight: 700, py: 3, ps: 4 }}>{title}</TableCell>
                                    <TableCell sx={{ color: 'text.secondary', fontWeight: 500 }}>Dhafa N.</TableCell>
                                    <TableCell>
                                        <Chip label={i === 2 ? "DRAFT" : "PUBLISHED"} size="small" color={i === 2 ? "default" : "success"} sx={{ fontWeight: 900, borderRadius: 1.5, fontSize: '0.7rem' }} />
                                    </TableCell>
                                    <TableCell sx={{ color: 'text.secondary', py: 3, pe: 4 }}>Oct {24-i}, 2023</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Box>
    );` : uiSystem === 'Bootstrap 5' ? `
    return (
        <div className="d-flex bg-white min-vh-100">
            {/* Sidebar */}
            <div className="bg-light border-end d-none d-md-block" style={{ width: '280px' }}>
                <div className="p-4 d-flex align-items-center gap-2 mb-4">
                    <div className="bg-dark rounded-3 text-white fw-black d-flex align-items-center justify-content-center" style={{ width: '32px', height: '32px' }}>C</div>
                    <span className="h5 fw-black mb-0 text-dark">RiceCMS</span>
                </div>
                <Nav className="flex-column px-3 gap-1">
                    <Nav.Link className="bg-primary text-white rounded-4 fw-bold p-3 mb-2 shadow-sm">📊 Dashboard</Nav.Link>
                    <Nav.Link className="text-secondary fw-bold p-3">📝 Posts</Nav.Link>
                    <Nav.Link className="text-secondary fw-bold p-3">📁 Categories</Nav.Link>
                    <Nav.Link className="text-secondary fw-bold p-3">🖼️ Media</Nav.Link>
                    <Nav.Link className="text-secondary fw-bold p-3">👥 Staff</Nav.Link>
                    <Nav.Link className="text-secondary fw-bold p-3">⚙️ Settings</Nav.Link>
                </Nav>
            </div>

            {/* Main Content */}
            <main className="flex-grow-1 p-5 bg-white">
                <div className="d-flex justify-content-between align-items-center mb-5">
                    <div>
                        <h1 className="display-5 fw-black mb-1 letter-spacing-tight">Content Overview</h1>
                        <p className="text-muted lead fs-6">Manage your publication and track performance.</p>
                    </div>
                    <Button variant="dark" className="py-3 px-4 fw-bold rounded-4 shadow-lg border-0" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #334155 100%)' }}>
                        + New Entry
                    </Button>
                </div>

                <Row className="mb-5 g-4 text-center">
                    {[{t:'Total Posts',v:'1,280',c:'primary'}, {t:'Total Views',v:'48.2K',c:'success'}, {t:'Pending',v:'12',c:'warning'}].map(s => (
                        <Col md={4} key={s.t}>
                            <Card className="border-0 bg-light rounded-5 p-4 h-100">
                                <span className="text-uppercase small fw-black text-secondary letter-spacing-wide mb-2">{s.t}</span>
                                <h2 className={\`fw-black mb-0 text-\${s.c}\`}>{s.v}</h2>
                            </Card>
                        </Col>
                    ))}
                </Row>

                <div className="card border-0 shadow-sm rounded-5 overflow-hidden">
                    <Table hover responsive className="mb-0 align-middle">
                        <thead className="bg-light">
                            <tr>
                                <th className="p-4 ps-5 border-0 text-secondary small fw-black">TITLE</th>
                                <th className="p-4 border-0 text-secondary small fw-black">AUTHOR</th>
                                <th className="p-4 border-0 text-secondary small fw-black">STATUS</th>
                                <th className="p-4 pe-5 border-0 text-secondary small fw-black">DATE</th>
                            </tr>
                        </thead>
                        <tbody>
                             <CMSRow title="The Art of Minimalist Living" author="Dhafa N." status="Published" date="Oct 24, 2023" />
                             <CMSRow title="Explaining EreactThohir Architecture" author="Dhafa N." status="Published" date="Oct 22, 2023" />
                             <CMSRow title="Designing Rice UI" author="Sarah K." status="Draft" date="Oct 20, 2023" />
                        </tbody>
                    </Table>
                </div>
            </main>
        </div>
    );` : `
    return (
        <div className="\${p}min-h-screen \${p}bg-secondary-50 \${p}flex">
            {/* Sidebar */}
            <aside className="\${p}w-72 \${p}bg-white \${p}border-r \${p}p-8 \${p}flex \${p}col \${p}gap-8 \${p}hidden \${p}md-flex">
                <div className="\${p}flex \${p}items-center \${p}gap-2">
                    <div className="\${p}w-8 \${p}h-8 \${p}bg-secondary-900 \${p}rounded-lg \${p}flex \${p}items-center \${p}justify-center \${p}text-white \${p}font-black">C</div>
                    <span className="\${p}text-xl \${p}font-black">RiceCMS</span>
                </div>
                
                <nav className="\${p}flex \${p}col \${p}gap-2 \${p}w-full">
                    <NavItem icon="📊" label="Dashboard" active />
                    <NavItem icon="📝" label="Posts" />
                    <NavItem icon="📁" label="Categories" />
                    <NavItem icon="🖼️" label="Media" />
                    <NavItem icon="👥" label="Staff" />
                    <NavItem icon="⚙️" label="Settings" />
                </nav>
            </aside>

            {/* Main Content */}
            <main className="\${p}flex-1 \${p}p-8 \${p}md-p-12">
                <header className="\${p}mb-12 \${p}flex \${p}justify-between \${p}items-center">
                    <div>
                        <h1 className="\${p}text-4xl \${p}font-black \${p}mb-2">Content Overview</h1>
                        <p className="\${p}text-secondary-600">Manage your publication and track performance.</p>
                    </div>
                    <button className="\${p}px-6 \${p}py-3 \${p}bg-primary-500 \${p}text-white \${p}rounded-xl \${p}font-bold \${p}shadow-lg \${p}hover-scale-105 \${p}transition-all">
                        + New Entry
                    </button>
                </header>

                {/* Stats Grid */}
                <div className="\${p}grid \${p}grid-cols-1 \${p}md-grid-cols-3 \${p}gap-8 \${p}mb-12">
                    <CMSStatCard title="Total Posts" value="1,280" icon="📝" />
                    <CMSStatCard title="Total Views" value="48.2K" icon="👁️" />
                    <CMSStatCard title="Pending Review" value="12" icon="⏳" color="\${p}text-primary-500" />
                </div>

                {/* Recent Entries Table */}
                <div className="\${p}bg-white \${p}border \${p}rounded-3xl \${p}overflow-hidden">
                    <div className="\${p}p-8 \${p}border-b \${p}flex \${p}justify-between \${p}items-center">
                        <h2 className="\${p}text-xl \${p}font-bold">Recent Entries</h2>
                        <span className="\${p}text-sm \${p}text-secondary-500 \${p}cursor-pointer \${p}hover-text-secondary-900">View all</span>
                    </div>
                    <table className="\${p}w-full">
                        <thead className="\${p}bg-secondary-50">
                            <tr>
                                <th className="\${p}px-8 \${p}py-4 \${p}text-left \${p}text-xs \${p}font-bold \${p}text-secondary-500">TITLE</th>
                                <th className="\${p}px-8 \${p}py-4 \${p}text-left \${p}text-xs \${p}font-bold \${p}text-secondary-500">AUTHOR</th>
                                <th className="\${p}px-8 \${p}py-4 \${p}text-left \${p}text-xs \${p}font-bold \${p}text-secondary-500">STATUS</th>
                                <th className="\${p}px-8 \${p}py-4 \${p}text-left \${p}text-xs \${p}font-bold \${p}text-secondary-500">DATE</th>
                            </tr>
                        </thead>
                        <tbody className="\${p}divide-y">
                            <CMSRow title="The Art of Minimalist Living" author="Dhafa N." status="Published" date="Oct 24, 2023" />
                            <CMSRow title="Explaining EreactThohir Internal Architecture" author="Dhafa N." status="Published" date="Oct 22, 2023" />
                        </tbody>
                    </table>
                </div>
            </main>
        </div>
    );`}
}

function NavItem({ icon, label, active = false }: any) {
    return (
        <div className={\`\${p}flex \${p}items-center \${p}gap-3 \${p}px-4 \${p}py-3 \${p}rounded-xl \${p}text-sm \${p}font-bold \${p}cursor-pointer \${p}transition-all \${active ? '\${p}bg-secondary-900 \${p}text-white' : '\${p}text-secondary-600 \${p}hover-bg-secondary-100'}\`}>
            <span>{icon}</span>
            <span>{label}</span>
        </div>
    );
}

function CMSStatCard({ title, value, icon, color }: any) {
    return (
        <div className="\${p}bg-white \${p}p-8 \${p}border \${p}rounded-3xl \${p}shadow-sm">
            <div className="\${p}flex \${p}justify-between \${p}items-start \${p}mb-4">
                <div className="\${p}w-12 \${p}h-12 \${p}bg-secondary-50 \${p}rounded-2xl \${p}flex \${p}items-center \${p}justify-center \${p}text-xl">{icon}</div>
            </div>
            <p className="\${p}text-sm \${p}font-medium \${p}text-secondary-500 \${p}mb-1">{title}</p>
            <p className={\`\${p}text-3xl \${p}font-black \${color || '\${p}text-secondary-900'}\`}>{value}</p>
        </div>
    );
}

function CMSRow({ title, author, status, date }: any) {
    ${uiSystem === 'Bootstrap 5' ? `
    return (
        <tr>
            <td className="p-4 ps-5 fw-bold text-dark">{title}</td>
            <td className="p-4 text-muted">{author}</td>
            <td className="p-4"><Badge bg={status === 'Published'?'success':'secondary'} pill className="px-3 py-2">{status.toUpperCase()}</Badge></td>
            <td className="p-4 pe-5 text-muted">{date}</td>
        </tr>
    );` : `
    return (
        <tr className="\${p}hover-bg-secondary-50 \${p}transition-all \${p}cursor-pointer">
            <td className="\${p}px-8 \${p}py-6">
                <p className="\${p}font-bold \${p}text-secondary-900">{title}</p>
            </td>
            <td className="\${p}px-8 \${p}py-6">
                <p className="\${p}text-sm \${p}text-secondary-600">{author}</p>
            </td>
            <td className="\${p}px-8 \${p}py-6">
                <span className={\`\${p}px-3 \${p}py-1 \${p}rounded-full \${p}text-[10px] \${p}font-black \${p}tracking-wider \${
                    status === 'Published' ? '\${p}bg-success-600 \${p}bg-opacity-10 \${p}text-success-600' : 
                    status === 'Draft' ? '\${p}bg-secondary-200 \${p}text-secondary-600' : 
                    '\${p}bg-primary-500 \${p}bg-opacity-10 \${p}text-primary-600'
                }\`}>
                    {status.toUpperCase()}
                </span>
            </td>
            <td className="\${p}px-8 \${p}py-6">
                <p className="\${p}text-sm \${p}text-secondary-500">{date}</p>
            </td>
        </tr>
    );`}
}
`);

    // Create Entry Editor Page
    await fs.writeFile(path.join(projectDir, 'resources/pages/CMSEditor.tsx'), `import React from 'react';

export default function CMSEditor() {
    return (
        <div className="\${p}min-h-screen \${p}bg-white \${p}flex \${p}col">
            <header className="\${p}p-6 \${p}border-b \${p}flex \${p}justify-between \${p}items-center">
                <div className="\${p}flex \${p}items-center \${p}gap-4">
                    <button className="\${p}p-2 \${p}hover-bg-secondary-100 \${p}rounded-lg">←</button>
                    <h1 className="\${p}text-lg \${p}font-bold">Edit Entry</h1>
                </div>
                <div className="\${p}flex \${p}gap-3">
                    <button className="\${p}px-5 \${p}py-2 \${p}text-secondary-600 \${p}font-bold \${p}text-sm">Save as Draft</button>
                    <button className="\${p}px-5 \${p}py-2 \${p}bg-secondary-900 \${p}text-white \${p}rounded-xl \${p}font-bold \${p}text-sm">Publish Post</button>
                </div>
            </header>

            <main className="\${p}flex-1 \${p}p-8 \${p}max-w-4xl \${p}mx-auto \${p}w-full">
                <input 
                    type="text" 
                    placeholder="Enter post title..." 
                    className="\${p}w-full \${p}text-5xl \${p}font-black \${p}rice-placeholder-secondary-300 \${p}focus-outline-none \${p}mb-8"
                />
                
                <div className="\${p}flex \${p}gap-4 \${p}mb-8 \${p}border-b \${p}pb-4">
                    <button className="\${p}text-sm \${p}font-bold \${p}text-primary-500">Content</button>
                    <button className="\${p}text-sm \${p}font-medium \${p}text-secondary-500">SEO</button>
                    <button className="\${p}text-sm \${p}font-medium \${p}text-secondary-500">Settings</button>
                </div>

                <textarea 
                    placeholder="Start writing your masterpiece..."
                    className="\${p}w-full \${p}h-[500px] \${p}text-lg \${p}leading-relaxed \${p}rice-placeholder-secondary-300 \${p}focus-outline-none \${p}rice-resize-none"
                />
            </main>
        </div>
    );
}
`);

    // Create CMS routes
    await fs.writeFile(path.join(projectDir, 'routes/cms.ts'), `import { Route } from '@ereactthohir/core';

Route.group({ prefix: '/cms' }, () => {
    Route.get('/dashboard', (req, res) => {
        return res.view('CMSDashboard');
    });
});
`);
}

/**
 * Generate Ecommerce App template
 */
async function generateEcommerceTemplate(projectDir: string, uiSystem: string): Promise<void> {
    const h = getUIHelper(uiSystem);
    const p = h.cls('rice-', '', 'joko-');

    // Create Cart Store
    await fs.writeFile(path.join(projectDir, 'resources/stores/useCartStore.ts'), `import { create } from 'zustand';

interface Product {
    id: number;
    name: string;
    price: number;
    image: string;
}

interface CartItem extends Product {
    quantity: number;
}

interface CartState {
    items: CartItem[];
    addItem: (product: Product) => void;
    removeItem: (id: number) => void;
    clearCart: () => void;
    total: number;
}

export const useCartStore = create<CartState>((set) => ({
    items: [],
    total: 0,
    addItem: (product) => set((state) => {
        const existing = state.items.find(i => i.id === product.id);
        const newItems = existing 
            ? state.items.map(i => i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i)
            : [...state.items, { ...product, quantity: 1 }];
        return { 
            items: newItems,
            total: newItems.reduce((acc, i) => acc + (i.price * i.quantity), 0)
        };
    }),
    removeItem: (id) => set((state) => {
        const newItems = state.items.filter(i => i.id !== id);
        return { 
            items: newItems,
            total: newItems.reduce((acc, i) => acc + (i.price * i.quantity), 0)
        };
    }),
    clearCart: () => set({ items: [], total: 0 }),
}));
`);

    // Create Shop Page
    await fs.writeFile(path.join(projectDir, 'resources/pages/Shop.tsx'), `import React from 'react';
import { useCartStore } from '../stores/useCartStore';
${uiSystem === 'Material UI' ? "import { Box, Container, Typography, Grid, Card as MuiCard, CardMedia, CardContent, Button as MuiButton, AppBar, Toolbar, Badge } from '@mui/material';" : ""}
${uiSystem === 'Bootstrap 5' ? "import { Container, Row, Col, Card as BsCard, Button as BsButton, Navbar, Nav, Badge as BsBadge } from 'react-bootstrap';" : ""}

const products = [
    { id: 1, name: 'Premium Wireless Headphones', price: 299, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500' },
    { id: 2, name: 'Smart Watch Series 7', price: 399, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500' },
    { id: 3, name: 'Minimalist Desktop Setup', price: 1299, image: 'https://images.unsplash.com/photo-1491933382434-500287f9b54b?w=500' },
    { id: 4, name: 'Professional Camera Lens', price: 899, image: 'https://images.unsplash.com/photo-1512499617640-c74ae3a49dd5?w=500' },
];

export default function Shop() {
    const { addItem, items } = useCartStore();

    ${uiSystem === 'Material UI' ? `
    return (
        <Box sx={{ bgcolor: '#f8fafc', minHeight: '100vh' }}>
            <AppBar position="sticky" sx={{ bgcolor: 'white', color: 'text.primary', boxShadow: 'none', borderBottom: '1px solid #e2e8f0' }}>
                <Container>
                    <Toolbar sx={{ justifyContent: 'space-between' }}>
                        <Typography variant="h5" sx={{ fontWeight: 900, color: 'primary.main' }}>ERectShop</Typography>
                        <Badge badgeContent={items.length} color="primary">
                             <Typography sx={{ fontSize: 24 }}>🛒</Typography>
                        </Badge>
                    </Toolbar>
                </Container>
            </AppBar>

            <Container sx={{ py: 8 }}>
                <Box sx={{ mb: 6 }}>
                    <Typography variant="h3" sx={{ fontWeight: 900, mb: 1 }}>Featured Products</Typography>
                    <Typography color="textSecondary">Curated collection of premium tech gadgets.</Typography>
                </Box>

                <Grid container spacing={4}>
                    {products.map(product => (
                        <Grid item xs={12} sm={6} lg={3} key={product.id}>
                            <MuiCard sx={{ borderRadius: 4, overflow: 'hidden', transition: '0.3s', '&:hover': { transform: 'translateY(-8px)', boxShadow: 10 } }}>
                                <CardMedia component="img" height="240" image={product.image} />
                                <CardContent sx={{ p: 3 }}>
                                    <Typography variant="h6" sx={{ fontWeight: 900, mb: 1 }}>{product.name}</Typography>
                                    <Typography variant="h5" color="primary" sx={{ fontWeight: 900, mb: 2 }}>\${product.price}</Typography>
                                    <MuiButton variant="contained" fullWidth sx={{ py: 1.5, fontWeight: 900, borderRadius: 2 }} onClick={() => addItem(product)}>
                                        Add To Cart
                                    </MuiButton>
                                </CardContent>
                            </MuiCard>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );` : uiSystem === 'Bootstrap 5' ? `
    return (
        <div className="bg-light min-vh-100">
            <Navbar bg="white" sticky="top" className="py-3 shadow-sm">
                <Container>
                    <Navbar.Brand className="fw-black text-primary fs-3">ERectShop</Navbar.Brand>
                    <Nav className="ms-auto align-items-center">
                        <div className="position-relative">
                             <span className="fs-4">🛒</span>
                             {items.length > 0 && <BsBadge pill bg="primary" className="position-absolute top-0 start-100 translate-middle">{items.length}</BsBadge>}
                        </div>
                    </Nav>
                </Container>
            </Navbar>

            <Container className="py-5">
                <header className="mb-5">
                    <h2 className="display-5 fw-black mb-2">Featured Products</h2>
                    <p className="text-secondary lead">Curated collection of premium tech gadgets.</p>
                </header>

                <Row className="g-4">
                    {products.map(product => (
                        <Col sm={6} lg={3} key={product.id}>
                            <BsCard className="border-0 shadow-lg rounded-4 overflow-hidden h-100">
                                <div className="ratio ratio-4x3">
                                    <BsCard.Img variant="top" src={product.image} className="object-fit-cover" />
                                </div>
                                <BsCard.Body className="p-4">
                                    <BsCard.Title className="fw-bold fs-5 mb-2">{product.name}</BsCard.Title>
                                    <BsCard.Text className="fs-4 fw-black text-primary mb-4">\${product.price}</BsCard.Text>
                                    <BsButton variant="dark" className="w-100 py-3 rounded-3 fw-bold" onClick={() => addItem(product)}>
                                        Add to Cart
                                    </BsButton>
                                </BsCard.Body>
                            </BsCard>
                        </Col>
                    ))}
                </Row>
            </Container>
        </div>
    );` : `
    return (
        <div className="\${p}min-h-screen \${p}bg-secondary-100">
            {/* Navbar */}
            <nav className="\${p}p-6 \${p}bg-white \${p}shadow-sm \${p}flex \${p}justify-between \${p}items-center \${p}sticky \${p}top-0 \${p}z-10">
                <h1 className="\${p}text-2xl \${p}font-black \${h.cls('rice-gradient-primary rice-bg-clip-text rice-text-transparent', 'text-blue-600', 'joko-text-primary-600')}">ERectShop</h1>
                <div className="\${p}relative \${p}cursor-pointer">
                    <span className="\${p}text-lg">🛒</span>
                    {items.length > 0 && (
                        <span className="\${p}absolute -\${p}top-2 -\${p}right-2 \${p}bg-primary-500 \${p}text-white \${p}text-xs \${p}font-bold \${p}rounded-full \${p}w-5 \${p}h-5 \${p}flex \${p}items-center \${p}justify-center">
                            {items.length}
                        </span>
                    )}
                </div>
            </nav>

            <div className="\${p}p-8 \${p}max-w-7xl \${p}mx-auto">
                <header className="\${p}mb-12">
                    <h2 className="\${p}text-4xl \${p}font-bold \${p}mb-2">Featured Products</h2>
                    <p className="\${p}text-secondary-600">Curated collection of premium tech gadgets.</p>
                </header>

                <div className="\${p}grid \${p}grid-cols-1 \${h.cls('rice-md-grid-cols-2 rice-lg-grid-cols-4', 'md:grid-cols-2 lg:grid-cols-4', 'joko-grid-cols-2')} \${p}gap-8">
                    {products.map(product => (
                        <div key={product.id} className="\${h.cls('rice-bg-white rice-rounded-2xl rice-overflow-hidden rice-shadow-lg rice-hover-shadow-2xl rice-transition-all rice-duration-300 rice-group', 'bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group', 'joko-card')}">
                            <div className="\${p}h-64 \${p}overflow-hidden">
                                <img src={product.image} alt={product.name} className="\${p}w-full \${p}h-full \${p}object-cover \${p}transition-all \${p}duration-500" />
                            </div>
                            <div className="\${p}p-6">
                                <h3 className="\${p}font-bold \${p}text-lg \${p}mb-1">{product.name}</h3>
                                <p className="\${h.cls('rice-text-primary-600 rice-font-black rice-text-xl rice-mb-4', 'text-blue-600 font-black text-xl mb-4', 'joko-text-primary-600 font-bold mb-4')}">{product.price}</p>
                                <button 
                                    onClick={() => addItem(product)}
                                    className="\${h.cls('rice-w-full rice-py-3 rice-bg-secondary-900 rice-text-white rice-rounded-xl rice-font-bold rice-hover-bg-primary-600 rice-transition-all', 'w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-blue-600 transition-all', 'joko-btn joko-btn-primary')} joko-w-full"
                                >
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );`}
}
`);

    // Create Ecommerce routes
    await fs.writeFile(path.join(projectDir, 'routes/shop.ts'), `import { Route } from '@ereactthohir/core';

Route.get('/shop', (req, res) => res.view('Shop'));
Route.get('/cart', (req, res) => res.view('Cart'));
Route.post('/checkout', 'CheckoutController@store');
`);
}

/**
 * Generate Portfolio Template
 */
async function generatePortfolioTemplate(projectDir: string, uiSystem: string): Promise<void> {
    const h = getUIHelper(uiSystem);
    const p = h.cls('rice-', '', 'joko-');

    await fs.writeFile(path.join(projectDir, 'resources/pages/Portfolio.tsx'), `import React from 'react';
${uiSystem === 'Material UI' ? "import { Box, Container, Typography, Button, Grid, Paper, Chip, Stack } from '@mui/material';" : ""}
${uiSystem === 'Bootstrap 5' ? "import { Container, Row, Col, Button, Card, Nav } from 'react-bootstrap';" : ""}

export default function Portfolio() {
    ${uiSystem === 'Material UI' ? `
    return (
        <Box sx={{ bgcolor: 'white', color: 'text.primary', minHeight: '100vh' }}>
            {/* Hero Section */}
            <Container sx={{ py: 15, textAlign: 'center' }}>
                <Box sx={{ mb: 4 }}>
                    <Chip label="Available for hire" color="primary" sx={{ fontWeight: 900, borderRadius: 10, px: 1 }} />
                </Box>
                <Typography variant="h1" sx={{ fontWeight: 900, mb: 3, tracking: -2 }}>
                    Crafting <Box component="span" sx={{ color: 'primary.main' }}>Digital Experiences</Box> that matter.
                </Typography>
                <Typography variant="h5" color="textSecondary" sx={{ maxW: '800px', mx: 'auto', mb: 6, fontWeight: 500, lineHeight: 1.6 }}>
                    I'm a Fullstack Developer specializing in building high-performance web applications with EreactThohir ecosystem.
                </Typography>
                <Stack direction="row" spacing={3} justifyContent="center">
                    <Button variant="contained" size="large" sx={{ px: 6, py: 2, borderRadius: 10, fontWeight: 900 }}>View Projects</Button>
                    <Button variant="outlined" size="large" sx={{ px: 6, py: 2, borderRadius: 10, fontWeight: 900 }}>Contact Me</Button>
                </Stack>
            </Container>

            {/* Projects Grid */}
            <Box sx={{ py: 12, bgcolor: '#f8fafc' }}>
                <Container>
                    <Typography variant="h3" sx={{ fontWeight: 900, mb: 8 }}>Selected Works</Typography>
                    <Grid container spacing={6}>
                        {[1, 2, 3, 4].map(i => (
                            <Grid item xs={12} md={6} key={i}>
                                <Paper elevation={0} sx={{ borderRadius: 8, overflow: 'hidden', bgcolor: 'transparent', cursor: 'pointer', transition: '0.3s', '&:hover': { transform: 'translateY(-8px)' } }}>
                                    <Box sx={{ aspectSize: '16/9', bgcolor: '#e2e8f0', borderRadius: 8, mb: 3 }} />
                                    <Typography variant="h5" sx={{ fontWeight: 900, mb: 1 }}>Project Name #{i}</Typography>
                                    <Typography color="textSecondary" sx={{ fontWeight: 500 }}>UI/UX Design • Development • 2024</Typography>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>
                </Container>
            </Box>

            {/* Footer */}
            <Box component="footer" sx={{ py: 8, textAlign: 'center', borderTop: '1px solid #e2e8f0' }}>
                <Typography color="textSecondary">© 2024 Designer • Built with EreactThohir</Typography>
            </Box>
        </Box>
    );` : uiSystem === 'Bootstrap 5' ? `
    return (
        <div className="bg-white text-dark min-vh-100">
            {/* Hero Section */}
            <Container className="py-5 text-center" style={{ marginTop: '100px', marginBottom: '100px' }}>
                <div className="mb-4">
                    <span className="badge rounded-pill bg-primary px-3 py-2 fw-black">Available for hire</span>
                </div>
                <h1 className="display-1 fw-black mb-4 tracking-tight">Crafting <span className="text-primary">Digital Experiences</span> that matter.</h1>
                <p className="lead text-muted mx-auto mb-5" style={{ maxWidth: '800px' }}>I'm a Fullstack Developer specializing in building high-performance web applications with EreactThohir ecosystem.</p>
                <div className="d-flex justify-content-center gap-3">
                    <Button variant="dark" size="lg" className="px-5 py-3 rounded-pill fw-black shadow-lg">View Projects</Button>
                    <Button variant="outline-dark" size="lg" className="px-5 py-3 rounded-pill fw-black">Contact Me</Button>
                </div>
            </Container>

            {/* Projects */}
            <div className="bg-light py-5">
                <Container className="py-5">
                    <h2 className="display-5 fw-black mb-5">Selected Works</h2>
                    <Row className="g-5">
                        {[1, 2, 3, 4].map(i => (
                            <Col md={6} key={i}>
                                <div className="project-card cursor-pointer transition-transform" style={{ cursor: 'pointer' }}>
                                    <div className="bg-secondary rounded-5 mb-4 shadow-sm" style={{ aspectRatio: '16/9', opacity: 0.1 }}></div>
                                    <h3 className="h4 fw-black mb-2">Project Name #{i}</h3>
                                    <p className="text-muted fw-bold">UI/UX Design • Development • 2024</p>
                                </div>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </div>

            <footer className="py-5 text-center border-top">
                <p className="text-muted mb-0">© 2024 Designer • Built with EreactThohir</p>
            </footer>
        </div>
    );` : `
    return (
        <div className="\${p}min-h-screen \${p}bg-white \${p}text-secondary-900">
            {/* Hero Section */}
            <section className="\${p}py-24 \${p}px-6 \${p}max-w-7xl \${p}mx-auto \${p}text-center">
                <div className="\${p}mb-8 \${p}animate-pulse">
                    <span className="\${p}px-4 \${p}py-2 \${p}bg-primary-500 \${p}bg-opacity-10 \${p}text-primary-600 \${p}rounded-full \${p}text-sm \${p}font-bold">
                        Available for hire
                    </span>
                </div>
                <h1 className="\${p}text-7xl \${p}font-black \${p}mb-6 \${p}tracking-tight">
                    Crafting <span className="\${p}gradient-primary \${p}bg-clip-text \${p}text-transparent">Digital Experiences</span> that matter.
                </h1>
                <p className="\${p}text-2xl \${p}text-secondary-600 \${p}max-w-3xl \${p}mx-auto \${p}mb-12">
                    I'm a Fullstack Developer specializing in building high-performance web applications with EreactThohir ecosystem.
                </p>
                <div className="\${p}flex \${p}justify-center \${p}gap-4">
                    <button className="\${p}px-8 \${p}py-4 \${p}bg-secondary-900 \${p}text-white \${p}rounded-full \${p}font-bold \${p}shadow-xl \${p}hover-scale-105 \${p}transition-all">
                        View Projects
                    </button>
                    <button className="\${p}px-8 \${p}py-4 \${p}border \${p}rounded-full \${p}font-bold \${p}hover-bg-secondary-100 \${p}transition-all">
                        Contact Me
                    </button>
                </div>
            </section>

            {/* Projects Grid */}
            <section className="\${p}py-20 \${p}bg-secondary-50">
                <div className="\${p}max-w-7xl \${p}mx-auto \${p}px-6">
                    <h2 className="\${p}text-4xl \${p}font-bold \${p}mb-12">Selected Works</h2>
                    <div className="\${p}grid \${p}grid-cols-1 \${p}md-grid-cols-2 \${p}gap-12">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="\${p}group \${p}cursor-pointer">
                                <div className="\${p}aspect-video \${p}bg-secondary-200 \${p}rounded-3xl \${p}mb-6 \${p}overflow-hidden \${p}relative">
                                    <div className="\${p}absolute \${p}inset-0 \${p}bg-primary-500 \${p}opacity-0 \${p}group-hover-opacity-10 \${p}transition-all" />
                                    <div className="\${p}w-full \${p}h-full \${p}bg-gradient-to-br \${p}from-secondary-200 \${p}to-secondary-300" />
                                </div>
                                <h3 className="\${p}text-2xl \${p}font-bold \${p}mb-2">Project Name #\${i}</h3>
                                <p className="\${p}text-secondary-600">UI/UX Design • Development • 2024</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="\${p}py-12 \${p}text-center \${p}border-t">
                <p className="\${p}text-secondary-500">© 2024 Designer • Built with EreactThohir</p>
            </footer>
        </div>
    );`}
}
`);

    await fs.writeFile(path.join(projectDir, 'routes/portfolio.ts'), `import { Route } from '@ereactthohir/core';

Route.get('/portfolio', (req, res) => {
    return res.view('Portfolio');
});
`);
}

/**
 * Generate Personal Blog Template
 */
async function generateBlogTemplate(projectDir: string, uiSystem: string): Promise<void> {
    await fs.writeFile(path.join(projectDir, 'resources/pages/Blog.tsx'), `import React from 'react';

const posts = [
    { id: 1, title: 'The Future of Web Development', excerpt: 'Exploring the latest trends in 2024...', date: 'Oct 12, 2023' },
    { id: 2, title: 'Mastering Rice UI Components', excerpt: 'Deep dive into the power of Rice UI system...', date: 'Sep 28, 2023' },
    { id: 3, title: 'Why EreactThohir is the Best Choice', excerpt: 'A comparative study of modern frameworks...', date: 'Aug 15, 2023' },
];

export default function Blog() {
    return (
        <div className="rice-min-h-screen rice-bg-white">
            <header className="rice-py-20 rice-border-b">
                <div className="rice-max-w-3xl rice-mx-auto rice-px-6">
                    <h1 className="rice-text-5xl rice-font-black rice-mb-4">Perspectives</h1>
                    <p className="rice-text-xl rice-text-secondary-600">Thoughts on technology, design, and building the future.</p>
                </div>
            </header>

            <main className="rice-py-20">
                <div className="rice-max-w-3xl rice-mx-auto rice-px-6 rice-space-y-16">
                    {posts.map(post => (
                        <article key={post.id} className="rice-group rice-cursor-pointer">
                            <span className="rice-text-sm rice-text-primary-500 rice-font-bold rice-mb-2 rice-block">{post.date}</span>
                            <h2 className="rice-text-3xl rice-font-bold rice-mb-3 group-hover-text-primary-500 rice-transition-all">{post.title}</h2>
                            <p className="rice-text-lg rice-text-secondary-600 rice-mb-6">{post.excerpt}</p>
                            <a className="rice-font-bold rice-inline-flex rice-items-center rice-gap-2">
                                Read More <span className="rice-text-primary-500">→</span>
                            </a>
                        </article>
                    ))}
                </div>
            </main>
        </div>
    );
}
`);

    await fs.writeFile(path.join(projectDir, 'routes/blog.ts'), `import { Route } from '@ereactthohir/core';

Route.get('/blog', (req, res) => res.view('Blog'));
Route.get('/blog/:slug', (req, res) => res.view('BlogPost'));
`);
}

/**
 * Generate Mobile App Starter template
 */
async function generateMobileAppTemplate(projectDir: string, uiSystem: string): Promise<void> {
    // Create API service
    await fs.writeFile(path.join(projectDir, 'resources/services/api.ts'), `import axios, { AxiosInstance } from 'axios';

class ApiService {
    private api: AxiosInstance;

    constructor() {
        this.api = axios.create({
            baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000/api',
            timeout: 10000,
        });

        // Add request interceptor
        this.api.interceptors.request.use((config) => {
            const token = localStorage.getItem('auth_token');
            if (token) {
                config.headers.Authorization = \`Bearer \${token}\`;
            }
            return config;
        });

        // Add response interceptor
        this.api.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response?.status === 401) {
                    localStorage.removeItem('auth_token');
                    window.location.href = '/login';
                }
                return Promise.reject(error);
            }
        );
    }

    async get(url: string, config?: any) {
        return this.api.get(url, config);
    }

    async post(url: string, data?: any, config?: any) {
        return this.api.post(url, data, config);
    }

    async put(url: string, data?: any, config?: any) {
        return this.api.put(url, data, config);
    }

    async delete(url: string, config?: any) {
        return this.api.delete(url, config);
    }
}

export default new ApiService();
`);

    // Create state management (Zustand)
    await fs.writeFile(path.join(projectDir, 'resources/stores/useAppStore.ts'), `import { create } from 'zustand';

interface AppState {
    user: any | null;
    isLoading: boolean;
    notifications: any[];
    
    setUser: (user: any) => void;
    setLoading: (loading: boolean) => void;
    addNotification: (notification: any) => void;
    removeNotification: (id: string) => void;
    logout: () => void;
}

export const useAppStore = create<AppState>((set) => ({
    user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null,
    isLoading: false,
    notifications: [],

    setUser: (user) => {
        localStorage.setItem('user', JSON.stringify(user));
        set({ user });
    },

    setLoading: (loading) => set({ isLoading: loading }),

    addNotification: (notification) =>
        set((state) => ({ notifications: [...state.notifications, notification] })),

    removeNotification: (id) =>
        set((state) => ({
            notifications: state.notifications.filter((n) => n.id !== id),
        })),

    logout: () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        set({ user: null });
    },
}));
`);

    // Create Home page
    await fs.writeFile(path.join(projectDir, 'resources/pages/Home.tsx'), `import React, { useEffect, useState } from 'react';
import { useAppStore } from '../stores/useAppStore';
import apiService from '../services/api';

export default function Home() {
    const { user, isLoading, setLoading } = useAppStore();
    const [data, setData] = useState<any[]>([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await apiService.get('/data');
            setData(response.data);
        } catch (error) {
            console.error('Failed to fetch data:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Welcome, {user?.name || 'Guest'}</h1>
            {isLoading && <p>Loading...</p>}
            <div className="grid gap-4">
                {data.map((item, idx) => (
                    <div key={idx} className="border rounded p-4">
                        <h2 className="font-semibold">{item.title}</h2>
                        <p>{item.description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
`);

    // Create routes
    await fs.writeFile(path.join(projectDir, 'routes/mobile.ts'), `import { Route } from '@ereactthohir/core';

Route.screen('Home', () => import('../resources/pages/Home'));
Route.screen('Profile', () => import('../resources/pages/Profile'));
Route.screen('Settings', () => import('../resources/pages/Settings'));
`);
}

/**
 * Generate Admin Dashboard template
 */
async function generateAdminDashboardTemplate(projectDir: string, uiSystem: string): Promise<void> {
    const h = getUIHelper(uiSystem);
    const p = h.cls('rice-', '', 'joko-');

    // Create Admin Store
    await fs.writeFile(path.join(projectDir, 'resources/stores/useAdminStore.ts'), `import { create } from 'zustand';

interface AdminState {
    activeMenu: string;
    users: any[];
    stats: any;
    setActiveMenu: (menu: string) => void;
    setUsers: (users: any[]) => void;
    setStats: (stats: any) => void;
}

export const useAdminStore = create<AdminState>((set) => ({
    activeMenu: 'dashboard',
    users: [],
    stats: {},
    setActiveMenu: (menu) => set({ activeMenu: menu }),
    setUsers: (users) => set({ users }),
    setStats: (stats) => set({ stats }),
}));
`);

    // Create Dashboard component
    await fs.writeFile(path.join(projectDir, 'resources/components/Dashboard.tsx'), `import React from 'react';
${uiSystem === 'Material UI' ? "import { Box, Typography, Grid, Paper, Stack, Button as MuiButton } from '@mui/material';" : ""}
${uiSystem === 'Bootstrap 5' ? "import { Container, Row, Col, Card, Button as BsButton } from 'react-bootstrap';" : ""}

export default function Dashboard() {
    ${uiSystem === 'Material UI' ? `
    return (
        <Box sx={{ p: 4, bgcolor: 'background.default', minHeight: '100vh' }}>
            <Box sx={{ mb: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <Box>
                    <Typography variant="h3" sx={{ fontWeight: 900, mb: 1 }}>System Overview</Typography>
                    <Typography color="textSecondary">Institutional management dashboard.</Typography>
                </Box>
                <MuiButton variant="contained" sx={{ px: 4, py: 1.5, fontWeight: 900, borderRadius: 3 }}>
                    Export Data
                </MuiButton>
            </Box>
            
            <Grid container spacing={3} sx={{ mb: 6 }}>
                <Grid item xs={12} md={6} lg={3}><StatCard title="Total Users" value="12,482" change="+12%" icon="👥" uiSystem="${uiSystem}" /></Grid>
                <Grid item xs={12} md={6} lg={3}><StatCard title="Total Sales" value="$48,230" change="+18%" icon="💰" uiSystem="${uiSystem}" /></Grid>
                <Grid item xs={12} md={6} lg={3}><StatCard title="Active Projects" value="84" change="+3%" icon="⚡" uiSystem="${uiSystem}" /></Grid>
                <Grid item xs={12} md={6} lg={3}><StatCard title="Server Load" value="23%" change="-2%" icon="📊" uiSystem="${uiSystem}" /></Grid>
            </Grid>

            <Grid container spacing={4}>
                <Grid item xs={12} lg={8}>
                    <Paper sx={{ p: 4, borderRadius: 6, border: '1px solid #e2e8f0' }} elevation={0}>
                        <Typography variant="h6" sx={{ fontWeight: 900, mb: 4 }}>Performance Trend</Typography>
                        <Box sx={{ height: 350, bgcolor: '#f8fafc', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed #e2e8f0' }}>
                            <Typography color="textSecondary">Visualization Ready</Typography>
                        </Box>
                    </Paper>
                </Grid>
                <Grid item xs={12} lg={4}>
                    <Paper sx={{ p: 4, borderRadius: 6, border: '1px solid #e2e8f0' }} elevation={0}>
                        <Typography variant="h6" sx={{ fontWeight: 900, mb: 4 }}>Recent Alerts</Typography>
                        <Stack spacing={3}>
                            {[1, 2, 3].map(i => (
                                <Box key={i} sx={{ display: 'flex', gap: 2 }}>
                                    <Box sx={{ width: 44, height: 44, bgcolor: '#f1f5f9', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🔔</Box>
                                    <Box>
                                        <Typography sx={{ fontWeight: 900, fontSize: '0.875rem' }}>System Update</Typography>
                                        <Typography variant="caption" color="textSecondary">v1.2.0 deployed</Typography>
                                    </Box>
                                </Box>
                            ))}
                        </Stack>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );` : uiSystem === 'Bootstrap 5' ? `
    return (
        <Container fluid className="p-5 bg-light min-vh-100">
            <header className="mb-5 d-flex justify-content-between align-items-end">
                <div>
                    <h1 className="display-5 fw-black mb-1">System Overview</h1>
                    <p className="text-secondary">Premium Bootstrap Dashboard.</p>
                </div>
                <BsButton variant="dark" className="px-4 py-2 rounded-3 fw-bold shadow-sm">
                    Export Data
                </BsButton>
            </header>
            
            <Row className="g-4 mb-5">
                <Col md={6} lg={3}><StatCard title="Total Users" value="12,482" change="+12%" icon="👥" uiSystem="${uiSystem}" /></Col>
                <Col md={6} lg={3}><StatCard title="Total Sales" value="$48,230" change="+18%" icon="💰" uiSystem="${uiSystem}" /></Col>
                <Col md={6} lg={3}><StatCard title="Active Projects" value="84" change="+3%" icon="⚡" uiSystem="${uiSystem}" /></Col>
                <Col md={6} lg={3}><StatCard title="Server Load" value="23%" change="-2%" icon="📊" uiSystem="${uiSystem}" /></Col>
            </Row>

            <Row className="g-4">
                <Col lg={8}>
                    <Card className="border-0 shadow-sm rounded-4 p-4">
                        <h2 className="h5 fw-bold mb-4">Performance Trend</h2>
                        <div className="bg-light rounded-4 border-2 border-dashed d-flex align-items-center justify-content-center" style={{ height: '350px' }}>
                            <p className="text-secondary mb-0">Analytics Engine Active</p>
                        </div>
                    </Card>
                </Col>
                <Col lg={4}>
                    <Card className="border-0 shadow-sm rounded-4 p-4">
                        <h2 className="h5 fw-bold mb-4">Recent Alerts</h2>
                        <div className="vstack gap-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="d-flex gap-3">
                                    <div className="rounded-circle bg-light d-flex align-items-center justify-content-center shadow-inner" style={{ width: '44px', height: '44px' }}>🔔</div>
                                    <div>
                                        <p className="small fw-bold mb-0">Security Patch</p>
                                        <p className="x-small text-secondary mb-0">System secured</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </Col>
            </Row>
        </Container>
    );` : `
    return (
        <div className="\${p}p-8 \${p}bg-secondary-50 \${p}min-h-screen">
            <header className="\${p}mb-10 \${p}flex \${p}justify-between \${p}items-end">
                <div>
                    <h1 className="\${p}text-4xl \${p}font-black \${p}mb-2">System Overview</h1>
                    <p className="\${p}text-secondary-600">Premium management dashboard.</p>
                </div>
                <button className="\${h.cls('rice-px-6 rice-py-3 rice-bg-secondary-900 rice-text-white rice-rounded-xl rice-font-bold rice-shadow-lg', 'px-6 py-3 bg-slate-900 text-white rounded-xl font-bold shadow-lg', 'joko-btn joko-btn-primary')}">
                    Export Data
                </button>
            </header>
            
            <div className="\${p}grid \${p}grid-cols-1 \${h.cls('rice-md-grid-cols-2 rice-lg-grid-cols-4', 'md:grid-cols-2 lg:grid-cols-4', 'joko-grid-cols-3')} \${p}gap-6 \${p}mb-10">
                <StatCard title="Total Users" value="12,482" change="+12%" icon="👥" uiSystem="${uiSystem}" />
                <StatCard title="Total Sales" value="$48,230" change="+18%" icon="💰" uiSystem="${uiSystem}" />
                <StatCard title="Active Projects" value="84" change="+3%" icon="⚡" uiSystem="${uiSystem}" />
                <StatCard title="Server Load" value="23%" change="-2%" icon="📊" uiSystem="${uiSystem}" />
            </div>

            <div className="\${p}grid \${p}grid-cols-1 \${h.cls('rice-lg-grid-cols-3', 'lg:grid-cols-3', 'joko-grid-cols-1')} \${p}gap-8">
                <div className="\${h.cls('rice-lg-col-span-2 rice-bg-white rice-p-8 rice-rounded-3xl rice-border rice-shadow-sm', 'lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm', 'joko-card')}">
                    <h2 className="\${p}text-xl \${p}font-bold \${p}mb-6">Performance Trend</h2>
                    <div className="\${p}h-80 \${p}bg-secondary-50 \${p}rounded-2xl \${p}border-2 \${p}border-dashed \${p}flex \${p}items-center \${p}justify-center">
                        <p className="\${p}text-secondary-400">Visualization Engine Ready</p>
                    </div>
                </div>
                <div className="\${h.cls('rice-bg-white rice-p-8 rice-rounded-3xl rice-border rice-shadow-sm', 'bg-white p-8 rounded-3xl border border-slate-200 shadow-sm', 'joko-card')}">
                    <h2 className="\${p}text-xl \${p}font-bold \${p}mb-6">Recent Alerts</h2>
                    <div className="\${p}space-y-6">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="\${p}flex \${p}gap-4">
                                <div className="\${p}w-10 \${p}h-10 \${p}bg-secondary-100 \${p}rounded-full \${p}flex \${p}items-center \${p}justify-center">🔔</div>
                                <div>
                                    <p className="\${p}text-sm \${p}font-bold">System Update Successful</p>
                                    <p className="\${p}text-xs \${p}text-secondary-500">v1.2.0 deployed</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );`}
}

function StatCard({ title, value, change, icon, uiSystem }: any) {
    ${uiSystem === 'Material UI' ? `
    return (
        <Paper sx={{ p: 3, borderRadius: 5, border: '1px solid #e2e8f0', bgcolor: 'white' }} elevation={0}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box sx={{ width: 44, height: 44, bgcolor: '#f1f5f9', borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>{icon}</Box>
                <Box sx={{ px: 1, py: 0.5, bgcolor: change.startsWith('+') ? '#dcfce7' : '#f1f5f9', color: change.startsWith('+') ? '#166534' : '#64748b', borderRadius: 1.5, fontSize: '0.75rem', fontWeight: 900 }}>{change}</Box>
            </Box>
            <Typography variant="body2" color="textSecondary" sx={{ fontWeight: 700, mb: 0.5 }}>{title}</Typography>
            <Typography variant="h4" sx={{ fontWeight: 900 }}>{value}</Typography>
        </Paper>
    );` : uiSystem === 'Bootstrap 5' ? `
    return (
        <Card className="border-0 shadow-sm rounded-4 p-4 h-100">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <div className="bg-light rounded-3 d-flex align-items-center justify-content-center shadow-inner" style={{ width: '48px', height: '48px', fontSize: '1.5rem' }}>{icon}</div>
                <span className={\`badge \${change.startsWith('+') ? 'bg-success-soft text-success' : 'bg-light text-secondary'} rounded-pill\`} style={change.startsWith('+') ? { backgroundColor: '#dcfce7' } : {}}>
                    {change}
                </span>
            </div>
            <p className="text-secondary small fw-bold mb-1">{title}</p>
            <h3 className="fw-black mb-0">{value}</h3>
        </Card>
    );` : `
    const h = getUIHelper(uiSystem);
    const p = h.cls('rice-', '', 'joko-');
    return (
        <div className="\${h.cls('rice-bg-white rice-p-6 rice-rounded-3xl rice-border rice-shadow-sm rice-hover-shadow-md rice-transition-all', 'bg-white p-6 rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all', 'joko-card')}">
            <div className="\${p}flex \${p}justify-between \${p}items-start \${p}mb-4">
                <div className="\${p}w-12 \${p}h-12 \${p}bg-secondary-50 \${p}rounded-2xl \${p}flex \${p}items-center \${p}justify-center \${p}text-2xl">{icon}</div>
                <span className=\\\`\${p}text-xs \${p}font-black \${p}px-2 \${p}py-1 \${p}rounded-lg \\\${change.startsWith('+') ? '\${p}text-success-600 \${p}bg-success-600 \${p}bg-opacity-10' : '\${p}text-secondary-600 \${p}bg-secondary-200'}\\\`>
                    {change}
                </span>
            </div>
            <h3 className="\${p}text-secondary-500 \${p}text-sm \${p}font-medium \${p}mb-1">{title}</h3>
            <p className="\${p}text-3xl \${p}font-black">{value}</p>
        </div>
    );`}
}
`);
}

/**
 * Generate Authentication Starter template
 */
async function generateAuthenticationTemplate(projectDir: string, uiSystem: string): Promise<void> {
    const h = getUIHelper(uiSystem);
    const p = h.cls('rice-', '', 'joko-');

    // Create Auth store
    await fs.writeFile(path.join(projectDir, 'resources/stores/useAuthStore.ts'), `import { create } from 'zustand';
import apiService from '../services/api';

interface AuthState {
    user: any | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    
    login: (email: string, password: string) => Promise<void>;
    register: (data: any) => Promise<void>;
    logout: () => Promise<void>;
    refresh: () => Promise<void>;
    setError: (error: string | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null,
    isAuthenticated: !!localStorage.getItem('auth_token'),
    isLoading: false,
    error: null,

    login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
            const response = await apiService.post('/auth/login', { email, password });
            localStorage.setItem('auth_token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            set({ user: response.data.user, isAuthenticated: true });
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Login failed' });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    register: async (data) => {
        set({ isLoading: true, error: null });
        try {
            const response = await apiService.post('/auth/register', data);
            localStorage.setItem('auth_token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            set({ user: response.data.user, isAuthenticated: true });
        } catch (error: any) {
            set({ error: error.response?.data?.message || 'Registration failed' });
            throw error;
        } finally {
            set({ isLoading: false });
        }
    },

    logout: async () => {
        try {
            await apiService.post('/auth/logout');
        } finally {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');
            set({ user: null, isAuthenticated: false });
        }
    },

    refresh: async () => {
        try {
            const response = await apiService.post('/auth/refresh');
            localStorage.setItem('auth_token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            set({ user: response.data.user });
        } catch (error) {
            localStorage.removeItem('auth_token');
            set({ user: null, isAuthenticated: false });
        }
    },

    setError: (error) => set({ error }),
}));
`);

    // Create API service
    await fs.writeFile(path.join(projectDir, 'resources/services/api.ts'), `import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000/api',
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('auth_token');
    if (token) config.headers.Authorization = \`Bearer \${token}\`;
    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('auth_token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
`);

    // Create Login page
    await fs.writeFile(path.join(projectDir, 'resources/pages/Login.tsx'), `import React, { useState } from 'react';
import { useAuthStore } from '../stores/useAuthStore';
import { useNavigate } from 'react-router-dom';
${uiSystem === 'Material UI' ? "import { Box, Container, Typography, TextField, Button, Paper, Alert, Link } from '@mui/material';" : ""}
${uiSystem === 'Bootstrap 5' ? "import { Container, Card, Form, Button, Alert } from 'react-bootstrap';" : ""}

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, isLoading, error } = useAuthStore();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (error) {
            console.error('Login failed');
        }
    };

    ${uiSystem === 'Material UI' ? `
    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', bgcolor: '#f8fafc' }}>
            <Container maxWidth="xs">
                <Paper sx={{ p: 6, borderRadius: 8, boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                        <Typography variant="h4" sx={{ fontWeight: 900, mb: 1 }}>Welcome Back</Typography>
                        <Typography color="textSecondary">Sign in to your account</Typography>
                    </Box>

                    {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }}>{error}</Alert>}

                    <form onSubmit={handleSubmit}>
                        <TextField fullWidth label="Email Address" margin="normal" variant="outlined" value={email} onChange={(e) => setEmail(e.target.value)} sx={{ mb: 2 }} />
                        <TextField fullWidth label="Password" type="password" margin="normal" variant="outlined" value={password} onChange={(e) => setPassword(e.target.value)} sx={{ mb: 4 }} />
                        <Button fullWidth variant="contained" size="large" type="submit" disabled={isLoading} sx={{ py: 1.8, borderRadius: 3, fontWeight: 900, textTransform: 'none', fontSize: '1rem' }}>
                            {isLoading ? 'Decrypting...' : 'Sign In'}
                        </Button>
                    </form>

                    <Box sx={{ textAlign: 'center', mt: 4 }}>
                        <Typography color="textSecondary">
                            New here? <Link href="/register" sx={{ fontWeight: 700, textDecoration: 'none' }}>Create an account</Link>
                        </Typography>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );` : uiSystem === 'Bootstrap 5' ? `
    return (
        <div className="bg-light min-vh-100 d-flex align-items-center py-5">
            <Container>
                <Card className="border-0 shadow-lg rounded-5 mx-auto" style={{ maxWidth: '450px' }}>
                    <Card.Body className="p-5">
                        <div className="text-center mb-5">
                            <h2 className="fw-black mb-1">Welcome Back</h2>
                            <p className="text-muted">Sign in to your account</p>
                        </div>

                        {error && <Alert variant="danger" className="rounded-4">{error}</Alert>}

                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-4">
                                <Form.Label className="small fw-bold">Email Address</Form.Label>
                                <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="py-3 px-4 rounded-4 border-2" placeholder="name@example.com" />
                            </Form.Group>
                            <Form.Group className="mb-5">
                                <Form.Label className="small fw-bold">Password</Form.Label>
                                <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="py-3 px-4 rounded-4 border-2" placeholder="••••••••" />
                            </Form.Group>
                            <Button variant="dark" type="submit" disabled={isLoading} className="w-100 py-3 fw-black rounded-4 shadow">
                                {isLoading ? 'Authenticating...' : 'Sign In'}
                            </Button>
                        </Form>

                        <div className="text-center mt-4">
                            <p className="text-muted">Don't have an account? <a href="/register" className="fw-bold text-dark">Register</a></p>
                        </div>
                    </Card.Body>
                </Card>
            </Container>
        </div>
    );` : `
    return (
        <div className="\${p}min-h-screen \${p}flex \${p}items-center \${p}justify-center \${p}bg-secondary-50 \${p}py-12 \${p}px-4">
            <div className="\${p}max-w-md \${p}w-full \${p}bg-white \${p}p-10 \${p}rounded-[40px] \${p}shadow-2xl \${p}border \${p}border-white">
                <div className="\${p}text-center \${p}mb-10">
                    <h2 className="\${p}text-4xl \${p}font-black \${p}mb-2">Welcome Back</h2>
                    <p className="\${p}text-secondary-600">Enter your credentials to continue</p>
                </div>

                {error && (
                    <div className="\${p}mb-6 \${p}p-4 \${p}bg-danger-50 \${p}text-danger-600 \${p}rounded-2xl \${p}text-sm \${p}font-bold">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="\${p}space-y-6">
                    <div>
                        <label className="\${p}block \${p}text-xs \${p}font-black \${p}text-secondary-500 \${p}uppercase \${p}tracking-widest \${p}mb-2">Email Address</label>
                        <input 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)}
                            className="\${p}w-full \${p}px-6 \${p}py-4 \${p}bg-secondary-50 \${p}border-2 \${p}border-transparent \${p}focus-border-primary-500 \${p}rounded-2xl \${p}transition-all \${p}outline-none \${p}font-bold"
                            placeholder="hello@rice.com"
                        />
                    </div>
                    <div>
                        <label className="\${p}block \${p}text-xs \${p}font-black \${p}text-secondary-500 \${p}uppercase \${p}tracking-widest \${p}mb-2">Password</label>
                        <input 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)}
                            className="\${p}w-full \${p}px-6 \${p}py-4 \${p}bg-secondary-50 \${p}border-2 \${p}border-transparent \${p}focus-border-primary-500 \${p}rounded-2xl \${p}transition-all \${p}outline-none \${p}font-bold"
                            placeholder="••••••••"
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="\${p}w-full \${p}py-4 \${p}bg-secondary-900 \${p}text-white \${p}rounded-2xl \${p}font-black \${p}text-lg \${p}shadow-xl \${p}hover-scale-[1.02] \${p}active-scale-95 \${p}transition-all \${p}disabled-opacity-50">
                        {isLoading ? 'Authenticating...' : 'Sign In'}
                    </button>
                </form>

                <p className="\${p}text-center \${p}mt-10 \${p}text-secondary-600">
                    New here? <a href="/register" className="\${p}text-primary-500 \${p}font-black \${p}hover-underline">Create an account</a>
                </p>
            </div>
        </div>
    );`}
}
`);

    // Create Register page
    await fs.writeFile(path.join(projectDir, 'resources/pages/Register.tsx'), `import React, { useState } from 'react';
import { useAuthStore } from '../stores/useAuthStore';
import { useNavigate } from 'react-router-dom';
${uiSystem === 'Material UI' ? "import { Box, Container, Typography, TextField, Button, Paper, Alert, Link, Checkbox, FormControlLabel } from '@mui/material';" : ""}
${uiSystem === 'Bootstrap 5' ? "import { Container, Card, Form, Button, Alert } from 'react-bootstrap';" : ""}

export default function Register() {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', password_confirmation: '' });
    const { register, isLoading, error } = useAuthStore();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.password_confirmation) {
            alert('Passwords do not match');
            return;
        }
        try {
            await register(formData);
            navigate('/dashboard');
        } catch (error) {
            console.error('Registration failed');
        }
    };

    ${uiSystem === 'Material UI' ? `
    return (
        <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', bgcolor: '#f8fafc', py: 8 }}>
            <Container maxWidth="xs">
                <Paper sx={{ p: 6, borderRadius: 8, boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                        <Typography variant="h4" sx={{ fontWeight: 900, mb: 1 }}>Sign Up</Typography>
                        <Typography color="textSecondary">Create your free account</Typography>
                    </Box>

                    {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }}>{error}</Alert>}

                    <form onSubmit={handleSubmit}>
                        <TextField fullWidth label="Full Name" margin="normal" variant="outlined" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} sx={{ mb: 2 }} />
                        <TextField fullWidth label="Email Address" margin="normal" variant="outlined" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} sx={{ mb: 2 }} />
                        <TextField fullWidth label="Password" type="password" margin="normal" variant="outlined" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} sx={{ mb: 2 }} />
                        <TextField fullWidth label="Confirm Password" type="password" margin="normal" variant="outlined" value={formData.password_confirmation} onChange={(e) => setFormData({...formData, password_confirmation: e.target.value})} sx={{ mb: 4 }} />
                        
                        <Button fullWidth variant="contained" size="large" type="submit" disabled={isLoading} sx={{ py: 1.8, borderRadius: 3, fontWeight: 900, textTransform: 'none', fontSize: '1rem' }}>
                            {isLoading ? 'Creating Account...' : 'Get Started'}
                        </Button>
                    </form>

                    <Box sx={{ textAlign: 'center', mt: 4 }}>
                        <Typography color="textSecondary">
                            Already have an account? <Link href="/login" sx={{ fontWeight: 700, textDecoration: 'none' }}>Sign in here</Link>
                        </Typography>
                    </Box>
                </Paper>
            </Container>
        </Box>
    );` : uiSystem === 'Bootstrap 5' ? `
    return (
        <div className="bg-light min-vh-100 d-flex align-items-center py-5">
            <Container>
                <Card className="border-0 shadow-lg rounded-5 mx-auto" style={{ maxWidth: '500px' }}>
                    <Card.Body className="p-5">
                        <div className="text-center mb-5">
                            <h2 className="fw-black mb-1">Create Account</h2>
                            <p className="text-muted">Start your journey with us</p>
                        </div>

                        {error && <Alert variant="danger" className="rounded-4">{error}</Alert>}

                        <Form onSubmit={handleSubmit}>
                            <Form.Group className="mb-3">
                                <Form.Label className="small fw-bold">Full Name</Form.Label>
                                <Form.Control type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="py-3 px-4 rounded-4 border-2" />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label className="small fw-bold">Email Address</Form.Label>
                                <Form.Control type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="py-3 px-4 rounded-4 border-2" />
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label className="small fw-bold">Password</Form.Label>
                                <Form.Control type="password" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="py-3 px-4 rounded-4 border-2" />
                            </Form.Group>
                            <Form.Group className="mb-5">
                                <Form.Label className="small fw-bold">Confirm Password</Form.Label>
                                <Form.Control type="password" value={formData.password_confirmation} onChange={(e) => setFormData({...formData, password_confirmation: e.target.value})} className="py-3 px-4 rounded-4 border-2" />
                            </Form.Group>
                            <Button variant="dark" type="submit" disabled={isLoading} className="w-100 py-3 fw-black rounded-4 shadow">
                                {isLoading ? 'Processing...' : 'Register Now'}
                            </Button>
                        </Form>

                        <div className="text-center mt-4">
                            <p className="text-muted mb-0">Member already? <a href="/login" className="fw-bold text-dark">Login instead</a></p>
                        </div>
                    </Card.Body>
                </Card>
            </Container>
        </div>
    );` : `
    return (
        <div className="\${p}min-h-screen \${p}flex \${p}items-center \${p}justify-center \${p}bg-secondary-50 \${p}py-20 \${p}px-4">
            <div className="\${p}max-w-md \${p}w-full \${p}bg-white \${p}p-10 \${p}rounded-[40px] \${p}shadow-2xl \${p}border \${p}border-white">
                <div className="\${p}text-center \${p}mb-10">
                    <h2 className="\${p}text-4xl \${p}font-black \${p}mb-2">Get Started</h2>
                    <p className="\${p}text-secondary-600">Join our premium community today</p>
                </div>

                {error && (
                    <div className="\${p}mb-6 \${p}p-4 \${p}bg-danger-50 \${p}text-danger-600 \${p}rounded-2xl \${p}text-sm \${p}font-bold">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="\${p}space-y-5">
                    <div>
                        <label className="\${p}text-xs \${p}font-black \${p}text-secondary-500 \${p}uppercase \${p}tracking-widest \${p}mb-2 \${p}block">Name</label>
                        <input type="text" className="\${p}w-full \${p}px-6 \${p}py-4 \${p}bg-secondary-50 \${p}border-2 \${p}border-transparent \${p}focus-border-primary-500 \${p}rounded-2xl \${p}outline-none \${p}font-bold" placeholder="Dhafa N." value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                    </div>
                    <div>
                        <label className="\${p}text-xs \${p}font-black \${p}text-secondary-500 \${p}uppercase \${p}tracking-widest \${p}mb-2 \${p}block">Email</label>
                        <input type="email" className="\${p}w-full \${p}px-6 \${p}py-4 \${p}bg-secondary-50 \${p}border-2 \${p}border-transparent \${p}focus-border-primary-500 \${p}rounded-2xl \${p}outline-none \${p}font-bold" placeholder="name@example.com" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
                    </div>
                    <div>
                        <label className="\${p}text-xs \${p}font-black \${p}text-secondary-500 \${p}uppercase \${p}tracking-widest \${p}mb-2 \${p}block">Password</label>
                        <input type="password" className="\${p}w-full \${p}px-6 \${p}py-4 \${p}bg-secondary-50 \${p}border-2 \${p}border-transparent \${p}focus-border-primary-500 \${p}rounded-2xl \${p}outline-none \${p}font-bold" placeholder="••••••••" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} required />
                    </div>
                    <div>
                        <label className="\${p}text-xs \${p}font-black \${p}text-secondary-500 \${p}uppercase \${p}tracking-widest \${p}mb-2 \${p}block">Confirm Password</label>
                        <input type="password" className="\${p}w-full \${p}px-6 \${p}py-4 \${p}bg-secondary-50 \${p}border-2 \${p}border-transparent \${p}focus-border-primary-500 \${p}rounded-2xl \${p}outline-none \${p}font-bold" placeholder="••••••••" value={formData.password_confirmation} onChange={(e) => setFormData({...formData, password_confirmation: e.target.value})} required />
                    </div>
                    
                    <button type="submit" disabled={isLoading} className="\${p}w-full \${p}py-4 \${p}bg-secondary-900 \${p}text-white \${p}rounded-2xl \${p}font-black \${p}text-lg \${p}shadow-xl \${p}hover-scale-[1.02] \${p}active-scale-95 \${p}transition-all \${p}mt-4">
                        {isLoading ? 'Processing...' : 'Create Account'}
                    </button>
                </form>

                <p className="\${p}text-center \${p}mt-10 \${p}text-secondary-600">
                    Already have an account? <a href="/login" className="\${p}text-primary-500 \${p}font-black \${p}hover-underline">Sign in</a>
                </p>
            </div>
        </div>
    );`}
}
`);

    // Create auth routes
    await fs.writeFile(path.join(projectDir, 'routes/auth.ts'), `import { Route } from '@ereactthohir/core';

Route.group({ prefix: '/auth' }, () => {
    Route.get('/login', (req, res) => res.view('Login'));
    Route.get('/register', (req, res) => res.view('Register'));
});
`);
}

/**
 * Generate Enterprise App Template
 */
async function generateEnterpriseTemplate(projectDir: string, uiSystem: string): Promise<void> {
    const h = getUIHelper(uiSystem);
    const p = h.cls('rice-', '', 'joko-');

    // Create API service with advanced interceptors
    await fs.writeFile(path.join(projectDir, 'resources/services/api.ts'), `import axios, { AxiosInstance } from 'axios';

class EnterpriseApiService {
    private api: AxiosInstance;
    private requestQueue: any[] = [];
    private isRefreshing = false;

    constructor() {
        this.api = axios.create({
            baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000/api',
            timeout: 15000,
        });

        this.setupInterceptors();
    }

    private setupInterceptors() {
        this.api.interceptors.request.use((config) => {
            const token = localStorage.getItem('auth_token');
            if (token) {
                config.headers.Authorization = \`Bearer \${token}\`;
            }
            config.headers['X-Client-Version'] = '1.0.0';
            return config;
        });

        this.api.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error.config;

                if (error.response?.status === 401 && !originalRequest._retry) {
                    if (!this.isRefreshing) {
                        this.isRefreshing = true;
                        try {
                            const response = await this.api.post('/auth/refresh');
                            localStorage.setItem('auth_token', response.data.token);
                            this.isRefreshing = false;
                            this.processQueue(null);

                            originalRequest._retry = true;
                            return this.api(originalRequest);
                        } catch (refreshError) {
                            this.isRefreshing = false;
                            this.processQueue(refreshError);
                            localStorage.removeItem('auth_token');
                            window.location.href = '/login';
                        }
                    }

                    return new Promise((resolve, reject) => {
                        this.requestQueue.push({ resolve, reject });
                    }).then(() => this.api(originalRequest));
                }

                return Promise.reject(error);
            }
        );
    }

    private processQueue(error: any) {
        this.requestQueue.forEach((req) => {
            if (error) {
                req.reject(error);
            } else {
                req.resolve();
            }
        });
        this.requestQueue = [];
    }

    async get(url: string, config?: any) { return this.api.get(url, config); }
    async post(url: string, data?: any, config?: any) { return this.api.post(url, data, config); }
    async put(url: string, data?: any, config?: any) { return this.api.put(url, data, config); }
    async patch(url: string, data?: any, config?: any) { return this.api.patch(url, data, config); }
    async delete(url: string, config?: any) { return this.api.delete(url, config); }
}

export default new EnterpriseApiService();
`);

    // Create advanced store with persistence
    await fs.writeFile(path.join(projectDir, 'resources/stores/useEnterpriseStore.ts'), `import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    permissions: string[];
}

interface EnterpriseState {
    user: User | null;
    organization: any | null;
    features: string[];
    settings: Record<string, any>;
    
    setUser: (user: User) => void;
    setOrganization: (org: any) => void;
    setFeatures: (features: string[]) => void;
    updateSettings: (settings: Record<string, any>) => void;
    hasPermission: (permission: string) => boolean;
}

export const useEnterpriseStore = create<EnterpriseState>()(
    persist(
        (set, get) => ({
            user: null,
            organization: null,
            features: [],
            settings: {},

            setUser: (user) => set({ user }),
            setOrganization: (organization) => set({ organization }),
            setFeatures: (features) => set({ features }),
            updateSettings: (settings) => set((state) => ({
                settings: { ...state.settings, ...settings }
            })),
            hasPermission: (permission: string) => {
                const { user } = get();
                return user?.permissions.includes(permission) || false;
            },
        }),
        { name: 'enterprise-store' }
    )
);
`);

    // Create Dashboard page
    await fs.writeFile(path.join(projectDir, 'resources/pages/Dashboard.tsx'), `import React from 'react';
${uiSystem === 'Material UI' ? "import { Box, Container, Typography, Grid, Paper, IconButton, Avatar, Card, CardContent } from '@mui/material';" : ""}
${uiSystem === 'Bootstrap 5' ? "import { Container, Row, Col, Card, Nav, Navbar } from 'react-bootstrap';" : ""}

export default function Dashboard() {
    ${uiSystem === 'Material UI' ? `
    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f1f5f9' }}>
            <Box sx={{ flexGrow: 1, p: 4 }}>
                <Container maxWidth="xl">
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 6 }}>
                        <Box>
                            <Typography variant="h4" sx={{ fontWeight: 900, mb: 1 }}>Enterprise Dashboard</Typography>
                            <Typography color="textSecondary">Welcome back, Admin</Typography>
                        </Box>
                        <Avatar sx={{ width: 48, height: 48, bgcolor: 'primary.main' }}>AD</Avatar>
                    </Box>

                    <Grid container spacing={4}>
                        {[1, 2, 3, 4].map(i => (
                            <Grid item xs={12} sm={6} md={3} key={i}>
                                <Paper sx={{ p: 4, borderRadius: 6, boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                                    <Typography color="textSecondary" sx={{ fontWeight: 700, mb: 1 }}>Metric \${i}</Typography>
                                    <Typography variant="h3" sx={{ fontWeight: 900 }}>\${(Math.random() * 100).toFixed(0)}%</Typography>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>

                    <Paper sx={{ mt: 6, p: 4, borderRadius: 6 }}>
                        <Typography variant="h6" sx={{ fontWeight: 900, mb: 4 }}>Recent Activities</Typography>
                        <Box sx={{ height: 400, bgcolor: '#f8fafc', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Typography color="textSecondary">Performance Data Visualization</Typography>
                        </Box>
                    </Paper>
                </Container>
            </Box>
        </Box>
    );` : uiSystem === 'Bootstrap 5' ? `
    return (
        <div className="bg-light min-vh-100 pb-5">
            <Navbar bg="white" className="border-bottom py-3 mb-5">
                <Container>
                    <Navbar.Brand className="fw-black fs-4">ENTERPRISE OS</Navbar.Brand>
                    <Nav className="ms-auto flex-row gap-4 align-items-center">
                        <Nav.Link href="#" className="fw-bold">Settings</Nav.Link>
                        <div className="bg-dark text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>A</div>
                    </Nav>
                </Container>
            </Navbar>

            <Container>
                <div className="mb-5">
                    <h2 className="fw-black mb-1">Corporate Insights</h2>
                    <p className="text-muted">Analyzing organizational metrics in real-time</p>
                </div>

                <Row className="g-4 mb-5">
                    {[1, 2, 3, 4].map(i => (
                        <Col md={3} key={i}>
                            <Card className="border-0 shadow-sm rounded-4 p-3">
                                <Card.Body>
                                    <h6 className="text-muted fw-bold mb-3 uppercase small tracking-wider">KPI \${i}</h6>
                                    <h2 className="fw-black mb-0">\${(Math.random() * 10).toFixed(1)}M</h2>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>

                <Card className="border-0 shadow-sm rounded-5 overflow-hidden">
                    <Card.Body className="p-0">
                        <div className="p-4 border-bottom d-flex justify-content-between">
                            <h5 className="mb-0 fw-black">Enterprise Resource Distribution</h5>
                        </div>
                        <div className="bg-white p-5 text-center" style={{ height: '400px' }}>
                            <div className="bg-light w-100 h-100 rounded-5 d-flex align-items-center justify-content-center border-dashed">
                                <p className="text-muted mb-0">Graphic Layer (Chart.js / D3)</p>
                            </div>
                        </div>
                    </Card.Body>
                </Card>
            </Container>
        </div>
    );` : `
    return (
        <div className="\${p}min-h-screen \${p}bg-secondary-50 \${p}flex">
            {/* Sidebar */}
            <div className="\${p}w-72 \${p}bg-secondary-900 \${p}text-white \${p}p-8 \${p}flex \${p}flex-col">
                <div className="\${p}text-2xl \${p}font-black \${p}mb-12 \${p}tracking-tighter">ERECT_ENT</div>
                <div className="\${p}space-y-4 \${p}flex-1">
                    <div className="\${p}px-4 \${p}py-3 \${p}bg-primary-500 \${p}rounded-2xl \${p}font-black">Overview</div>
                    <div className="\${p}px-4 \${p}py-3 \${p}text-secondary-400 \${p}hover-text-white \${p}transition-colors">Team</div>
                    <div className="\${p}px-4 \${p}py-3 \${p}text-secondary-400 \${p}hover-text-white \${p}transition-colors">Compliance</div>
                    <div className="\${p}px-4 \${p}py-3 \${p}text-secondary-400 \${p}hover-text-white \${p}transition-colors">Financials</div>
                </div>
                <div className="\${p}pt-8 \${p}border-t \${p}border-secondary-800">
                    <div className="\${p}flex \${p}items-center \${p}gap-4">
                        <div className="\${p}w-10 \${p}h-10 \${p}bg-secondary-700 \${p}rounded-full"></div>
                        <div>
                            <div className="\${p}text-sm \${p}font-black">Dhafa Thohir</div>
                            <div className="\${p}text-xs \${p}text-secondary-500">CEO</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="\${p}flex-1 \${p}p-12 \${p}overflow-y-auto">
                <header className="\${p}flex \${p}justify-between \${p}items-end \${p}mb-12">
                    <div>
                        <h1 className="\${p}text-4xl \${p}font-black \${p}mb-2">Operational Hub</h1>
                        <p className="\${p}text-secondary-500">Global system status: <span className="\${p}text-success-500 \${p}font-black">OPTIMAL</span></p>
                    </div>
                    <button className="\${p}px-6 \${p}py-3 \${p}bg-white \${p}border-2 \${p}border-secondary-200 \${p}rounded-2xl \${p}font-black \${p}hover-border-secondary-900 \${p}transition-all">
                        Report Sync
                    </button>
                </header>

                <div className="\${p}grid \${p}grid-cols-3 \${p}gap-8 \${p}mb-8">
                    <div className="\${p}p-8 \${p}bg-white \${p}rounded-[32px] \${p}shadow-sm \${p}border \${p}border-secondary-100">
                        <div className="\${p}text-secondary-400 \${p}text-xs \${p}font-black \${p}uppercase \${p}tracking-widest \${p}mb-2">Total Equity</div>
                        <div className="\${p}text-3xl \${p}font-black">$2.4M</div>
                    </div>
                    <div className="\${p}p-8 \${p}bg-white \${p}rounded-[32px] \${p}shadow-sm \${p}border \${p}border-secondary-100">
                        <div className="\${p}text-secondary-400 \${p}text-xs \${p}font-black \${p}uppercase \${p}tracking-widest \${p}mb-2">Active Nodes</div>
                        <div className="\${p}text-3xl \${p}font-black">104</div>
                    </div>
                    <div className="\${p}p-8 \${p}bg-white \${p}rounded-[32px] \${p}shadow-sm \${p}border \${p}border-secondary-100">
                        <div className="\${p}text-secondary-400 \${p}text-xs \${p}font-black \${p}uppercase \${p}tracking-widest \${p}mb-2">Compliance Score</div>
                        <div className="\${p}text-3xl \${p}font-black">98.2</div>
                    </div>
                </div>

                <div className="\${p}bg-white \${p}rounded-[40px] \${p}p-10 \${p}shadow-sm \${p}border \${p}border-secondary-100">
                    <div className="\${p}flex \${p}justify-between \${p}items-center \${p}mb-8">
                        <h2 className="\${p}text-xl \${p}font-black">Strategic Performance Matrix</h2>
                        <div className="\${p}flex \${p}gap-2">
                             <div className="\${p}w-3 \${p}h-3 \${p}bg-primary-500 \${p}rounded-full"></div>
                             <div className="\${p}w-3 \${p}h-3 \${p}bg-secondary-200 \${p}rounded-full"></div>
                        </div>
                    </div>
                    <div className="\${p}w-full \${p}h-96 \${p}bg-secondary-50 \${p}rounded-[32px] \${p}flex \${p}items-center \${p}justify-center \${p}border-2 \${p}border-dashed \${p}border-secondary-200">
                        <p className="\${p}text-secondary-400 \${p}font-bold">Real-time Visualization Engine</p>
                    </div>
                </div>
            </div>
        </div>
    );`}
}
`);

    // Create main routes
    await fs.writeFile(path.join(projectDir, 'routes/enterprise.ts'), `import { Route } from '@ereactthohir/core';

Route.middleware(['auth']).group(() => {
    Route.get('/dashboard', (req, res) => res.view('Dashboard'));
});
`);
}

/**
 * Generate SaaS Template
 */
async function generateSaaSTemplate(projectDir: string, uiSystem: string): Promise<void> {
    const h = getUIHelper(uiSystem);
    const p = h.cls('rice-', '', 'joko-');

    // Create subscription service
    await fs.writeFile(path.join(projectDir, 'resources/services/subscription.ts'), `import apiService from './api';

export class SubscriptionService {
    async getPlans() {
        const response = await apiService.get('/subscription/plans');
        return response.data;
    }

    async subscribe(planId: number, billingCycle: 'monthly' | 'yearly') {
        const response = await apiService.post('/subscription/subscribe', {
            plan_id: planId,
            billing_cycle: billingCycle,
        });
        return response.data;
    }

    async getCurrentSubscription() {
        const response = await apiService.get('/subscription/current');
        return response.data;
    }

    async cancelSubscription() {
        const response = await apiService.post('/subscription/cancel');
        return response.data;
    }

    async upgradeSubscription(planId: number) {
        const response = await apiService.post('/subscription/upgrade', { plan_id: planId });
        return response.data;
    }

    async getInvoices() {
        const response = await apiService.get('/subscription/invoices');
        return response.data;
    }
}

export default new SubscriptionService();
`);

    // Create SaaS store
    await fs.writeFile(path.join(projectDir, 'resources/stores/useSaaSStore.ts'), `import { create } from 'zustand';
import subscriptionService from '../services/subscription';

interface Subscription {
    id: number;
    plan: any;
    status: 'active' | 'canceled' | 'expired';
    billing_cycle: 'monthly' | 'yearly';
    current_period_start: string;
    current_period_end: string;
}

interface SaaSState {
    subscription: Subscription | null;
    plans: any[];
    invoices: any[];
    isLoading: boolean;

    loadPlans: () => Promise<void>;
    loadSubscription: () => Promise<void>;
    loadInvoices: () => Promise<void>;
    subscribe: (planId: number, cycle: string) => Promise<void>;
    cancelSubscription: () => Promise<void>;
}

export const useSaaSStore = create<SaaSState>((set) => ({
    subscription: null,
    plans: [],
    invoices: [],
    isLoading: false,

    loadPlans: async () => {
        set({ isLoading: true });
        try {
            const plans = await subscriptionService.getPlans();
            set({ plans });
        } finally {
            set({ isLoading: false });
        }
    },

    loadSubscription: async () => {
        try {
            const subscription = await subscriptionService.getCurrentSubscription();
            set({ subscription });
        } catch (error) {
            console.error('Failed to load subscription:', error);
        }
    },

    loadInvoices: async () => {
        try {
            const invoices = await subscriptionService.getInvoices();
            set({ invoices });
        } catch (error) {
            console.error('Failed to load invoices:', error);
        }
    },

    subscribe: async (planId: number, cycle: string) => {
        set({ isLoading: true });
        try {
            await subscriptionService.subscribe(planId, cycle as any);
            await subscriptionService.getCurrentSubscription();
        } finally {
            set({ isLoading: false });
        }
    },

    cancelSubscription: async () => {
        set({ isLoading: true });
        try {
            await subscriptionService.cancelSubscription();
            set({ subscription: null });
        } finally {
            set({ isLoading: false });
        }
    },
}));
`);

    // Create Pricing page
    await fs.writeFile(path.join(projectDir, 'resources/pages/Pricing.tsx'), `import React, { useState } from 'react';
${uiSystem === 'Material UI' ? "import { Box, Container, Typography, Button, Grid, Card, List, ListItem, ListItemIcon, ListItemText, Switch, Stack } from '@mui/material';" : ""}
${uiSystem === 'Bootstrap 5' ? "import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';" : ""}

const plans = [
    { id: 1, name: 'Basic', description: 'Perfect for side projects and small experiments.', price: '$0', featured: false, features: ['1 Project', '1,000 requests/mo', 'Basic Support', 'Community Access'] },
    { id: 2, name: 'Pro', description: 'The power you need for your growing business.', price: '$29', featured: true, features: ['Unlimited Projects', '50,000 requests/mo', 'Priority Support', 'Advanced Analytics', 'Custom Domains'] },
    { id: 3, name: 'Enterprise', description: 'Advanced security and support for large teams.', price: 'Custom', featured: false, features: ['Everything in Pro', 'Unlimited requests', '24/7 Phone Support', 'SLA Guarantee', 'Dedicated Manager'] },
];

export default function Pricing() {
    const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');

    ${uiSystem === 'Material UI' ? `
    return (
        <Box sx={{ minHeight: '100vh', bgcolor: '#f8fafc', py: 15 }}>
            <Container>
                <Box sx={{ textAlign: 'center', mb: 10 }}>
                    <Typography variant="h2" sx={{ fontWeight: 900, mb: 2, tracking: -2 }}>
                        Scale your <Box component="span" sx={{ color: 'primary.main' }}>Ideas</Box>.
                    </Typography>
                    <Typography color="textSecondary" sx={{ fontSize: '1.2rem', maxW: 600, mx: 'auto', mb: 6 }}>
                        Choose a plan that scales with your growth. No hidden fees.
                    </Typography>
                    <Stack direction="row" spacing={2} justifyContent="center" alignItems="center">
                        <Typography sx={{ fontWeight: 700 }}>Monthly</Typography>
                        <Switch checked={billing === 'yearly'} onChange={() => setBilling(billing === 'monthly' ? 'yearly' : 'monthly')} />
                        <Typography sx={{ fontWeight: 700 }}>Yearly <Box component="span" sx={{ color: 'success.main' }}>-20%</Box></Typography>
                    </Stack>
                </Box>

                <Grid container spacing={4} alignItems="center">
                    {plans.map((plan) => (
                        <Grid item xs={12} md={4} key={plan.id}>
                            <Card sx={{ p: 5, borderRadius: 10, border: plan.featured ? '2px solid' : 'none', borderColor: 'primary.main', transform: plan.featured ? 'scale(1.05)' : 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
                                <Typography variant="h5" sx={{ fontWeight: 900, mb: 1 }}>{plan.name}</Typography>
                                <Typography color="textSecondary" sx={{ mb: 4, height: 60 }}>{plan.description}</Typography>
                                <Box sx={{ display: 'flex', alignItems: 'baseline', mb: 4 }}>
                                    <Typography variant="h3" sx={{ fontWeight: 900 }}>{plan.price}</Typography>
                                    <Typography color="textSecondary" sx={{ ml: 1, fontWeight: 700 }}>/mo</Typography>
                                </Box>
                                <Button fullWidth variant={plan.featured ? "contained" : "outlined"} sx={{ py: 2, borderRadius: 4, fontWeight: 900, mb: 4 }}>Get Started</Button>
                                <List>
                                    {plan.features.map(f => (
                                        <ListItem key={f} sx={{ px: 0 }}>
                                            <ListItemText primary={f} primaryTypographyProps={{ fontWeight: 700, fontSize: '0.9rem' }} />
                                        </ListItem>
                                    ))}
                                </List>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );` : uiSystem === 'Bootstrap 5' ? `
    return (
        <div className="bg-white min-vh-100 py-5">
            <Container className="py-5">
                <div className="text-center mb-5">
                    <h1 className="display-3 fw-black mb-3">Scale your Projects</h1>
                    <p className="lead text-muted mx-auto mb-5" style={{ maxWidth: '600px' }}>Choose a plan that scales with your growth. Simple, transparent pricing.</p>
                    <div className="d-flex justify-content-center align-items-center gap-3">
                        <span className="fw-bold">Monthly</span>
                        <Form.Check type="switch" checked={billing === 'yearly'} onChange={() => setBilling(billing === 'monthly' ? 'yearly' : 'monthly')} />
                        <span className="fw-bold">Yearly <span className="text-success">(Save 20%)</span></span>
                    </div>
                </div>

                <Row className="g-4 align-items-center">
                    {plans.map(plan => (
                        <Col md={4} key={plan.id}>
                            <Card className={\`border-\${plan.featured ? 'primary' : '0'} shadow-lg rounded-5 p-4 \${plan.featured ? 'scale-105' : ''}\`} style={plan.featured ? { borderWidth: '2px' } : {}}>
                                <Card.Body>
                                    <h3 className="fw-black mb-1">{plan.name}</h3>
                                    <p className="text-muted mb-4">{plan.description}</p>
                                    <div className="d-flex align-items-baseline mb-4">
                                        <span className="display-4 fw-black">{plan.price}</span>
                                        <span className="text-muted ms-2 fw-bold">/mo</span>
                                    </div>
                                    <Button variant={plan.featured ? 'primary' : 'outline-dark'} className="w-100 py-3 fw-black rounded-4 mb-4">Get Started</Button>
                                    <ul className="list-unstyled">
                                        {plan.features.map(f => (
                                            <li key={f} className="mb-3 fw-bold text-secondary small">✓ {f}</li>
                                        ))}
                                    </ul>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>
        </div>
    );` : `
    return (
        <div className="\${p}min-h-screen \${p}bg-secondary-50 \${p}py-24 \${p}px-6">
            <div className="\${p}max-w-7xl \${p}mx-auto">
                <div className="\${p}text-center \${p}mb-16">
                    <h1 className="\${p}text-5xl \${p}md-text-7xl \${p}font-black \${p}tracking-tight \${p}mb-6">
                        Scale your <span className="\${p}gradient-primary \${p}bg-clip-text \${p}text-transparent">Ideas</span>.
                    </h1>
                    <p className="\${p}text-xl \${p}text-secondary-600 \${p}max-w-2xl \${p}mx-auto \${p}mb-10">
                        Choose a plan that scales with your growth. No hidden fees, cancel anytime.
                    </p>
                    
                    {/* Billing Toggle */}
                    <div className="\${p}inline-flex \${p}p-1 \${p}bg-secondary-200 \${p}rounded-2xl \${p}mb-12">
                        <button 
                            onClick={() => setBilling('monthly')}
                            className={\`\${p}px-6 \${p}py-2 \${p}rounded-xl \${p}text-sm \${p}font-bold \${p}transition-all \${billing === 'monthly' ? '\${p}bg-white \${p}shadow-sm' : '\${p}text-secondary-600'}\`}>
                            Monthly
                        </button>
                        <button 
                            onClick={() => setBilling('yearly')}
                            className={\`\${p}px-6 \${p}py-2 \${p}rounded-xl \${p}text-sm \${p}font-bold \${p}transition-all \${billing === 'yearly' ? '\${p}bg-white \${p}shadow-sm' : '\${p}text-secondary-600'}\`}>
                            Yearly <span className="\${p}text-success-600">-20%</span>
                        </button>
                    </div>
                </div>

                <div className="\${p}grid \${p}grid-cols-1 \${p}md-grid-cols-3 \${p}gap-8">
                    {plans.map((plan) => (
                        <div key={plan.id} className={\`\${p}relative \${p}p-10 \${p}bg-white \${p}rounded-[40px] \${p}border-2 \${p}transition-all \${p}hover-shadow-2xl \${plan.featured ? '\${p}border-primary-500 \${p}scale-105 \${p}z-10' : '\${p}border-transparent \${p}shadow-sm'}\`}>
                            <h3 className="\${p}text-2xl \${p}font-black \${p}mb-2">{plan.name}</h3>
                            <p className="\${p}text-secondary-500 \${p}mb-8 \${p}h-12">{plan.description}</p>
                            <div className="\${p}flex \${p}items-baseline \${p}mb-8">
                                <span className="\${p}text-5xl \${p}font-black">{plan.price}</span>
                                <span className="\${p}text-secondary-500 \${p}ml-2 \${p}font-bold">/mo</span>
                            </div>
                            <button className={\`\${p}w-full \${p}py-4 \${p}rounded-2xl \${p}font-black \${p}transition-all \${p}mb-8 \${plan.featured ? '\${p}bg-primary-500 \${p}text-white \${p}shadow-lg' : '\${p}bg-secondary-900 \${p}text-white'}\`}>
                                Get Started
                            </button>
                            <ul className="\${p}space-y-4">
                                {plan.features.map(f => (
                                    <li key={f} className="\${p}flex \${p}items-center \${p}gap-3 \${p}text-sm \${p}font-bold \${p}text-secondary-600">
                                        <span className="\${p}text-success-500">✓</span> {f}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );`}
}
`);

    // Create Subscription Management page
    await fs.writeFile(path.join(projectDir, 'resources/pages/Subscription.tsx'), `import React, { useEffect } from 'react';
import { useSaaSStore } from '../stores/useSaaSStore';

export default function Subscription() {
    const { subscription, invoices, loadSubscription, loadInvoices } = useSaaSStore();

    useEffect(() => {
        loadSubscription();
        loadInvoices();
    }, []);

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Subscription Management</h1>

            {subscription && (
                <div className="bg-white rounded-lg shadow p-6 mb-8">
                    <h2 className="text-xl font-semibold mb-4">Current Plan</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-gray-600">Plan</p>
                            <p className="font-semibold">{subscription.plan.name}</p>
                        </div>
                        <div>
                            <p className="text-gray-600">Status</p>
                            <p className="font-semibold text-green-600">{subscription.status}</p>
                        </div>
                        <div>
                            <p className="text-gray-600">Renewal Date</p>
                            <p className="font-semibold">{new Date(subscription.current_period_end).toLocaleDateString()}</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-6 border-b">
                    <h2 className="text-xl font-semibold">Invoices</h2>
                </div>
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left">Date</th>
                            <th className="px-6 py-3 text-left">Amount</th>
                            <th className="px-6 py-3 text-left">Status</th>
                            <th className="px-6 py-3 text-left">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoices.map((invoice) => (
                            <tr key={invoice.id} className="border-t">
                                <td className="px-6 py-3">{new Date(invoice.date).toLocaleDateString()}</td>
                                <td className="px-6 py-3">\${invoice.amount}</td>
                                <td className="px-6 py-3">{invoice.status}</td>
                                <td className="px-6 py-3">
                                    <a href={invoice.url} className="text-blue-500 hover:underline">Download</a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
`);

    // Create SaaS routes
    await fs.writeFile(path.join(projectDir, 'routes/saas.ts'), `import { Route } from '@ereactthohir/core';

// Public pricing
Route.get('/pricing', 'PricingController@index').name('pricing');

Route.middleware(['auth']).group(() => {
    // Subscription management
    Route.get('/subscription', 'SubscriptionController@index').name('subscription');
    Route.post('/subscription/subscribe', 'SubscriptionController@subscribe').name('subscription.subscribe');
    Route.post('/subscription/cancel', 'SubscriptionController@cancel').name('subscription.cancel');
    Route.post('/subscription/upgrade', 'SubscriptionController@upgrade').name('subscription.upgrade');
    
    // Invoices
    Route.get('/invoices', 'InvoiceController@index').name('invoices');
    Route.get('/invoices/:id', 'InvoiceController@show').name('invoices.show');
});
`);
}

/**
 * Get UI Framework dependencies based on selection
 */
function getUIDependencies(uiSystem: string): Record<string, string> {
    const deps: Record<string, string> = {};

    switch (uiSystem) {
        case 'Tailwind CSS':
            deps['tailwindcss'] = '^3.3.0';
            break;
        case 'Bootstrap 5':
            deps['bootstrap'] = '^5.3.0';
            deps['react-bootstrap'] = '^2.8.0';
            break;
        case 'JokoUI':
            deps['jokoui'] = '^1.0.0';
            break;
        case 'DaisyUI':
            deps['daisyui'] = '^3.9.0';
            deps['tailwindcss'] = '^3.3.0';
            break;
        case 'Mantine':
            deps['@mantine/core'] = '^7.0.0';
            deps['@mantine/hooks'] = '^7.0.0';
            break;
        case 'Chakra UI':
            deps['@chakra-ui/react'] = '^2.8.0';
            deps['@emotion/react'] = '^11.11.0';
            deps['@emotion/styled'] = '^11.11.0';
            deps['framer-motion'] = '^10.12.0';
            break;
        case 'Shadcn/ui':
            deps['@radix-ui/primitives'] = '^1.0.0';
            deps['class-variance-authority'] = '^0.7.0';
            deps['clsx'] = '^2.0.0';
            deps['tailwindcss'] = '^3.3.0';
            break;
        case 'Material UI':
            deps['@mui/material'] = '^5.14.0';
            deps['@emotion/react'] = '^11.11.0';
            deps['@emotion/styled'] = '^11.11.0';
            break;
        case 'Ant Design':
            deps['antd'] = '^5.8.0';
            break;
        case 'None (Custom CSS)':
            // No additional dependencies
            break;
    }

    return deps;
}

/**
 * Get UI Framework dev dependencies based on selection
 */
function getUIDevDependencies(uiSystem: string): Record<string, string> {
    const devDeps: Record<string, string> = {};

    switch (uiSystem) {
        case 'Tailwind CSS':
        case 'DaisyUI': // DaisyUI uses Tailwind
            devDeps['tailwindcss'] = '^3.3.0';
            devDeps['postcss'] = '^8.4.0';
            devDeps['autoprefixer'] = '^10.4.0';
            break;
        case 'Bootstrap 5':
            devDeps['sass'] = '^1.66.0';
            devDeps['sass-loader'] = '^13.3.0';
            break;
        case 'Shadcn/ui':
            devDeps['tailwindcss'] = '^3.3.0';
            devDeps['postcss'] = '^8.4.0';
            devDeps['autoprefixer'] = '^10.4.0';
            break;
        case 'Mantine':
            devDeps['postcss'] = '^8.4.0';
            devDeps['postcss-preset-mantine'] = '^1.0.0';
            devDeps['postcss-simple-vars'] = '^7.0.0';
            break;
    }

    return devDeps;
}

/**
 * Get Template-specific dependencies
 */
function getTemplateDependencies(template: string): Record<string, string> {
    const deps: Record<string, string> = {};

    // Common dependencies for all templates (except Blank)
    if (template !== 'None (Blank)') {
        deps['axios'] = '^1.4.0';
        deps['zustand'] = '^4.4.0';
        deps['react-router-dom'] = '^6.14.0';
    }

    switch (template) {
        case 'Mobile App Starter':
            deps['react-native'] = '^0.72.0';
            deps['react-native-navigation'] = '^7.0.0';
            break;
        case 'Admin Dashboard':
            deps['recharts'] = '^2.8.0';
            deps['lucide-react'] = '^0.263.0';
            break;
        case 'Enterprise App Template':
            deps['lodash'] = '^4.17.21';
            deps['date-fns'] = '^2.30.0';
            deps['react-hook-form'] = '^7.45.0';
            break;
        case 'SaaS Template':
            deps['stripe'] = '^12.10.0';
            deps['date-fns'] = '^2.30.0';
            deps['react-hook-form'] = '^7.45.0';
            break;
        case 'Authentication Starter':
            deps['jsonwebtoken'] = '^9.0.2';
            deps['bcryptjs'] = '^2.4.3';
            break;
        case 'Ecommerce App':
            deps['lucide-react'] = '^0.263.0';
            deps['framer-motion'] = '^10.12.0';
            break;
        case 'Portfolio Template':
            deps['framer-motion'] = '^10.12.0';
            deps['lucide-react'] = '^0.263.0';
            break;
        case 'Personal Blog Template':
            deps['markdown-to-jsx'] = '^7.3.0';
            break;
        case 'CMS Template':
            deps['react-quill'] = '^2.0.0';
            deps['lucide-react'] = '^0.263.0';
            break;
    }

    return deps;
}

/**
 * Configure UI System files and configurations
 */
async function configureUISystem(projectDir: string, uiSystem: string): Promise<void> {
    switch (uiSystem) {
        case 'Tailwind CSS':
            await configureTailwind(projectDir);
            break;
        case 'Bootstrap 5':
            await configureBootstrap(projectDir);
            break;
        case 'JokoUI':
            await configureJokoUI(projectDir);
            break;
        case 'DaisyUI':
            await configureDaisyUI(projectDir);
            break;
        case 'Mantine':
            await configureMantine(projectDir);
            break;
        case 'Material UI':
            await configureMaterialUI(projectDir);
            break;
        case 'Ant Design':
            await configureAntDesign(projectDir);
            break;
        case 'Chakra UI':
            await configureChakraUI(projectDir);
            break;
        case 'Shadcn/ui':
            await configureShadcn(projectDir);
            break;
    }
}

/**
 * Configure Tailwind CSS
 */
async function configureTailwind(projectDir: string): Promise<void> {
    // Create tailwind.config.js
    await fs.writeFile(path.join(projectDir, 'tailwind.config.js'), `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./resources/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
`);

    // Create postcss.config.js
    await fs.writeFile(path.join(projectDir, 'postcss.config.js'), `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
`);

    // Create tailwind.css
    await fs.ensureDir(path.join(projectDir, 'resources/css'));
    await fs.writeFile(path.join(projectDir, 'resources/css/tailwind.css'), `@tailwind base;
@tailwind components;
@tailwind utilities;
`);

    // Create example component with Tailwind
    await fs.writeFile(path.join(projectDir, 'resources/views/WelcomeComponent.tsx'), `import React from 'react';

export default function WelcomeComponent() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600">
            <div className="text-center">
                <h1 className="text-5xl font-bold text-white mb-4">Welcome to EreactThohir</h1>
                <p className="text-xl text-gray-100 mb-8">With Tailwind CSS</p>
                <button className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition">
                    Get Started
                </button>
            </div>
        </div>
    );
}
`);
}

/**
 * Configure Bootstrap 5
 */
async function configureBootstrap(projectDir: string): Promise<void> {
    // Create custom bootstrap variations
    const customBootstrap = `
    :root {
        --bs-primary: #0d6efd;
        --bs-primary-rgb: 13, 110, 253;
        --bs-border-radius: 1rem;
        --bs-border-radius-lg: 2rem;
        --bs-font-sans-serif: 'Inter', system-ui, -apple-system, sans-serif;
    }
    .fw-black { font-weight: 900 !important; }
    .shadow-2xl { shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); }
    .bg-primary-soft { background-color: rgba(var(--bs-primary-rgb), 0.1) !important; }
    .rounded-4 { border-radius: 1.5rem !important; }
    .rounded-5 { border-radius: 2.5rem !important; }
    `;
    await fs.ensureDir(path.join(projectDir, 'resources/css'));
    await fs.appendFile(path.join(projectDir, 'resources/css/app.css'), customBootstrap);

    // Create example component with Bootstrap
    await fs.writeFile(path.join(projectDir, 'resources/views/WelcomeComponent.tsx'), `import React from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function WelcomeComponent() {
    return (
        <Container className="py-5">
            <Row className="justify-content-center text-center">
                <Col md={8}>
                    <h1 className="display-4 fw-black mb-4">Bootstrap x EreactThohir</h1>
                    <p className="lead mb-5">Institutional strength meets modern speed.</p>
                    <div className="d-flex gap-3 justify-content-center">
                        <Button variant="primary" size="lg" className="rounded-pill px-5">Get Started</Button>
                        <Button variant="outline-dark" size="lg" className="rounded-pill px-5">Learn More</Button>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}
`);
}

/**
 * Configure Material UI
 */
async function configureMaterialUI(projectDir: string): Promise<void> {
    // Create Theme Configuration
    await fs.ensureDir(path.join(projectDir, 'resources/theme'));
    await fs.writeFile(path.join(projectDir, 'resources/theme/index.ts'), `import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: { main: '#6366f1', contrastText: '#fff' },
    secondary: { main: '#f43f5e' },
    background: { default: '#f8fafc', paper: '#ffffff' },
    text: { primary: '#0f172a', secondary: '#64748b' }
  },
  typography: {
    fontFamily: '"Outfit", "Inter", sans-serif',
    h1: { fontWeight: 900 },
    h2: { fontWeight: 800 },
    button: { textTransform: 'none', fontWeight: 700 }
  },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 12, padding: '10px 24px' }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: { border: '1px solid #e2e8f0', boxShadow: 'none' }
      }
    }
  }
});
`);

    // Create example component with Material UI
    await fs.writeFile(path.join(projectDir, 'resources/views/WelcomeComponent.tsx'), `import React from 'react';
import { Box, Container, Typography, Button, Stack, Paper } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '../theme';

export default function WelcomeComponent() {
    return (
        <ThemeProvider theme={theme}>
            <Container maxWidth="md">
                <Box sx={{ py: 10, textAlign: 'center' }}>
                    <Typography variant="h2" sx={{ mb: 2 }}>Material UI Starter</Typography>
                    <Typography variant="h6" color="textSecondary" sx={{ mb: 4 }}>
                        Powered by institutional strength and Google's Design System.
                    </Typography>
                    <Stack direction="row" spacing={2} justifyContent="center">
                        <Button variant="contained" size="large">Documentation</Button>
                        <Button variant="outlined" size="large">Github</Button>
                    </Stack>
                </Box>
            </Container>
        </ThemeProvider>
    );
}
`);
}

/**
 * Configure Ant Design
 */
async function configureAntDesign(projectDir: string): Promise<void> {
    // Create example component with Ant Design
    await fs.writeFile(path.join(projectDir, 'resources/views/WelcomeComponent.tsx'), `import React from 'react';
import { Layout, Button, Space, Typography } from 'antd';
import 'antd/dist/reset.css';

const { Content } = Layout;
const { Title, Text } = Typography;

export default function WelcomeComponent() {
    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Content style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Space direction="vertical" align="center" style={{ textAlign: 'center' }}>
                    <Title level={1}>Welcome to EreactThohir</Title>
                    <Text type="secondary" style={{ fontSize: '18px' }}>
                        With Ant Design
                    </Text>
                    <Button type="primary" size="large">
                        Get Started
                    </Button>
                </Space>
            </Content>
        </Layout>
    );
}
`);
}

/**
 * Configure Chakra UI
 */
async function configureChakraUI(projectDir: string): Promise<void> {
    // Create example component with Chakra UI
    await fs.writeFile(path.join(projectDir, 'resources/views/WelcomeComponent.tsx'), `import React from 'react';
import { Box, Container, Heading, Text, Button, VStack, Center } from '@chakra-ui/react';

export default function WelcomeComponent() {
    return (
        <Center minH="100vh">
            <Container maxW="md">
                <VStack spacing={8} textAlign="center">
                    <Heading as="h1" size="2xl">
                        Welcome to EreactThohir
                    </Heading>
                    <Text fontSize="lg" color="gray.600">
                        With Chakra UI
                    </Text>
                    <Button colorScheme="blue" size="lg">
                        Get Started
                    </Button>
                </VStack>
            </Container>
        </Center>
    );
}
`);
}

/**
 * Configure Shadcn/ui
 */
async function configureShadcn(projectDir: string): Promise<void> {
    // Create shadcn.json config
    await fs.writeJSON(path.join(projectDir, 'components.json'), {
        "$schema": "https://ui.shadcn.com/schema.json",
        "style": "default",
        "rsc": true,
        "tsx": true,
        "tailwind": {
            "config": "tailwind.config.js",
            "css": "resources/css/globals.css",
            "baseColor": "slate"
        },
        "aliases": {
            "@/components": "./resources/components",
            "@/lib/utils": "./resources/lib/utils"
        }
    }, { spaces: 2 });

    // Create tailwind config for Shadcn
    await fs.writeFile(path.join(projectDir, 'tailwind.config.js'), `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./resources/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
`);

    // Create globals.css
    await fs.ensureDir(path.join(projectDir, 'resources/css'));
    await fs.writeFile(path.join(projectDir, 'resources/css/globals.css'), `@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 0 0% 3.6%;
    --card: 0 0% 100%;
    --card-foreground: 0 0% 3.6%;
    --popover: 0 0% 100%;
    --popover-foreground: 0 0% 3.6%;
    --muted: 0 0% 96.1%;
    --muted-foreground: 0 0% 45.1%;
    --accent: 0 0% 9.0%;
    --accent-foreground: 0 0% 100%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 0 0% 100%;
    --border: 0 0% 89.8%;
    --input: 0 0% 89.8%;
    --primary: 0 0% 9.0%;
    --primary-foreground: 0 0% 100%;
    --secondary: 0 0% 96.1%;
    --secondary-foreground: 0 0% 9.0%;
    --ring: 0 0% 3.6%;
  }
}
`);

    // Create example component
    await fs.writeFile(path.join(projectDir, 'resources/views/WelcomeComponent.tsx'), `import React from 'react';
import { Button } from '@/components/ui/button';

export default function WelcomeComponent() {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
                <h1 className="text-5xl font-bold mb-4">Welcome to EreactThohir</h1>
                <p className="text-xl text-muted-foreground mb-8">With Shadcn/ui</p>
                <Button size="lg">Get Started</Button>
            </div>
        </div>
    );
}
`);
}

/**
 * Configure JokoUI
 */
async function configureJokoUI(projectDir: string): Promise<void> {
    // Create jokoui.config.js
    await fs.writeFile(path.join(projectDir, 'jokoui.config.js'), `export default {
        theme: {
            primary: '#3b82f6',
            secondary: '#10b981',
        },
        components: {
            button: {
                borderRadius: '0.5rem',
            }
        }
    }
        `);

    // Create example component
    await fs.writeFile(path.join(projectDir, 'resources/views/WelcomeComponent.tsx'), `import React from 'react';
    import { Button, Card } from 'jokoui';

    export default function WelcomeComponent() {
        return (
            <div style= {{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', backgroundColor: '#f3f4f6' }
    }>
        <Card style={ { padding: '2rem', textAlign: 'center', maxWidth: '500px' } }>
            <h1 style={ { fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem' } }> Welcome to EreactThohir </h1>
                < p style = {{ color: '#666', marginBottom: '2rem' }
}> With JokoUI </p>
    < Button variant = "primary" size = "lg" > Get Started </Button>
        </Card>
        </div>
    );
}
`);
}

/**
 * Configure DaisyUI
 */
async function configureDaisyUI(projectDir: string): Promise<void> {
    // Configure Tailwind + DaisyUI
    await fs.writeFile(path.join(projectDir, 'tailwind.config.js'), `/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./resources/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {},
    },
    plugins: [require("daisyui")],
    daisyui: {
        themes: ["light", "dark", "cupcake"],
    },
}
    `);

    // Create postcss.config.js
    await fs.writeFile(path.join(projectDir, 'postcss.config.js'), `export default {
    plugins: {
        tailwindcss: {},
        autoprefixer: {},
    },
}
    `);

    // Create tailwind.css
    await fs.ensureDir(path.join(projectDir, 'resources/css'));
    await fs.writeFile(path.join(projectDir, 'resources/css/tailwind.css'), `@tailwind base;
@tailwind components;
@tailwind utilities;
`);

    // Create example component
    await fs.writeFile(path.join(projectDir, 'resources/views/WelcomeComponent.tsx'), `import React from 'react';

export default function WelcomeComponent() {
    return (
        <div className= "hero min-h-screen bg-base-200" >
        <div className="hero-content text-center" >
            <div className="max-w-md" >
                <h1 className="text-5xl font-bold" > Welcome to EreactThohir </h1>
                    < p className = "py-6" > With DaisyUI + Tailwind CSS </p>
                        < button className = "btn btn-primary" > Get Started </button>
                            < button className = "btn btn-secondary ml-2" > Documentation </button>
                                </div>
                                </div>
                                </div>
    );
}
`);
}

/**
 * Configure Mantine
 */
async function configureMantine(projectDir: string): Promise<void> {
    // Create postcss.config.js for Mantine
    await fs.writeFile(path.join(projectDir, 'postcss.config.cjs'), `module.exports = {
    plugins: {
        'postcss-preset-mantine': {},
        'postcss-simple-vars': {
            variables: {
                'mantine-breakpoint-xs': '36em',
                'mantine-breakpoint-sm': '48em',
                'mantine-breakpoint-md': '62em',
                'mantine-breakpoint-lg': '75em',
                'mantine-breakpoint-xl': '88em',
            },
        },
    },
};
`);

    // Create Example Component
    await fs.writeFile(path.join(projectDir, 'resources/views/WelcomeComponent.tsx'), `import React from 'react';
import { Container, Title, Text, Button, Group } from '@mantine/core';

export default function WelcomeComponent() {
    return (
        <Container size= "md" h = "100vh" style = {{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }
}>
    <Title order={ 1 } mb = "md" > Welcome to EreactThohir </Title>
        < Text size = "lg" c = "dimmed" mb = "xl" > With Mantine UI </Text>

            < Group >
            <Button size="lg" variant = "filled" color = "blue" > Get Started </Button>
                < Button size = "lg" variant = "light" color = "blue" > Learn More </Button>
                    </Group>
                    </Container>
    );
}
`);

    // Note: User needs to wrap App with MantineProvider, but we can't easily edit App.tsx/index.tsx here without parsing it.
    // We assume the user or the template generator handles the provider wrapping if possible, 
    // or we could overwrite the main entry point if we knew where it was.
    // For now, we'll just provide the component.
}

/**
 * Generate Welcome Page Content based on UI System
 */
function generateWelcomePage(uiSystem: string, name: string): string {
    if (uiSystem === 'JokoUI') return generateJokoWelcome(name);
    if (uiSystem === 'Tailwind CSS' || uiSystem === 'DaisyUI' || uiSystem === 'Shadcn/ui') return generateTailwindWelcome(name);
    if (uiSystem === 'Bootstrap 5') return generateBootstrapWelcome(name);
    if (uiSystem === 'Material UI') return generateMaterialWelcome(name);
    return generateRiceWelcome(name);
}

function generateBootstrapWelcome(name: string): string {
    return `import React from 'react';
import { Container, Row, Col, Button, Nav, Navbar } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Welcome() {
    return (
        <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
            <Navbar bg="white" expand="lg" className="py-4 shadow-sm">
                <Container>
                    <Navbar.Brand href="#" className="fw-black fs-3">
                        <span className="text-primary">E</span>reactThohir
                    </Navbar.Brand>
                    <Navbar.Toggle />
                    <Navbar.Collapse className="justify-content-end">
                        <Nav className="gap-4 fw-bold">
                            <Nav.Link href="#docs">Docs</Nav.Link>
                            <Nav.Link href="#showcase">Showcase</Nav.Link>
                            <Button variant="dark" className="rounded-pill px-4">Get Started</Button>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <Container className="pt-5 mt-5">
                <Row className="align-items-center">
                    <Col lg={6} className="text-center text-lg-start">
                        <div className="badge bg-primary-soft text-primary px-3 py-2 rounded-pill mb-4" style={{ backgroundColor: '#e0f2fe' }}>
                             NEW VERSION 1.3.5 AVAILABLE
                        </div>
                        <h1 className="display-1 fw-black mb-4 tracking-tight" style={{ lineHeight: 0.9 }}>
                            Modernize <br/>
                            <span className="text-primary">Web Apps.</span>
                        </h1>
                        <p className="lead text-secondary mb-5 fs-4">
                            The ultimate Bootstrap 5 starter for EReactThohir. 
                            Clean, fast, and extraordinarily powerful.
                        </p>
                        <div className="d-flex gap-3 justify-content-center justify-content-lg-start">
                            <Button variant="primary" size="lg" className="px-5 py-3 rounded-4 shadow-lg fw-bold">
                                Start Building
                            </Button>
                            <Button variant="outline-dark" size="lg" className="px-5 py-3 rounded-4 fw-bold">
                                Examples
                            </Button>
                        </div>
                    </Col>
                    <Col lg={6} className="mt-5 mt-lg-0">
                        <div className="bg-white p-5 rounded-5 shadow-2xl border">
                             <div className="row g-4">
                                 <div className="col-6">
                                     <div className="p-4 bg-light rounded-4 text-center">
                                         <span className="fs-1 d-block mb-2">⚡</span>
                                         <span className="fw-bold">Fast SSR</span>
                                     </div>
                                 </div>
                                 <div className="col-6">
                                     <div className="p-4 bg-light rounded-4 text-center">
                                         <span className="fs-1 d-block mb-2">🛡️</span>
                                         <span className="fw-bold">Secure</span>
                                     </div>
                                 </div>
                                 <div className="col-6">
                                     <div className="p-4 bg-light rounded-4 text-center">
                                         <span className="fs-1 d-block mb-2">📦</span>
                                         <span className="fw-bold">Modular</span>
                                     </div>
                                 </div>
                                 <div className="col-6">
                                     <div className="p-4 bg-light rounded-4 text-center">
                                         <span className="fs-1 d-block mb-2">🎨</span>
                                         <span className="fw-bold">Customizable</span>
                                     </div>
                                 </div>
                             </div>
                        </div>
                    </Col>
                </Row>
            </Container>
            
            <footer className="py-5 mt-5 border-top">
                <Container className="text-center">
                    <p className="text-secondary small">© 2024 EReactThohir • Integrated with Bootstrap 5 Ecosystem</p>
                </Container>
            </footer>
        </div>
    );
}
`;
}

function generateMaterialWelcome(name: string): string {
    return `import React from 'react';
import { 
    Box, 
    Container, 
    Typography, 
    Button, 
    Stack, 
    AppBar, 
    Toolbar, 
    createTheme, 
    ThemeProvider,
    CssBaseline,
    Paper,
    Grid
} from '@mui/material';

const theme = createTheme({
  palette: {
    primary: { main: '#6366f1' },
    secondary: { main: '#ec4899' },
    background: { default: '#f1f5f9' }
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
    h1: { fontWeight: 900, letterSpacing: '-0.05em' },
  },
  shape: { borderRadius: 16 }
});

export default function Welcome() {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
                <AppBar position="static" color="transparent" elevation={0} sx={{ py: 2 }}>
                    <Container>
                        <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <Box sx={{ width: 40, height: 40, bgcolor: 'primary.main', borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'black', fontSize: 20 }}>M</Box>
                                <Typography variant="h6" sx={{ fontWeight: 900, color: 'text.primary' }}>EReactMUI</Typography>
                            </Box>
                            <Stack direction="row" spacing={4} sx={{ display: { xs: 'none', md: 'flex' } }}>
                                <Button color="inherit" sx={{ fontWeight: 700 }}>Docs</Button>
                                <Button color="inherit" sx={{ fontWeight: 700 }}>Marketplace</Button>
                                <Button variant="contained" sx={{ fontWeight: 900, px: 4 }}>Login</Button>
                            </Stack>
                        </Toolbar>
                    </Container>
                </AppBar>

                <Container sx={{ pt: 15, pb: 10 }}>
                    <Grid container spacing={8} alignItems="center">
                        <Grid item xs={12} lg={7}>
                            <Box sx={{ display: 'inline-block', px: 2, py: 0.5, bgcolor: 'secondary.main', color: 'white', borderRadius: 2, fontWeight: 900, fontSize: '0.75rem', mb: 3 }}>
                                ENTERPRISE READY
                            </Box>
                            <Typography variant="h1" sx={{ fontSize: { xs: '3.5rem', md: '5.5rem' }, mb: 4, lineHeight: 1 }}>
                                Premium <Typography component="span" variant="inherit" color="primary">Material</Typography> Experience.
                            </Typography>
                            <Typography variant="h5" color="textSecondary" sx={{ mb: 6, lineHeight: 1.6 }}>
                                Combine Google's Material Design 3 with EreactThohir's architecture. 
                                Build flawless interfaces with institutional strength.
                            </Typography>
                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
                                <Button variant="contained" size="large" sx={{ py: 2, px: 5, fontSize: '1.1rem', fontWeight: 900 }}>
                                    Launch App
                                </Button>
                                <Button variant="outlined" size="large" sx={{ py: 2, px: 5, fontSize: '1.1rem', fontWeight: 900 }}>
                                    View Library
                                </Button>
                            </Stack>
                        </Grid>
                        <Grid item xs={12} lg={5}>
                            <Paper elevation={0} sx={{ p: 4, bgcolor: 'white', border: '1px solid #e2e8f0', borderRadius: 8 }}>
                                <Stack spacing={3}>
                                     <Box sx={{ p: 2, borderRadius: 4, bgcolor: '#f8fafc', display: 'flex', alignItems: 'center', gap: 2 }}>
                                         <Box sx={{ fontSize: 32 }}>💎</Box>
                                         <Box>
                                             <Typography sx={{ fontWeight: 900 }}>High Quality</Typography>
                                             <Typography variant="body2" color="textSecondary">Premium assets included</Typography>
                                         </Box>
                                     </Box>
                                     <Box sx={{ p: 2, borderRadius: 4, bgcolor: '#f8fafc', display: 'flex', alignItems: 'center', gap: 2 }}>
                                         <Box sx={{ fontSize: 32 }}>🚀</Box>
                                         <Box>
                                             <Typography sx={{ fontWeight: 900 }}>Fast Delivery</Typography>
                                             <Typography variant="body2" color="textSecondary">Optimized build pipeline</Typography>
                                         </Box>
                                     </Box>
                                </Stack>
                            </Paper>
                        </Grid>
                    </Grid>
                </Container>
                
                <Box component="footer" sx={{ py: 8, textAlign: 'center', borderTop: '1px solid #e2e8f0' }}>
                    <Typography color="textSecondary" variant="body2">
                        © 2024 EReactThohir Framework • Designed for Performance
                    </Typography>
                </Box>
            </Box>
        </ThemeProvider>
    );
}
`;
}

function generateRiceWelcome(name: string): string {
    return `import React from 'react';

export default function Welcome() {
    return (
        <div className="rice-min-h-screen rice-bg-white rice-relative rice-overflow-hidden rice-font-sans">
            {/* Background Decorative Elements */}
            <div className="rice-absolute rice-inset-0 rice-pointer-events-none">
                <div className="rice-absolute rice-top-[-10%] rice-right-[-5%] rice-w-[500px] rice-h-[500px] rice-bg-primary-500 rice-opacity-10 rice-blur-[120px] rice-rounded-full" />
                <div className="rice-absolute rice-bottom-[-10%] rice-left-[-5%] rice-w-[600px] rice-h-[600px] rice-bg-accent-500 rice-opacity-10 rice-blur-[120px] rice-rounded-full" />
            </div>

            {/* Navigation */}
            <nav className="rice-relative rice-z-10 rice-flex rice-items-center rice-justify-between rice-px-8 rice-py-6 rice-max-w-7xl rice-mx-auto">
                <div className="rice-flex rice-items-center rice-gap-3">
                    <div className="rice-w-12 rice-h-12 rice-bg-secondary-900 rice-rounded-2xl rice-flex rice-items-center rice-justify-center rice-text-white rice-font-black rice-text-2xl rice-shadow-lg">E</div>
                    <span className="rice-text-2xl rice-font-black rice-tracking-tighter rice-text-secondary-900">EreactThohir</span>
                </div>
                <div className="rice-hidden rice-md-flex rice-items-center rice-gap-10 rice-text-sm rice-font-bold rice-text-secondary-600">
                    <a href="#" className="rice-hover-text-secondary-900 rice-transition-all">Documentation</a>
                    <a href="#" className="rice-hover-text-secondary-900 rice-transition-all">Showcase</a>
                    <a href="#" className="rice-hover-text-secondary-900 rice-transition-all">Community</a>
                    <a href="/auth/login" className="rice-px-6 rice-py-2.5 rice-bg-secondary-900 rice-text-white rice-rounded-full rice-hover-scale-105 rice-shadow-primary rice-transition-all">Get Started</a>
                </div>
            </nav>

            <main className="rice-relative rice-z-10 rice-max-w-7xl rice-mx-auto rice-px-8 rice-pt-32 rice-pb-40">
                <div className="rice-text-center rice-max-w-5xl rice-mx-auto">
                    <div className="rice-inline-flex rice-items-center rice-gap-2 rice-px-5 rice-py-2.5 rice-bg-secondary-100 rice-rounded-full rice-mb-10 rice-animate-pulse rice-border rice-border-secondary-200">
                        <span className="rice-w-2.5 rice-h-2.5 rice-bg-primary-500 rice-rounded-full" />
                        <span className="rice-text-xs rice-font-black rice-text-secondary-900 rice-uppercase rice-tracking-widest">Framework v1.3.5 "Evolution" is here</span>
                    </div>
                    
                    <h1 className="rice-text-7xl rice-md-text-9xl rice-font-black rice-tracking-tighter rice-mb-10 rice-leading-[0.9]">
                        The New Standard of <br/>
                        <span className="rice-gradient-primary rice-bg-clip-text rice-text-transparent">Modern Web</span> Apps.
                    </h1>
                    
                    <p className="rice-text-xl rice-md-text-2xl rice-text-secondary-600 rice-mb-16 rice-leading-relaxed rice-max-w-3xl rice-mx-auto">
                        Experience the raw speed of React combined with the solid architecture of EReactThohir. 
                        Production-ready components, built with high-end Rice UI aesthetics.
                    </p>

                    <div className="rice-flex rice-flex-wrap rice-justify-center rice-gap-6">
                        <a href="/auth/register" className="rice-px-12 rice-py-6 rice-bg-secondary-900 rice-text-white rice-text-xl rice-font-black rice-rounded-3xl rice-shadow-2xl rice-hover-lift rice-transition-all rice-duration-300">
                            Build Your Vision
                        </a>
                        <a href="#" className="rice-px-12 rice-py-6 rice-bg-white rice-border rice-text-secondary-900 rice-text-xl rice-font-black rice-rounded-3xl rice-hover-bg-secondary-50 rice-transition-all rice-duration-300">
                            Watch Demo
                        </a>
                    </div>
                </div>

                {/* Feature Grid with Glassmorphism */}
                <div className="rice-mt-48 rice-grid rice-grid-cols-1 rice-md-grid-cols-3 rice-gap-10">
                    <FeatureCard 
                        title="MVC Redefined" 
                        desc="Full-featured routing, controllers, and models inspired by Laravel's elegance but built for JS/TS."
                        icon="🏛️"
                    />
                    <FeatureCard 
                        title="Speed of Light" 
                        desc="Advanced SSR with partial hydration ensures your lighthouse score stays at 100% effortlessly."
                        icon="⚡"
                    />
                    <FeatureCard 
                        title="Rice UI Design" 
                        desc="Premade high-end components with glassmorphism and vibrance. Just drop and go."
                        icon="🎨"
                    />
                </div>
            </main>

            <footer className="rice-py-20 rice-border-t rice-bg-secondary-50">
                <div className="rice-max-w-7xl rice-mx-auto rice-px-8 rice-flex rice-flex-col rice-md-flex-row rice-items-center rice-justify-between rice-gap-10">
                    <div>
                        <p className="rice-text-secondary-900 rice-font-black rice-text-xl rice-mb-2">EreactThohir</p>
                        <p className="rice-text-secondary-500 rice-text-sm">© 2024. Crafted for excellence by Dhafa Nazula Permadi.</p>
                    </div>
                    <div className="rice-flex rice-gap-8 rice-text-secondary-400 rice-text-2xl">
                        <a href="#" className="rice-hover-text-secondary-900 rice-transition-all">𝕏</a>
                        <a href="#" className="rice-hover-text-secondary-900 rice-transition-all">GitHub</a>
                        <a href="#" className="rice-hover-text-secondary-900 rice-transition-all">LinkedIn</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}

function FeatureCard({ title, desc, icon }: any) {
    return (
        <div className="rice-p-10 rice-bg-white rice-border rice-rounded-[40px] rice-hover-shadow-2xl rice-hover-lift rice-transition-all rice-duration-500 rice-group">
            <div className="rice-w-16 rice-h-16 rice-bg-primary-500 rice-bg-opacity-10 rice-rounded-3xl rice-flex rice-items-center rice-justify-center rice-mb-8 rice-text-3xl rice-group-hover-scale-110 rice-transition-all">
                {icon}
            </div>
            <h3 className="rice-text-2xl rice-font-black rice-mb-4 rice-text-secondary-900">{title}</h3>
            <p className="rice-text-secondary-500 rice-leading-relaxed rice-font-medium">{desc}</p>
        </div>
    );
}
`;
}

function generateTailwindWelcome(name: string): string {
    return `import React from 'react';

export default function Welcome() {
    return (
        <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-500 selection:text-white">
            {/* Tailwind Mesh Gradient */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
                <div className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] bg-blue-100 rounded-full blur-[120px] opacity-60"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[800px] h-[800px] bg-indigo-100 rounded-full blur-[120px] opacity-60"></div>
            </div>

            <nav className="flex items-center justify-between p-8 max-w-7xl mx-auto">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg ring-4 ring-blue-50">E</div>
                    <span className="text-xl font-bold tracking-tight text-slate-900">EreactThohir</span>
                </div>
                <div className="hidden md:flex items-center gap-8">
                    <a href="#" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">Documentation</a>
                    <a href="#" className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">Components</a>
                    <a href="/login" className="px-5 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-full hover:bg-blue-600 hover:scale-105 transition-all shadow-xl shadow-slate-200">
                        Launch Project
                    </a>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-8 pt-24 pb-32">
                <div className="max-w-3xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full mb-8 border border-blue-100">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                        </span>
                        <span className="text-xs font-bold uppercase tracking-wider">Tailwind Support Active</span>
                    </div>

                    <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tight leading-[1.1] mb-8">
                        The Developer's <span className="text-blue-600">Superpower.</span>
                    </h1>

                    <p className="text-xl md:text-2xl text-slate-600 leading-relaxed mb-12">
                        Build your next big idea with EReactThohir and the massive Tailwind CSS ecosystem. 
                        No limits, just raw creative potential.
                    </p>

                    <div className="flex flex-wrap gap-4">
                        <button className="px-8 py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-2xl shadow-blue-200 hover:bg-blue-700 hover:-translate-y-1 transition-all">
                            Start Coding Now
                        </button>
                        <button className="px-8 py-4 bg-white border border-slate-200 text-slate-900 font-bold rounded-2xl hover:bg-slate-50 transition-all">
                            View Examples
                        </button>
                    </div>
                </div>

                <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <FeatureCard title="Responsive" desc="Every pixel optimized for mobile, tablet, and desktop out of the box." />
                    <FeatureCard title="Tailwind Ready" desc="Fully integrated with JIT engine and your custom design tokens." />
                    <FeatureCard title="Type Safe" desc="End-to-end type safety for a predictable development experience." />
                </div>
            </main>
        </div>
    );
}

function FeatureCard({ title, desc }: any) {
    return (
        <div className="p-8 bg-white/50 backdrop-blur-xl border border-white rounded-[32px] hover:border-blue-200 hover:shadow-2xl transition-all group">
            <h3 className="text-xl font-bold mb-3 text-slate-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{title}</h3>
            <p className="text-slate-600 leading-relaxed">{desc}</p>
        </div>
    );
}
`;
}

function generateJokoWelcome(name: string): string {
    return `import React from 'react';

export default function Welcome() {
    return (
        <div className="joko-flex joko-flex-col joko-min-h-screen joko-bg-secondary-50">
            {/* Formal Header */}
            <header className="joko-p-8 joko-bg-white joko-border-b joko-flex joko-items-center joko-justify-between">
                <div className="joko-flex joko-items-center joko-gap-4">
                    <div className="joko-w-10 joko-h-10 joko-bg-primary-600 joko-rounded-md joko-flex joko-items-center joko-justify-center joko-text-white joko-font-bold">JK</div>
                    <span className="joko-text-2xl joko-font-bold joko-tracking-tight joko-text-primary-900">JokoUI + EReactThohir</span>
                </div>
                <nav className="joko-flex joko-gap-8 joko-text-sm joko-font-bold">
                    <a href="#" className="joko-text-secondary-600 hover:joko-text-primary-600">PANDUAN</a>
                    <a href="#" className="joko-text-secondary-600 hover:joko-text-primary-600">KOMPONEN</a>
                    <Button variant="primary" style={{ padding: '0.5rem 1rem' }}>MEMULAI</Button>
                </nav>
            </header>

            <main className="joko-flex-1 joko-flex joko-items-center joko-justify-center joko-p-8">
                <div className="joko-max-w-4xl joko-w-full">
                    <div className="joko-card joko-text-center">
                        <span className="joko-text-primary-600 joko-font-bold joko-tracking-[0.2em] joko-text-xs joko-mb-6 joko-block">VERSI TERBARU v1.0.0</span>
                        <h1 className="joko-text-6xl joko-font-bold joko-mb-8 joko-text-secondary-900 joko-leading-tight">
                            Membangun Aplikasi dengan <br/>
                            <span className="joko-text-primary-600">Kepercayaan</span> dan <span className="joko-text-accent-600">Kekuatan.</span>
                        </h1>
                        <p className="joko-text-xl joko-text-secondary-600 joko-mb-12 joko-max-w-2xl joko-mx-auto">
                            Framework EReactThohir dengan JokoUI. Solusi formal untuk kebutuhan enterprise tingkat tinggi. 
                            Handal, Sederhana, dan Berwibawa.
                        </p>
                        
                        <div className="joko-flex joko-justify-center joko-gap-6">
                            <button className="joko-btn joko-btn-primary joko-text-lg joko-px-10">
                                Buat Proyek Baru
                            </button>
                            <button className="joko-btn joko-bg-white joko-border joko-border-secondary-300 joko-text-secondary-900 joko-text-lg joko-px-10">
                                Dokumentasi
                            </button>
                        </div>
                    </div>

                    <div className="joko-grid joko-grid-cols-3 joko-gap-8 joko-mt-12">
                        <StatCard label="KEANDALAN" value="100%" />
                        <StatCard label="KECEPATAN" value="0.2s" />
                        <StatCard label="KEAMANAN" value="EXTRA" />
                    </div>
                </div>
            </main>

            <footer className="joko-p-12 joko-bg-primary-900 joko-text-white joko-text-center">
                <p className="joko-text-primary-300 joko-text-sm joko-font-bold joko-tracking-widest">ERECTTHOHIR ECOSYSTEM • 2024</p>
            </footer>
        </div>
    );
}

function StatCard({ label, value }: any) {
    return (
        <div className="joko-bg-white joko-p-6 joko-border joko-border-secondary-200 joko-rounded-lg joko-text-center">
            <p className="joko-text-xs joko-font-bold joko-text-secondary-400 joko-mb-2 joko-tracking-tighter">{label}</p>
            <p className="joko-text-3xl joko-font-bold joko-text-primary-600">{value}</p>
        </div>
    );
}

function Button({ children, variant, style }: any) {
    const base = "joko-btn";
    const variantCls = variant === 'primary' ? 'joko-btn-primary' : '';
    return <button className={\`\${base} \${variantCls}\`} style={style}>{children}</button>;
}
`;
}

function getUIHelper(uiSystem: string) {
    const isRice = uiSystem === 'Rice UI (default, official)';
    const isTailwind = uiSystem === 'Tailwind CSS' || uiSystem === 'DaisyUI' || uiSystem === 'Shadcn/ui';
    const isJoko = uiSystem === 'JokoUI';
    const isBootstrap = uiSystem === 'Bootstrap 5';
    const isMaterial = uiSystem === 'Material UI';
    const isMantine = uiSystem === 'Mantine';
    const isChakra = uiSystem === 'Chakra UI';

    return {
        cls: (rice: string, tailwind: string, joko: string, bootstrap: string = '', material: string = '') => {
            if (isRice) return rice;
            if (isTailwind) return tailwind;
            if (isJoko) return joko;
            if (isBootstrap && bootstrap) return bootstrap;
            if (isMaterial && material) return material;
            return tailwind;
        },
        mode: () => {
            if (isRice) return 'rice';
            if (isTailwind) return 'tailwind';
            if (isJoko) return 'joko';
            if (isBootstrap) return 'bootstrap';
            if (isMaterial) return 'material';
            if (isMantine) return 'mantine';
            if (isChakra) return 'chakra';
            return 'none';
        }
    };
}
