import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';
import ora from 'ora';

async function generateFile(type: string, name: string, template: string, folder: string) {
    const spinner = ora(`Creating ${type}: ${name}...`).start();
    const projectRoot = process.cwd();

    // Check if we are inside an EreactThohir project
    if (!fs.existsSync(path.join(projectRoot, 'ereact.json'))) {
        spinner.fail(chalk.red('Error: You are not in an EreactThohir project root.'));
        return;
    }

    const targetDir = path.join(projectRoot, folder);
    const targetPath = path.join(targetDir, `${name}.ts`);

    if (fs.existsSync(targetPath)) {
        spinner.fail(chalk.yellow(`Warning: ${type} ${name} already exists.`));
        return;
    }

    await fs.ensureDir(targetDir);
    await fs.writeFile(targetPath, template);

    spinner.succeed(chalk.green(`${type} created: ${path.relative(projectRoot, targetPath)}`));
}

/**
 * Enhanced Controller Generator
 */
export async function makeController(name: string, options: any = {}) {
    let methods = '';

    if (options.resource) {
        methods = `
    /**
     * Display a listing of the resource.
     */
    public async index(req: any, res: any) {
        return res.json({ message: 'Index of ${name}' });
    }

    /**
     * Show the form for creating a new resource.
     */
    public async create(req: any, res: any) {
        return res.json({ message: 'Create form for ${name}' });
    }

    /**
     * Store a newly created resource in storage.
     */
    public async store(req: any, res: any) {
        return res.send('Stored ${name}');
    }

    /**
     * Display the specified resource.
     */
    public async show(req: any, res: any) {
        return res.json({ message: 'Showing ${name} ID: ' + req.params.id });
    }

    /**
     * Show the form for editing the specified resource.
     */
    public async edit(req: any, res: any) {
        return res.json({ message: 'Editing ${name} ID: ' + req.params.id });
    }

    /**
     * Update the specified resource in storage.
     */
    public async update(req: any, res: any) {
        return res.send('Updated ${name}');
    }

    /**
     * Remove the specified resource from storage.
     */
    public async destroy(req: any, res: any) {
        return res.send('Deleted ${name}');
    }
`;
    } else if (options.api) {
        methods = `
    public async index(req: any, res: any) {
        return res.json({ data: [] });
    }

    public async store(req: any, res: any) {
        return res.status(201).json({ message: 'Created' });
    }

    public async show(req: any, res: any) {
        return res.json({ data: {} });
    }

    public async update(req: any, res: any) {
        return res.json({ message: 'Updated' });
    }

    public async destroy(req: any, res: any) {
        return res.status(204).send();
    }
`;
    }

    const template = `import { Controller } from '@ereactthohir/core';
${options.model ? `import ${options.model} from '../Models/${options.model}';` : ''}

/**
 * ${name} Controller
 */
export default class ${name} extends Controller {
${methods || `    public async index(req: any, res: any) {
        return res.json({ message: 'Hello from ${name} Controller' });
    }`}
}
`;
    await generateFile('Controller', name, template, 'app/Controllers');

    if (options.model && !fs.existsSync(path.join(process.cwd(), 'app/Models', `${options.model}.ts`))) {
        await makeModel(options.model);
    }
}

/**
 * Enhanced Model Generator
 */
export async function makeModel(name: string, options: any = {}) {
    const template = `import { Model } from '@ereactthohir/core';

/**
 * ${name} Model
 */
export default class ${name} extends Model {
    static table = '${name.toLowerCase()}s';
    protected fillable = [];
}
`;
    await generateFile('Model', name, template, 'app/Models');

    if (options.migration) {
        await makeMigration(`create_${name.toLowerCase()}s_table`);
    }
    if (options.controller) {
        await makeController(`${name}Controller`, { model: name });
    }
    if (options.factory) {
        await makeFactory(name);
    }
}

export async function makeFactory(name: string) {
    const template = `import { Factory } from '@ereactthohir/core';

export default class ${name}Factory extends Factory {
    public definition(): Record<string, any> {
        return {
            // name: this.faker.person.fullName(),
            // email: this.faker.internet.email(),
        };
    }
}
`;
    await generateFile('Factory', `${name}Factory`, template, 'database/factories');
}

