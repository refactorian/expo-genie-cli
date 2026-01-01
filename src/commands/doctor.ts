import { ui } from '../utils/ui';
import { config } from '../utils/config';
import { fileSystem } from '../utils/fs';

import path from 'path';
import chalk from 'chalk';

export async function doctorCommand() {
  try {
    const projectPath = process.cwd();

    ui.section('🏥 Running health check on your project...');
    ui.newLine();

    // Check if it's an Expo Genie CLI project
    const projectConfig = await config.loadProjectConfig(projectPath);
    if (!projectConfig) {
      ui.error('Not in an Expo Genie CLI project directory');
      process.exit(1);
    }

    const checks = [];

    // Check package.json
    const packageJsonPath = path.join(projectPath, 'package.json');
    if (await fileSystem.fileExists(packageJsonPath)) {
      checks.push({ name: 'package.json exists', status: 'pass' });

      const packageJson = await fileSystem.readJson(packageJsonPath);

      // Check for required dependencies
      const hasReact = packageJson.dependencies?.react;
      const hasReactNative = packageJson.dependencies?.['react-native'];
      const hasExpo = packageJson.dependencies?.expo;

      if (hasReact && (hasReactNative || hasExpo)) {
        checks.push({ name: 'Core dependencies installed', status: 'pass' });
      } else {
        checks.push({ name: 'Core dependencies installed', status: 'fail', message: 'Missing React Native or Expo' });
      }
    } else {
      checks.push({ name: 'package.json exists', status: 'fail' });
    }

    // Check app.json (Expo Config)
    const appJsonPath = path.join(projectPath, 'app.json');
    if (await fileSystem.fileExists(appJsonPath)) {
      checks.push({ name: 'app.json (Expo Config) exists', status: 'pass' });
    } else {
      // app.config.js/ts might exist instead, but app.json is standard for generated projects
      const appConfigJs = path.join(projectPath, 'app.config.js');
      const appConfigTs = path.join(projectPath, 'app.config.ts');
      if ((await fileSystem.fileExists(appConfigJs)) || (await fileSystem.fileExists(appConfigTs))) {
        checks.push({ name: 'app.config.js/ts exists', status: 'pass' });
      } else {
        checks.push({ name: 'Expo Config exists', status: 'warn', message: 'Missing app.json/app.config.js' });
      }
    }

    // Check TypeScript
    const tsConfigPath = path.join(projectPath, 'tsconfig.json');
    if (await fileSystem.fileExists(tsConfigPath)) {
      checks.push({ name: 'TypeScript configured', status: 'pass' });
    } else {
      checks.push({ name: 'TypeScript configured', status: 'warn', message: 'TypeScript not found' });
    }

    // Check node_modules
    const nodeModulesPath = path.join(projectPath, 'node_modules');
    if (await fileSystem.fileExists(nodeModulesPath)) {
      checks.push({ name: 'Dependencies installed', status: 'pass' });
    } else {
      checks.push({ name: 'Dependencies installed', status: 'fail', message: 'Run npm install' });
    }

    // Check .expo-genie.json
    if (projectConfig) {
      checks.push({ name: 'Expo Genie CLI configuration', status: 'pass' });
    }

    // Check git
    const gitPath = path.join(projectPath, '.git');
    if (await fileSystem.fileExists(gitPath)) {
      checks.push({ name: 'Git initialized', status: 'pass' });
    } else {
      checks.push({ name: 'Git initialized', status: 'warn', message: 'Git not initialized' });
    }

    // Display results
    console.log(chalk.cyan.bold('┌─ Dependencies ──────────────────────────────┐'));
    checks.slice(0, 3).forEach(check => {
      if (check.status === 'pass') {
        console.log(chalk.green('│ ✓'), check.name.padEnd(42), chalk.green('│'));
      } else if (check.status === 'warn') {
        console.log(chalk.yellow('│ ⚠'), check.name.padEnd(42), chalk.yellow('│'));
        if (check.message) {
          console.log(chalk.gray('│   ' + check.message.padEnd(42)), chalk.gray('│'));
        }
      } else {
        console.log(chalk.red('│ ✗'), check.name.padEnd(42), chalk.red('│'));
        if (check.message) {
          console.log(chalk.gray('│   ' + check.message.padEnd(42)), chalk.gray('│'));
        }
      }
    });
    console.log(chalk.cyan.bold('└─────────────────────────────────────────────┘'));

    ui.newLine();

    console.log(chalk.cyan.bold('┌─ Configuration ─────────────────────────────┐'));
    checks.slice(3).forEach(check => {
      if (check.status === 'pass') {
        console.log(chalk.green('│ ✓'), check.name.padEnd(42), chalk.green('│'));
      } else if (check.status === 'warn') {
        console.log(chalk.yellow('│ ⚠'), check.name.padEnd(42), chalk.yellow('│'));
        if (check.message) {
          console.log(chalk.gray('│   ' + check.message.padEnd(42)), chalk.gray('│'));
        }
      } else {
        console.log(chalk.red('│ ✗'), check.name.padEnd(42), chalk.red('│'));
        if (check.message) {
          console.log(chalk.gray('│   ' + check.message.padEnd(42)), chalk.gray('│'));
        }
      }
    });
    console.log(chalk.cyan.bold('└─────────────────────────────────────────────┘'));

    ui.newLine();

    // Display recommendations
    const failedChecks = checks.filter(c => c.status === 'fail');
    const warnChecks = checks.filter(c => c.status === 'warn');

    if (failedChecks.length > 0 || warnChecks.length > 0) {
      console.log(chalk.cyan.bold('┌─ Recommendations ───────────────────────────┐'));

      failedChecks.forEach(check => {
        console.log(chalk.red('│ •'), 'Fix:', check.name.padEnd(36), chalk.red('│'));
      });

      warnChecks.forEach(check => {
        console.log(chalk.yellow('│ •'), 'Consider:', check.name.padEnd(32), chalk.yellow('│'));
      });

      console.log(chalk.cyan.bold('└─────────────────────────────────────────────┘'));
    } else {
      ui.successBox('Health Check Complete', [
        'All checks passed! Your project is healthy.',
      ]);
    }

    // Project info
    ui.newLine();
    ui.section('Project Information');
    ui.table({
      'Template': projectConfig.template || 'Unknown',
      'Package Manager': projectConfig.preferences.packageManager,
      'TypeScript': projectConfig.preferences.typescript ? 'Enabled' : 'Disabled',
      'Features': Object.keys(projectConfig.features).length.toString() + ' installed',
    });

  } catch (error: any) {
    ui.error(error.message || 'An error occurred');
    process.exit(1);
  }
}