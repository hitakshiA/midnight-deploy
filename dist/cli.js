#!/usr/bin/env node
import { Command } from 'commander';
import { deploy } from './deploy.js';
const program = new Command();
program
    .name('midnight-deploy')
    .description('A slick CLI tool to compile, deploy, and manage Midnight smart contracts.')
    .version('1.0.0');
program
    .command('deploy')
    .description('Compile, deploy, and initialize contracts from your config file.')
    .option('-c, --config <path>', 'Path to your config file', './example/midnight.config.ts')
    .option('-q, --quick-deploy', 'Use a freshly generated, random hex seed for deployment (no .env needed).')
    .option('-s, --seed <seed>', 'Provide an existing hex seed directly for deployment (overrides .env and --quick-deploy).')
    .action(async (options) => {
    await deploy(options.config, options.quickDeploy, options.seed);
});
// The generate-wallet command is removed.
program.parse(process.argv);
