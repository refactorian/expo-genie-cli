import { ui } from '../utils/ui';
import { config } from '../utils/config';
import { fileSystem } from '../utils/fs';
import path from 'path';

export async function infoCommand() {
  try {
    const projectPath = process.cwd();

    // Load config
    const projectConfig = await config.loadProjectConfig(projectPath);
    if (!projectConfig) {
      ui.error('Not in an Expo Genie CLI project directory');
      process.exit(1);
    }

    // Load package.json
    const packageJsonPath = path.join(projectPath, 'package.json');
    let packageJson: any = {};
    if (await fileSystem.fileExists(packageJsonPath)) {
      packageJson = await fileSystem.readJson(packageJsonPath);
    }

    ui.section('Project Information');
    ui.newLine();

    // Basic Info
    ui.info('📦 Project Details');
    ui.table({
      'Name': packageJson.name || 'Unknown',
      'Version': packageJson.version || '0.0.0',
      'Template': projectConfig.template || 'Unknown',
    });

    ui.newLine();

    // Configuration
    ui.info('⚙️ Configuration');
    ui.table({
      'Package Manager': projectConfig.preferences.packageManager,
      'TypeScript': projectConfig.preferences.typescript ? 'Enabled' : 'Disabled',
      'Auto Install': projectConfig.preferences.autoInstall ? 'Yes' : 'No',
      'Git Commit': projectConfig.preferences.gitCommit ? 'Yes' : 'No',
    });

    ui.newLine();

    // Features
    ui.info('✨ Installed Features');
    const features = Object.entries(projectConfig.features);
    if (features.length > 0) {
      features.forEach(([name, config]: [string, any]) => {
        console.log(`  • ${name}${config.enabled ? ' (enabled)' : ''}`);
      });
    } else {
      console.log('  No features installed yet');
    }

    ui.newLine();

    // Dependencies
    if (packageJson.dependencies) {
      ui.info('📚 Dependencies');
      const deps = Object.keys(packageJson.dependencies);
      console.log(`  ${deps.length} packages installed`);
    }

  } catch (error: any) {
    ui.error(error.message || 'An error occurred');
    process.exit(1);
  }
}