export async function makeException(name: string) {
    const template = `export default class ${name} extends Error {
    constructor(message: string, public status: number = 500) {
        super(message);
        this.name = '${name}';
    }
}
`;
    await generateFile('Exception', name, template, 'app/Exceptions');
}

export async function makeValidator(name: string) {
    const template = `export default class ${name} {
    public rules() {
        return {
            // 'title': 'required|min:5',
        };
    }

    public messages() {
        return {
            // 'title.required': 'Judul wajib diisi',
        };
    }
}
`;
    await generateFile('Validator', name, template, 'app/Validators');
}

export async function makeService(name: string) {
    const template = `import { Service } from '@ereactthohir/core';

/**
 * ${name} Service
 */
export default class ${name} extends Service {
    public async execute() {
        // Business logic here
    }
}
`;
    await generateFile('Service', name, template, 'app/Services');
}

export async function makeScreen(name: string) {
    const template = `import React from 'react';
import { View, Text } from 'react-native';

export default function ${name}() {
    return (
        <View className="flex-1 items-center justify-center">
            <Text>${name} Screen</Text>
        </View>
    );
}
`;
    await generateFile('Screen', name, template, 'resources/views');
}

export async function makeComponent(name: string) {
    const template = `import React from 'react';

export const ${name} = () => {
    return (
        <div>${name} Component</div>
    );
};

export default ${name};
`;
    await generateFile('Component', name, template, 'resources/components');
}

export async function makeMigration(name: string) {
    const timestamp = new Date().getTime();
    const template = `import { Schema } from '@ereactthohir/core';

export default class ${name} {
    public async up() {
        await Schema.create('${name.split('_')[1] || 'table'}', (table) => {
            table.increments('id');
            table.timestamps();
        });
    }

    public async down() {
        await Schema.dropIfExists('${name.split('_')[1] || 'table'}');
    }
}
`;
    await generateFile('Migration', `${timestamp}_${name}`, template, 'database/migrations');
}

export async function makeSeeder(name: string) {
    const template = `import { Seeder } from '@ereactthohir/core';

export default class ${name} extends Seeder {
    public async run() {
        // Seed logic
    }
}
`;
    await generateFile('Seeder', name, template, 'database/seeders');
}

export async function makeProvider(name: string) {
    const template = `import { ServiceProvider } from '@ereactthohir/core';

export default class ${name} extends ServiceProvider {
    public register() {}
    public boot() {}
}
`;
    await generateFile('Provider', name, template, 'app/Providers');
}

export async function makeMiddleware(name: string) {
    const template = `export default class ${name} {
    public async handle(req: any, res: any, next: any) {
        return await next();
    }
}
`;
    await generateFile('Middleware', name, template, 'app/Middleware');
}

export async function makeJob(name: string) {
    const template = `export default class ${name} {
    public async handle() {
        // Background job logic
    }
}
`;
    await generateFile('Job', name, template, 'app/Jobs');
}

export async function makePolicy(name: string) {
    const template = `export default class ${name} {
    public view() { return true; }
}
`;
    await generateFile('Policy', name, template, 'app/Policies');
}

export async function makeTest(name: string) {
    const template = `import { describe, it, expect } from 'vitest';

describe('${name}', () => {
    it('works', () => {
        expect(true).toBe(true);
    });
});
`;
    await generateFile('Test', name, template, 'tests');
}

export async function makeMail(name: string) {
    const template = `export default class ${name} {
    public build() {
        return { subject: '${name}', view: 'emails.${name.toLowerCase()}' };
    }
}
`;
    await generateFile('Mail', name, template, 'app/Mail');
}

export async function makeNotification(name: string) {
    const template = `export default class ${name} {
    public via() { return ['mail']; }
}
`;
    await generateFile('Notification', name, template, 'app/Notifications');
}

export async function makeCommand(name: string) {
    const template = `import { Command } from '@ereactthohir/core';

export default class ${name} extends Command {
    static signature = '${name.toLowerCase()}';
    public async handle() {
        this.info('Running ${name}');
    }
}
`;
    await generateFile('Command', name, template, 'app/Commands');
}

export async function makeResource(name: string) {
    const template = `import { Resource } from '@ereactthohir/core';

export default class ${name} extends Resource {
    public toArray() {
        return { ...this.resource };
    }
}
`;
    await generateFile('Resource', name, template, 'app/Resources');
}

