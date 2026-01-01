import execa from 'execa';
import { fileSystem } from './fs';
import path from 'path';

export type PackageManager = 'npm' | 'yarn' | 'pnpm' | 'bun';

export const packageManager = {
  async detect(projectPath: string): Promise<PackageManager> {
    const lockFiles = {
      'package-lock.json': 'npm' as PackageManager,
      'yarn.lock': 'yarn' as PackageManager,
      'pnpm-lock.yaml': 'pnpm' as PackageManager,
      'bun.lockb': 'bun' as PackageManager,
    };

    for (const [lockFile, pm] of Object.entries(lockFiles)) {
      if (await fileSystem.fileExists(path.join(projectPath, lockFile))) {
        return pm;
      }
    }

    return 'npm';
  },

  async isAvailable(pm: PackageManager): Promise<boolean> {
    try {
      await execa(pm, ['--version']);
      return true;
    } catch {
      return false;
    }
  },

  async install(
    pm: PackageManager,
    projectPath: string,
    packages?: string[],
    isDev = false
  ): Promise<void> {
    const commands: Record<PackageManager, string[]> = {
      npm: packages
        ? ['install', isDev ? '--save-dev' : '--save', ...packages]
        : ['install'],
      yarn: packages ? ['add', isDev ? '-D' : '', ...packages].filter(Boolean) : ['install'],
      pnpm: packages
        ? ['add', isDev ? '-D' : '', ...packages].filter(Boolean)
        : ['install'],
      bun: packages ? ['add', isDev ? '-d' : '', ...packages].filter(Boolean) : ['install'],
    };

    try {
      await execa(pm, commands[pm], { cwd: projectPath });
    } catch (error) {
      throw new Error(`Failed to install packages with ${pm}`);
    }
  },

  getInstallCommand(pm: PackageManager, packages: string[], isDev = false): string {
    const devFlag = {
      npm: '--save-dev',
      yarn: '-D',
      pnpm: '-D',
      bun: '-d',
    };

    const baseCommand = {
      npm: 'npm install',
      yarn: 'yarn add',
      pnpm: 'pnpm add',
      bun: 'bun add',
    };

    return `${baseCommand[pm]} ${isDev ? devFlag[pm] : ''} ${packages.join(' ')}`.trim();
  },

  getRunCommand(pm: PackageManager, script: string): string {
    const runCmd = {
      npm: 'npm run',
      yarn: 'yarn',
      pnpm: 'pnpm',
      bun: 'bun',
    };

    return `${runCmd[pm]} ${script}`;
  },
};