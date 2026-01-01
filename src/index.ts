import { Command } from 'commander';
// import chalk from 'chalk';
import figlet from 'figlet';
import gradient from 'gradient-string';
import { initCommand } from './commands/init';
import { addCommand } from './commands/add';
import { installCommand } from './commands/install';
import { configCommand } from './commands/config';
import { doctorCommand } from './commands/doctor';
import { generateCommand } from './commands/generate';
import { cleanCommand } from './commands/clean';
import { infoCommand } from './commands/info';

import { migrateCommand } from './commands/migrate';

const program = new Command();

const displayBanner = () => {
  console.log(
    gradient.pastel.multiline(
      figlet.textSync('EXPO GENIE CLI', {
        font: 'Standard',
        horizontalLayout: 'default',
      })
    )
  );
  // console.log(
  //   chalk.cyan('Command Aliases: expo-genie, eg, 🧞 \n')
  // );
};

program
  .name('expo-genie')
  .description('🧞 EXPO GENIE CLI - Your Wish is My Command')
  .version('1.0.1')
  .aliases(['eg', '🧞'])
  .hook('preAction', (thisCommand) => {
    console.log(thisCommand.args.length);
    // if (thisCommand.args.length === 0 && !process.argv.slice(2).length) {
    //   displayBanner();
    // }
    displayBanner();
  });

program
  .command('init [project-name]')
  .description('Initialize a new React Native project')
  .option('-t, --template <template>', 'Project template')
  .option('-p, --package-manager <pm>', 'Package manager (npm, yarn, pnpm, bun)')
  .option('--skip-install', 'Skip dependency installation')
  .option('--skip-git', 'Skip git initialization')
  .action(initCommand);

program
  .command('add [feature]')
  .description('Add a feature to your project')
  .option('-y, --yes', 'Skip prompts and use defaults')
  .option('--force', 'Force regeneration of existing features')
  .action(addCommand);

program
  .command('install [package]')
  .alias('i')
  .description('Install and configure a package')
  .action(installCommand);

program
  .command('generate [type] [name]')
  .alias('g')
  .description('Generate code (screen, component, hook, etc.)')
  .option('-d, --directory <dir>', 'Output directory')
  .action(generateCommand);

program
  .command('config <action> [key] [value]')
  .description('Manage configuration (set, get, list, reset)')
  .action(configCommand);

program
  .command('doctor')
  .description('Check project health and configuration')
  .action(doctorCommand);

program
  .command('clean')
  .description('Clean project cache and build artifacts')
  .option('--all', 'Clean everything including node_modules')
  .action(cleanCommand);

program
  .command('info')
  .description('Display project information')
  .action(infoCommand);

program
  .command('migrate [type]')
  .description('Migrate UI library or state management (ui, state)')
  .option('--from <library>', 'Source library')
  .option('--to <library>', 'Target library')
  .option('--force', 'Force migration without confirmation')
  .action(migrateCommand);


program.parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp();
}