export async function makeEvent(name: string) {
    const template = `export default class ${name} {
    constructor(public data: any) {}
}
`;
    await generateFile('Event', name, template, 'app/Events');
}

export async function makeListener(name: string) {
    const template = `export default class ${name} {
    public async handle(event: any) {
        // Handle event logic
    }
}
`;
    await generateFile('Listener', name, template, 'app/Listeners');
}

/**
 * Create a full CRUD structure (Model, Migration, Controller, Factory, Page)
 */
export async function makeCRUD(name: string) {
    const spinner = ora(chalk.cyan(`Building Powerful CRUD for ${name}...`)).start();

    try {
        // 1. Create Model with Migration, Controller, and Factory
        await makeModel(name, {
            migration: true,
            controller: true,
            factory: true
        });

        // 2. Create a standard Resource Page
        const pageTemplate = `import React from 'react';

export default function ${name}Page() {
    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-black">${name} Management</h1>
                <button className="px-5 py-2.5 bg-slate-900 text-white rounded-xl font-bold shadow-lg hover:scale-105 transition-all">
                    + Create ${name}
                </button>
            </div>
            
            <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                            <th className="px-6 py-4 font-bold text-slate-500 text-xs uppercase tracking-wider">ID</th>
                            <th className="px-6 py-4 font-bold text-slate-500 text-xs uppercase tracking-wider">NAME</th>
                            <th className="px-6 py-4 font-bold text-slate-500 text-xs uppercase tracking-wider">STATUS</th>
                            <th className="px-6 py-4 font-bold text-slate-500 text-xs uppercase tracking-wider">ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        <tr>
                            <td className="px-6 py-4 font-medium">#1</td>
                            <td className="px-6 py-4 font-medium">Sample ${name}</td>
                            <td className="px-6 py-4">
                                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-black tracking-wide">ACTIVE</span>
                            </td>
                            <td className="px-6 py-4 flex gap-3">
                                <button className="text-slate-400 hover:text-slate-900 transition-colors">Edit</button>
                                <button className="text-red-400 hover:text-red-700 transition-colors">Delete</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
`;
        await generateFile('Page', `${name}Page`, pageTemplate, 'resources/pages');

        spinner.succeed(chalk.green(`Successfully generated full CRUD suite for ${name}!`));
        console.log(chalk.blue(`\nNext steps:`));
        console.log(chalk.white(` 1. Run migrations: `) + chalk.yellow(`ereact migrate`));
        console.log(chalk.white(` 2. Register route in routes/web.ts: `) + chalk.cyan(`Route.get('/${name.toLowerCase()}', (req, res) => res.view('${name}Page'))`));
    } catch (error) {
        spinner.fail(chalk.red('Failed to generate CRUD suite.'));
    }
}

/**
 * AI Driver Generator
 */
export async function makeAIDriver(name: string) {
    const template = `import { AiDriver } from '@ereactthohir/core';

/**
 * ${name} AI Driver
 */
export default class ${name}Driver extends AiDriver {
    /**
     * Complete a prompt using ${name}
     */
    public async prompt(text: string, options: any = {}): Promise<string> {
        // Implementation for ${name} API call
        return "Response from ${name}";
    }

    /**
     * Generate an image using ${name}
     */
    public async generateImage(prompt: string): Promise<string> {
        return "url-to-generated-image";
    }
}
`;
    await generateFile('AI Driver', `${name}Driver`, template, 'app/Services/AI/Drivers');
}

/**
 * Payment Provider Generator
 */
export async function makePaymentProvider(name: string) {
    const template = `import { PaymentProvider } from '@ereactthohir/core';

/**
 * ${name} Payment Provider
 */
export default class ${name}Provider extends PaymentProvider {
    /**
     * Create a payment transaction
     */
    public async createTransaction(data: any): Promise<any> {
        // Implementation for ${name} payment gateway
        return { id: 'TRX_123', status: 'pending' };
    }

    /**
     * Handle payment notification/webhook
     */
    public async handleNotification(payload: any): Promise<any> {
        // Implementation for processing notifications
    }
}
`;
    await generateFile('Payment Provider', `${name}Provider`, template, 'app/Services/Payments/Providers');
}
