import inquirer from 'inquirer';
import path from 'path';
import execa from 'execa';
import { ui } from '../utils/ui';
import { fileSystem } from '../utils/fs';
import { packageManager, PackageManager } from '../utils/packageManager';
// import { git } from '../utils/git';
import { config } from '../utils/config';
import { getTemplate, getTemplatesByCategory } from '../templates';
import { uiLibraries } from '../ui_libraries';
import { stateManagementLibraries } from '../state_management';
import validatePackageName from 'validate-npm-package-name';
import { templateManager } from '../utils/templateManager';

interface InitOptions {
  template?: string;
  packageManager?: PackageManager;
  uiLibrary?: string;
  stateManagement?: string;
  skipInstall?: boolean;
  skipGit?: boolean;
}

export async function initCommand(projectName?: string, options: InitOptions = {}) {
  try {
    ui.header('🧞 EXPO GENIE CLI - Your Wish is My Command');

    // Get project name
    if (!projectName) {
      const nameAnswer = await inquirer.prompt([
        {
          type: 'input',
          name: 'projectName',
          message: 'Project name:',
          default: 'my-app',
          validate: (input: string) => {
            const validation = validatePackageName(input);
            if (!validation.validForNewPackages) {
              return validation.errors?.[0] || 'Invalid package name';
            }
            return true;
          },
        },
      ]);
      projectName = nameAnswer.projectName;
    }

    // Ask for directory choice
    const { directoryChoice } = await inquirer.prompt([
      {
        type: 'list',
        name: 'directoryChoice',
        message: 'Where should we create the project?',
        choices: [
          { name: 'New directory', value: 'new' },
          { name: 'Same directory', value: 'same' },
        ],
        default: 'new',
      },
    ]);

    let projectPath: string;
    if (directoryChoice === 'same') {
      projectPath = process.cwd();
    } else {
      projectPath = path.join(process.cwd(), projectName ?? '');
    }

    // Check if expo-genie.json already exists in target directory
    if (await config.isExpoGenieProject(projectPath)) {
      ui.warningBox('Existing Project Detected', [
        'This directory is already an Expo Genie project.',
        'An expo-genie.json configuration file already exists.',
      ]);

      const { reinit } = await inquirer.prompt([
        {
          type: 'list',
          name: 'reinit',
          message: 'What would you like to do?',
          choices: [
            { name: 'Overwrite current config and reinitialize', value: 'overwrite' },
            { name: 'Exit', value: 'exit' },
          ],
          default: 'exit',
        },
      ]);

      if (reinit === 'exit') {
        ui.info('Initialization cancelled');
        process.exit(0);
      }

      ui.info('Overwriting existing configuration...');
    }

    // Check if app.json already exists in target directory
    const appJsonPath = path.join(projectPath, 'app.json');
    const isExistingExpoProject = await fileSystem.fileExists(appJsonPath);

    if (isExistingExpoProject) {
      ui.info('✨ Detected existing Expo project. Initializing Expo Genie...');

      // For existing projects, we still need to know some preferences
      // Select package manager
      let pm = options.packageManager;
      if (!pm) {
        const pmAnswer = await inquirer.prompt([
          {
            type: 'list',
            name: 'packageManager',
            message: 'Package manager:',
            choices: [
              { name: 'npm', value: 'npm' },
              { name: 'yarn', value: 'yarn' },
              { name: 'pnpm', value: 'pnpm' },
              { name: 'bun', value: 'bun' },
            ],
            default: 'npm',
          },
        ]);
        pm = pmAnswer.packageManager;
      }

      // Select UI Library
      let selectedUILibrary = options.uiLibrary;
      if (!selectedUILibrary) {
        const uiAnswer = await inquirer.prompt([
          {
            type: 'list',
            name: 'uiLibrary',
            message: 'UI Library:',
            choices: (Object.values(uiLibraries) as any[]).map((lib: any) => ({
              name: lib.displayName,
              value: lib.name,
            })),
            default: 'nativewind',
          },
        ]);
        selectedUILibrary = uiAnswer.uiLibrary;
      }

      // Select State Management
      let selectedStateManagement = options.stateManagement;
      if (!selectedStateManagement) {
        const stateAnswer = await inquirer.prompt([
          {
            type: 'list',
            name: 'stateManagement',
            message: 'State Management:',
            choices: (Object.values(stateManagementLibraries) as any[]).map((lib: any) => ({
              name: lib.displayName,
              value: lib.name,
            })),
            default: 'zustand',
          },
        ]);
        selectedStateManagement = stateAnswer.stateManagement;
      }

      const spinner = ui.spinner('Initializing Expo Genie configuration...');
      try {
        const projectConfig = config.createDefaultConfig(
          projectName!,
          'existing',
          selectedUILibrary!,
          selectedStateManagement!,
          pm!
        );
        await config.saveProjectConfig(projectPath, projectConfig);
        await config.addRecentProject(projectPath);
        spinner.succeed('Expo Genie initialized successfully!');

        ui.successBox('🎉 Expo Genie is ready!', [
          '',
          `📁 Project: ${projectName}`,
          `🎨 UI Library: ${selectedUILibrary}`,
          `🔄 State: ${selectedStateManagement}`,
          `📦 Package Manager: ${pm}`,
          '',
          '🚀 You can now use "eg add" to add features to your project.',
        ]);
        return;
      } catch (error) {
        spinner.fail('Failed to initialize Expo Genie');
        throw error;
      }
    }

    // Check if directory exists (for new projects)
    if (directoryChoice === 'new' && await fileSystem.fileExists(projectPath)) {
      const { overwrite } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'overwrite',
          message: `Directory ${projectName} already exists. Overwrite?`,
          default: false,
        },
      ]);

      if (!overwrite) {
        ui.info('Installation cancelled');
        process.exit(0);
      }

      // Backup existing directory
      const backupPath = `${projectPath}.backup.${Date.now()}`;
      await fileSystem.copyTemplate(projectPath, backupPath);
      ui.info(`Existing directory backed up to ${backupPath}`);
      await fileSystem.deleteDirectory(projectPath);
    }

    // Select template
    let selectedTemplate = options.template;
    if (!selectedTemplate) {
      const officialTemplates = getTemplatesByCategory('official');
      const customTemplates = getTemplatesByCategory('custom');

      const choices = [
        new inquirer.Separator('--- Official Templates ---'),
        ...officialTemplates.map((t) => ({
          name: `${t.displayName} - ${t.description}`,
          value: t.name,
        })),
      ];

      if (customTemplates.length > 0) {
        choices.push(new inquirer.Separator('--- Custom Templates ---'));
        choices.push(
          ...customTemplates.map((t) => ({
            name: `${t.displayName} - ${t.description}`,
            value: t.name,
          }))
        );
      }

      const templateAnswer = await inquirer.prompt([
        {
          type: 'list',
          name: 'template',
          message: 'Choose a template:',
          choices,
          pageSize: 15,
        },
      ]);
      selectedTemplate = templateAnswer.template;
    }

    const template = getTemplate(selectedTemplate!);
    if (!template) {
      ui.error('Invalid template selected');
      process.exit(1);
    }

    // Select package manager
    let pm = options.packageManager;
    if (!pm) {
      const pmAnswer = await inquirer.prompt([
        {
          type: 'list',
          name: 'packageManager',
          message: 'Package manager:',
          choices: [
            { name: 'npm', value: 'npm' },
            { name: 'yarn', value: 'yarn' },
            { name: 'pnpm', value: 'pnpm' },
            { name: 'bun', value: 'bun' },
          ],
          default: 'npm',
        },
      ]);
      pm = pmAnswer.packageManager;
    }

    // Check if package manager is available
    if (!(await packageManager.isAvailable(pm!))) {
      ui.error(`${pm} is not installed on your system`);
      process.exit(1);
    }

    // Select UI Library
    let selectedUILibrary = options.uiLibrary;
    if (!selectedUILibrary) {
      const uiAnswer = await inquirer.prompt([
        {
          type: 'list',
          name: 'uiLibrary',
          message: 'UI Library:',
          choices: (Object.values(uiLibraries) as any[]).map((lib: any) => ({
            name: lib.displayName,
            value: lib.name,
          })),
          default: 'nativewind',
        },
      ]);
      selectedUILibrary = uiAnswer.uiLibrary;
    }

    // Select State Management
    let selectedStateManagement = options.stateManagement;
    if (!selectedStateManagement) {
      const stateAnswer = await inquirer.prompt([
        {
          type: 'list',
          name: 'stateManagement',
          message: 'State Management:',
          choices: (Object.values(stateManagementLibraries) as any[]).map((lib: any) => ({
            name: lib.displayName,
            value: lib.name,
          })),
          default: 'zustand',
        },
      ]);
      selectedStateManagement = stateAnswer.stateManagement;
    }

    // Additional options
    const additionalOptions = await inquirer.prompt([
      {
        type: 'list',
        name: 'iconLibrary',
        message: 'Icon Library:',
        choices: [
          { name: 'Lucide React Native', value: 'lucide' },
          { name: 'React Native Vector Icons', value: 'vector-icons' },
          { name: 'None', value: 'none' },
        ],
        default: 'lucide',
      },
      {
        type: 'confirm',
        name: 'darkMode',
        message: 'Include dark mode support?',
        default: true,
      },
    ]);

    // Start creation
    ui.newLine();
    ui.section('🎨 Creating Your Project');

    const spinner = ui.spinner('Setting up project structure...');
    const startTime = Date.now();

    try {
      // Use local template copy
      const templateMap: Record<string, string> = {
        'default': 'default',
        'blank': 'blank',
        'blank-typescript': 'blank-typescript',
        'tabs': 'tabs',
        'bare-minimum': 'bare-minimum',
      };

      const localTemplate = templateMap[selectedTemplate!] || 'default';
      spinner.text = `Copying ${localTemplate} template...`;

      try {
        await templateManager.copyTemplate(localTemplate, projectPath);
      } catch (error) {
        throw new Error(`Failed to copy template: ${error instanceof Error ? error.message : String(error)}`);
      }

      // Update project metadata (app.json and package.json)
      spinner.text = 'Updating project metadata...';
      try {
        // Update package.json
        const packageJsonPath = path.join(projectPath, 'package.json');
        if (await fileSystem.fileExists(packageJsonPath)) {
          const packageJson = await fileSystem.readJson(packageJsonPath);
          packageJson.name = projectName;
          await fileSystem.writeJson(packageJsonPath, packageJson);
        }

        // Update app.json
        const appJsonPath = path.join(projectPath, 'app.json');
        if (await fileSystem.fileExists(appJsonPath)) {
          const appJson = await fileSystem.readJson(appJsonPath);
          if (appJson.expo) {
            appJson.expo.name = projectName;
            appJson.expo.slug = projectName;
          }
          await fileSystem.writeJson(appJsonPath, appJson);
        }
      } catch (error) {
        ui.warning('Failed to update project metadata. You may need to manually update app.json and package.json.');
      }

      // Initialize git
      if (!options.skipGit) {
        spinner.text = 'Initializing git...';
        try {
          // git init
          await execa('git', ['init'], { cwd: projectPath });
          // Optional: Initial commit can be added here if desired, but git init is usually enough
        } catch (error) {
          // Warn but don't fail, git might not be installed
          ui.warning('Failed to initialize git. Make sure git is installed.');
        }
      }

      // Install dependencies (base)
      if (!options.skipInstall) {
        spinner.text = `Installing base dependencies with ${pm}...`;
        await packageManager.install(pm!, projectPath);
      }

      // Post-creation setup
      spinner.start('Configuring Genie features...');

      // Create README
      const readme = `# ${projectName}

Created with 🧞 Expo Genie CLI

## Project Configuration

- **UI Library:** ${selectedUILibrary}
- **State Management:** ${selectedStateManagement}
- **Template:** ${template.displayName}
- **Package Manager:** ${pm}

## Get Started

\`\`\`bash
${packageManager.getRunCommand(pm!, 'start')}
\`\`\`

## Available Scripts

- \`start\` - Start the development server
- \`android\` - Run on Android
- \`ios\` - Run on iOS
- \`web\` - Run on web
- \`test\` - Run tests
- \`lint\` - Lint code
- \`format\` - Format code with Prettier

## Expo Genie CLI Commands

\`\`\`bash
# Add features
eg add auth
eg add payments

# Generate code
eg generate screen Home
eg generate component Button

# Manage project
eg doctor
eg info
\`\`\`

## Learn More

- [Expo Genie CLI Documentation](https://docs.expo-genie.dev)
- [Expo Documentation](https://docs.expo.dev)
`;
      await fileSystem.writeFile(path.join(projectPath, 'README.md'), readme);

      // Save expo-genie.json config
      spinner.text = 'Saving configuration...';
      const projectConfig = config.createDefaultConfig(
        projectName!,
        selectedTemplate!,
        selectedUILibrary!,
        selectedStateManagement!,
        pm!
      );
      projectConfig.preferences.darkMode = additionalOptions.darkMode;
      await config.saveProjectConfig(projectPath, projectConfig);
      await config.addRecentProject(projectPath);

      // Install dependencies
      if (!options.skipInstall) {
        spinner.text = `Installing additional dependencies with ${pm}...`;

        // Install UI library packages
        const uiLib = uiLibraries[selectedUILibrary! as keyof typeof uiLibraries];
        if (uiLib) {
          if (uiLib.packages.length > 0) {
            await packageManager.install(pm!, projectPath, uiLib.packages);
            if (uiLib.devPackages && uiLib.devPackages.length > 0) {
              await packageManager.install(pm!, projectPath, uiLib.devPackages, true);
            }
          }

          // Generate UI library config files
          if (uiLib.configFiles) {
            spinner.text = `Configuring ${uiLib.displayName}...`;
            for (const configFile of uiLib.configFiles) {
              await fileSystem.writeFile(path.join(projectPath, configFile.path), configFile.content);
            }
          }
        }

        // Install state management packages
        const stateLib = stateManagementLibraries[selectedStateManagement! as keyof typeof stateManagementLibraries];
        if (stateLib && stateLib.packages.length > 0) {
          await packageManager.install(pm!, projectPath, stateLib.packages);
        }

        // Install Icon Library
        if (additionalOptions.iconLibrary && additionalOptions.iconLibrary !== 'none') {
          let iconPackage = '';
          switch (additionalOptions.iconLibrary) {
            case 'lucide':
              iconPackage = 'lucide-react-native';
              break;
            case 'vector-icons':
              iconPackage = '@expo/vector-icons'; // This is usually standard in Expo, but no harm ensuring
              break;
          }
          if (iconPackage) {
            spinner.text = `Installing ${additionalOptions.iconLibrary}...`;
            await packageManager.install(pm!, projectPath, [iconPackage]);
          }
        }
      }

      const elapsed = Date.now() - startTime;
      spinner.succeed(`Project created successfully! (${Math.floor(elapsed / 1000)}s)`);

      // Success message
      ui.successBox('🎉 Success! Your project is ready', [
        '',
        `📁 Project: ${projectName}`,
        `🎨 UI Library: ${selectedUILibrary}`,
        `🔄 State: ${selectedStateManagement}`,
        `📦 Package Manager: ${pm}`,
        `📋 Template: ${template.displayName}`,
        ``,
        '✨ Next steps:',
        ``,
        `  cd ${projectName}`,
        `  ${packageManager.getRunCommand(pm!, 'start')}`,
        ``,
        '🚀 Add features:',
        `  eg add auth`,
        `  eg add payments`,
      ]);
    } catch (error) {
      spinner.fail('Failed to create project');
      throw error;
    }
  } catch (error: any) {
    ui.error(error.message || 'An error occurred');
    process.exit(1);
  }
}