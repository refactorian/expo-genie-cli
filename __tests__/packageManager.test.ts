import { packageManager } from '../src/utils/packageManager';
import os from 'os';
import path from 'path';
import { fileSystem } from '../src/utils/fs';

describe('Package Manager Utils', () => {
    const tmpDir = path.join(os.tmpdir(), `expo-genie-pm-test-${Date.now()}`);

    beforeAll(async () => {
        await fileSystem.createDirectory(tmpDir);
    });

    afterAll(async () => {
        if (await fileSystem.fileExists(tmpDir)) {
            await fileSystem.deleteDirectory(tmpDir);
        }
    });

    test('detects package manager from lock files', async () => {
        // Create package-lock.json
        await fileSystem.writeFile(path.join(tmpDir, 'package-lock.json'), '{}');
        const detected = await packageManager.detect(tmpDir);
        expect(detected).toBe('npm');
    });

    test('checks if package manager is available', async () => {
        // npm should always be available in CI/dev environments
        const available = await packageManager.isAvailable('npm');
        expect(typeof available).toBe('boolean');
    });

    test('generates correct install command', () => {
        const cmd = packageManager.getInstallCommand('npm', ['react', 'react-native']);
        expect(cmd).toContain('npm install');
        expect(cmd).toContain('react');
        expect(cmd).toContain('react-native');
    });

    test('generates correct install command with dev flag', () => {
        const cmd = packageManager.getInstallCommand('npm', ['typescript'], true);
        expect(cmd).toContain('npm install');
        expect(cmd).toContain('--save-dev');
        expect(cmd).toContain('typescript');
    });

    test('generates correct run command', () => {
        expect(packageManager.getRunCommand('npm', 'start')).toBe('npm run start');
        expect(packageManager.getRunCommand('yarn', 'start')).toBe('yarn start');
        expect(packageManager.getRunCommand('pnpm', 'start')).toBe('pnpm start');
        expect(packageManager.getRunCommand('bun', 'start')).toBe('bun start');
    });
});
