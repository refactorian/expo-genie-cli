import { fileSystem } from '../src/utils/fs';
import os from 'os';
import path from 'path';

describe('FileSystem Utils', () => {
    const tmpDir = path.join(os.tmpdir(), `expo-genie-fs-test-${Date.now()}`);

    afterAll(async () => {
        // Cleanup
        if (await fileSystem.fileExists(tmpDir)) {
            await fileSystem.deleteDirectory(tmpDir);
        }
    });

    test('creates directory', async () => {
        await fileSystem.createDirectory(tmpDir);
        const exists = await fileSystem.isDirectory(tmpDir);
        expect(exists).toBe(true);
    });

    test('writes and reads file', async () => {
        const testFile = path.join(tmpDir, 'test.txt');
        const content = 'Hello, Expo Genie!';

        await fileSystem.writeFile(testFile, content);
        const exists = await fileSystem.fileExists(testFile);
        expect(exists).toBe(true);

        const readContent = await fileSystem.readFile(testFile);
        expect(readContent).toBe(content);
    });

    test('writes and reads JSON', async () => {
        const testFile = path.join(tmpDir, 'test.json');
        const data = { name: 'test', version: '1.0.0' };

        await fileSystem.writeJson(testFile, data);
        const readData = await fileSystem.readJson(testFile);
        expect(readData).toEqual(data);
    });

    test('lists files in directory', async () => {
        const files = await fileSystem.listFiles(tmpDir);
        expect(files.length).toBeGreaterThan(0);
        expect(files).toContain('test.txt');
        expect(files).toContain('test.json');
    });

    test('copies template/directory', async () => {
        const sourceDir = path.join(tmpDir, 'source');
        const destDir = path.join(tmpDir, 'dest');

        await fileSystem.createDirectory(sourceDir);
        await fileSystem.writeFile(path.join(sourceDir, 'file.txt'), 'content');

        await fileSystem.copyTemplate(sourceDir, destDir);

        const exists = await fileSystem.fileExists(path.join(destDir, 'file.txt'));
        expect(exists).toBe(true);
    });

    test('deletes directory', async () => {
        const deleteDir = path.join(tmpDir, 'to-delete');
        await fileSystem.createDirectory(deleteDir);

        await fileSystem.deleteDirectory(deleteDir);
        const exists = await fileSystem.isDirectory(deleteDir);
        expect(exists).toBe(false);
    });
});
