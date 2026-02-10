#!/usr/bin/env node
import { Command } from 'commander';
import { create } from './commands/create';
import {
    makeController,
    makeModel,
    makeService,
    makeScreen,
    makeComponent,
    makeMigration,
    makeSeeder,
    makeProvider,
    makeMiddleware,
    makeJob,
    makePolicy,
    makeTest,
    makeMail,
    makeNotification,
    makeCommand,
    makeResource,
    makeEvent,
    makeListener,
    makeFactory,
    makeException,
    makeValidator,
    makeCRUD,
    makeAIDriver,
    makePaymentProvider
} from './commands/generators';
import { serve } from './commands/serve';
import { listRoutes } from './commands/route';
import { migrate, rollback, seed } from './commands/migrate';
import { buildWeb, buildAndroid, buildIOS } from './commands/build';
import { generateKey } from './commands/key';
import { about } from './commands/about';

const program = new Command();

program
    .name('ereact')
    .description('CLI for EreactThohir Framework')
    .version('1.5.0');

program
    .command('create <name>')
    .description('Create a new EreactThohir project')
    .action(create);

program
    .command('about')
    .description('Display information about the framework and project')
    .action(about);

program
    .command('serve')
    .alias('dev')
    .alias('jalan')
    .description('Start the development server (Mulai server pengembangan)')
    .action(serve);

program
    .command('route:list')
    .description('List all registered routes')
    .action(listRoutes);

program
    .command('key:generate')
    .description('Set the application key')
    .action(generateKey);

program
    .command('migrate')
    .description('Run database migrations')
    .action(migrate);

program
    .command('migrate:rollback')
    .description('Rollback the last database migration')
    .action(rollback);

program
    .command('db:seed')
    .description('Seed the database with records')
    .action(seed);

program
    .command('make:controller <name>')
    .description('Create a new controller')
    .option('-r, --resource', 'Generate a resource controller')
    .option('-a, --api', 'Generate an API resource controller')
    .option('-m, --model <model>', 'Generate a controller for the given model')
    .action((name, options) => makeController(name, options));

program
    .command('make:model <name>')
    .description('Create a new model')
    .option('-m, --migration', 'Create a migration for the model')
    .option('-c, --controller', 'Create a controller for the model')
    .option('-f, --factory', 'Create a factory for the model')
    .action((name, options) => makeModel(name, options));

program
    .command('make:factory <name>')
    .description('Create a new factory')
    .action(makeFactory);

program
    .command('make:exception <name>')
    .description('Create a new exception class')
    .action(makeException);

program
    .command('make:validator <name>')
    .description('Create a new validator class')
    .action(makeValidator);

program
    .command('make:crud <name>')
    .description('Create a full CRUD structure (Model, Migration, Controller, Factory, Page)')
    .action(makeCRUD);

program
    .command('make:ai-driver <name>')
    .description('Create a new AI driver')
    .action(makeAIDriver);

program
    .command('make:payment-provider <name>')
    .description('Create a new payment provider')
    .action(makePaymentProvider);

program
    .command('make:service <name>')
    .description('Create a new service')
    .action(makeService);

program
    .command('make:screen <name>')
    .description('Create a new screen')
    .action(makeScreen);

program
    .command('make:component <name>')
    .description('Create a new component')
    .action(makeComponent);

program
    .command('make:migration <name>')
    .description('Create a new migration file')
    .action(makeMigration);

program
    .command('make:seeder <name>')
    .description('Create a new seeder file')
    .action(makeSeeder);

program
    .command('make:provider <name>')
    .description('Create a new service provider')
    .action(makeProvider);

program
    .command('make:middleware <name>')
    .description('Create a new middleware')
    .action(makeMiddleware);

program
    .command('make:job <name>')
    .description('Create a new job')
    .action(makeJob);

program
    .command('make:policy <name>')
    .description('Create a new policy')
    .action(makePolicy);

program
    .command('make:test <name>')
    .description('Create a new test file')
    .action(makeTest);

program
    .command('make:mail <name>')
    .description('Create a new mail class')
    .action(makeMail);

program
    .command('make:notification <name>')
    .description('Create a new notification class')
    .action(makeNotification);

program
    .command('make:command <name>')
    .description('Create a new custom command')
    .action(makeCommand);

program
    .command('make:resource <name>')
    .description('Create a new API resource')
    .action(makeResource);

program
    .command('make:event <name>')
    .description('Create a new event class')
    .action(makeEvent);

program
    .command('make:listener <name>')
    .description('Create a new listener class')
    .action(makeListener);

program
    .command('build:android')
    .description('Build for Android')
    .action(buildAndroid);

program
    .command('build:ios')
    .description('Build for iOS')
    .action(buildIOS);

program
    .command('build')
    .description('Build the application for production (defaults to web)')
    .action(buildWeb);

program
    .command('build:web')
    .description('Build for Web')
    .action(buildWeb);

program
    .command('test')
    .description('Run tests')
    .action(() => {
        const { spawn } = require('child_process');
        console.log('Running tests...');
        const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
        const child = spawn(npm, ['test'], { stdio: 'inherit' });
        child.on('close', (code: number) => {
            process.exit(code);
        });
    });

program.parse(process.argv);
