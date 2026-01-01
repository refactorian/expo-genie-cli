import inquirer from 'inquirer';
import { ui } from '../utils/ui';
import { fileSystem } from '../utils/fs';
import path from 'path';

interface CleanOptions {
  all?: boolean;
}

export async function cleanCommand(options: CleanOptions = {}) {
  try {
    const projectPath = process.cwd();

    ui.section('Cleaning Project');

    const { confirm } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message: options.all
          ? 'This will delete node_modules, cache, and build folders. Continue?'
          : 'This will delete cache and build folders. Continue?',
        default: false,
      },
    ]);

    if (!confirm) {
      ui.info('Clean cancelled');
      return;
    }

    const spinner = ui.spinner('Cleaning project...');

    try {
      const dirsToClean = [
        '.expo',
        'android/build',
        'android/.gradle',
        'ios/build',
        'ios/Pods',
        '.expo-genie/cache',
      ];

      if (options.all) {
        dirsToClean.push('node_modules');
      }

      for (const dir of dirsToClean) {
        const dirPath = path.join(projectPath, dir);
        if (await fileSystem.fileExists(dirPath)) {
          await fileSystem.deleteDirectory(dirPath);
          ui.success(`Deleted ${dir}`);
        }
      }

      spinner.succeed('Project cleaned successfully!');

      if (options.all) {
        ui.info('Run your package manager install command to reinstall dependencies');
      }
    } catch (error) {
      spinner.fail('Failed to clean project');
      throw error;
    }
  } catch (error: any) {
    ui.error(error.message || 'An error occurred');
    process.exit(1);
  }
}