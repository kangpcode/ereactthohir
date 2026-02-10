#!/usr/bin/env node

const { create } = require('@ereactthohir/cli/dist/commands/create');

const args = process.argv.slice(2);
const projectName = args[0];

if (!projectName) {
    console.error('Please specify the project name:');
    console.error('  npm create ereactthohir <project-name>');
    process.exit(1);
}

create(projectName).catch(err => {
    console.error(err);
    process.exit(1);
});
