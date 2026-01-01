import execa from 'execa';
import { fileSystem } from './fs';
import path from 'path';

export const git = {
  async isGitInstalled(): Promise<boolean> {
    try {
      await execa('git', ['--version']);
      return true;
    } catch {
      return false;
    }
  },

  async init(projectPath: string): Promise<void> {
    try {
      await execa('git', ['init'], { cwd: projectPath });
    } catch (error) {
      throw new Error('Failed to initialize git repository');
    }
  },

  async createGitignore(projectPath: string): Promise<void> {
    const gitignoreContent = `# Dependencies
node_modules/
.expo/
.expo-shared/

# Build
dist/
build/
*.tgz

# Environment
.env
.env.local
.env.*.local

# Logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Testing
coverage/

# Misc
*.pem
.expo-genie/
`;

    await fileSystem.writeFile(path.join(projectPath, '.gitignore'), gitignoreContent);
  },

  async initialCommit(projectPath: string, message = 'Initial commit'): Promise<void> {
    try {
      await execa('git', ['add', '.'], { cwd: projectPath });
      await execa('git', ['commit', '-m', message], { cwd: projectPath });
    } catch (error) {
      throw new Error('Failed to create initial commit');
    }
  },
};