import inquirer from 'inquirer';
import { ui } from '../utils/ui';
import { config } from '../utils/config';
import { packageManager } from '../utils/packageManager';
import { uiLibraries } from '../ui_libraries';
import { stateManagementLibraries } from '../state_management';


interface MigrateOptions {
  from?: string;
  to?: string;
  force?: boolean;
}

export async function migrateCommand(type?: 'ui' | 'state', options: MigrateOptions = {}) {
  try {
    const projectPath = process.cwd();

    // Check if in Expo Genie CLI project
    const isGenieProject = await config.isExpoGenieProject(projectPath);
    if (!isGenieProject) {
      ui.error('Not in an Expo Genie CLI project directory');
      process.exit(1);
    }

    const projectConfig = await config.loadProjectConfig(projectPath);
    if (!projectConfig) {
      ui.error('Could not load project configuration');
      process.exit(1);
    }

    // Prompt for type if not provided
    if (!type) {
      const { selectedType } = await inquirer.prompt([
        {
          type: 'list',
          name: 'selectedType',
          message: 'What do you want to migrate?',
          choices: [
            { name: 'UI Library', value: 'ui' },
            { name: 'State Management', value: 'state' },
          ],
        },
      ]);
      type = selectedType;
    }

    if (type === 'ui') {
      await migrateUILibrary(projectPath, projectConfig, options);
    } else if (type === 'state') {
      await migrateStateManagement(projectPath, projectConfig, options);
    }
  } catch (error: any) {
    ui.error(error.message || 'An error occurred');
    process.exit(1);
  }
}

async function migrateUILibrary(projectPath: string, projectConfig: any, options: MigrateOptions) {
  ui.header('🎨 Migrate UI Library');

  const currentUI = projectConfig.uiLibrary;
  ui.info(`Current UI Library: ${currentUI}`);
  ui.newLine();

  // Select target UI library
  const targetUI = options.to || (await inquirer.prompt([
    {
      type: 'list',
      name: 'target',
      message: 'Migrate to:',
      choices: (Object.values(uiLibraries) as any[])
        .filter((lib: any) => lib.name !== currentUI)
        .map((lib: any) => ({
          name: lib.displayName,
          value: lib.name,
        })),
    },
  ])).target;

  // Confirm migration
  const { confirm } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirm',
      message: `This will convert all components from ${currentUI} to ${targetUI}. Continue?`,
      default: false,
    },
  ]);

  if (!confirm) {
    ui.info('Migration cancelled');
    return;
  }

  const spinner = ui.spinner('Analyzing project...');

  try {
    // Find all features that use the current UI library
    const featuresToMigrate = Object.entries(projectConfig.features)
      .filter(([, feature]: any) => feature.uiLibrary === currentUI);

    const screensToMigrate = Object.entries(projectConfig.screens)
      .filter(([, screen]: any) => screen.uiLibrary === currentUI);

    const componentsToMigrate = Object.entries(projectConfig.components)
      .filter(([, component]: any) => component.uiLibrary === currentUI);

    const totalItems = featuresToMigrate.length + screensToMigrate.length + componentsToMigrate.length;

    if (totalItems === 0) {
      spinner.info('No items found to migrate');
      return;
    }

    spinner.text = `Found ${totalItems} items to migrate`;
    ui.newLine();

    ui.info(`Features: ${featuresToMigrate.length}`);
    ui.info(`Screens: ${screensToMigrate.length}`);
    ui.info(`Components: ${componentsToMigrate.length}`);
    ui.newLine();

    // Install new UI library
    spinner.text = `Installing ${targetUI}...`;
    const pm = projectConfig.preferences.packageManager;
    const targetUILib = uiLibraries[targetUI as keyof typeof uiLibraries];

    if (targetUILib.packages.length > 0) {
      await packageManager.install(pm, projectPath, targetUILib.packages);
    }

    // Config updates
    await config.updateUILibrary(projectPath, targetUI);

    spinner.succeed('Migration completed!');

    ui.successBox('✨ UI Library Migration Complete!', [
      '',
      `Migrated preference from ${currentUI} to ${targetUI}`,
      '',
      '⚠️  IMPORTANT: AUTO-MIGRATION IS NOT SUPPORTED',
      'The CLI has updated your project configuration and installed new packages,',
      'but it CANNOT automatically rewrite your existing code.',
      '',
      'Manual steps required:',
      '1. Review all components and manually refactor imports/JSX.',
      '2. Update any custom styling to match the new library.',
      '3. Run: eg doctor to check for issues',
      '',
      'Tip: You can use "eg add <feature> --force" to regenerate specific',
      'features with the new UI library templates.',
    ]);

  } catch (error) {
    spinner.fail('Migration failed');
    throw error;
  }
}

async function migrateStateManagement(projectPath: string, projectConfig: any, options: MigrateOptions) {
  ui.header('🔄 Migrate State Management');

  const currentState = projectConfig.stateManagement;
  ui.info(`Current State Management: ${currentState}`);
  ui.newLine();

  // Select target state management
  const targetState = options.to || (await inquirer.prompt([
    {
      type: 'list',
      name: 'target',
      message: 'Migrate to:',
      choices: (Object.values(stateManagementLibraries) as any[])
        .filter((lib: any) => lib.name !== currentState)
        .map((lib: any) => ({
          name: lib.displayName,
          value: lib.name,
        })),
    },
  ])).target;

  // Confirm migration
  const { confirm } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirm',
      message: `This will convert all stores from ${currentState} to ${targetState}. Continue?`,
      default: false,
    },
  ]);

  if (!confirm) {
    ui.info('Migration cancelled');
    return;
  }

  const spinner = ui.spinner('Analyzing project...');

  try {
    // Find all features that use the current state management
    const featuresToMigrate = Object.entries(projectConfig.features)
      .filter(([, feature]: any) => feature.stateManagement === currentState);

    const screensToMigrate = Object.entries(projectConfig.screens)
      .filter(([, screen]: any) => screen.stateManagement === currentState);

    const totalItems = featuresToMigrate.length + screensToMigrate.length;

    if (totalItems === 0) {
      spinner.info('No items found to migrate');
      return;
    }

    spinner.text = `Found ${totalItems} items to migrate`;
    ui.newLine();

    ui.info(`Features: ${featuresToMigrate.length}`);
    ui.info(`Screens: ${screensToMigrate.length}`);
    ui.newLine();

    // Install new state management library
    spinner.text = `Installing ${targetState}...`;
    const pm = projectConfig.preferences.packageManager;
    const targetStateLib = stateManagementLibraries[targetState as keyof typeof stateManagementLibraries];

    if (targetStateLib.packages.length > 0) {
      await packageManager.install(pm, projectPath, targetStateLib.packages);
    }

    // Config updates
    await config.updateStateManagement(projectPath, targetState);

    spinner.succeed('Migration completed!');

    ui.successBox('✨ State Management Migration Complete!', [
      '',
      `Migrated from ${currentState} to ${targetState}`,
      '',
      '⚠️  IMPORTANT: AUTO-MIGRATION IS NOT SUPPORTED',
      'The CLI has updated your project configuration and installed new packages,',
      'but it CANNOT automatically rewrite your existing stores or hooks.',
      '',
      'Manual steps required:',
      '1. Manually refactor your store files in src/store/.',
      '2. Update store imports in your components.',
      '3. Run: eg doctor to check for issues',
      '',
      'Tip: You can use "eg add <feature> --force" to regenerate specific',
      'features with the new state management templates.',
    ]);

  } catch (error) {
    spinner.fail('Migration failed');
    throw error;
  }
}
