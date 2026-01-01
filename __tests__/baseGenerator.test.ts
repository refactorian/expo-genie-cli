import os from 'os';
import path from 'path';
import { BaseGenerator, TemplateBuilder } from '../src/generators/base';
import { fileSystem } from '../src/utils/fs';
import { config } from '../src/utils/config';

class TestGenerator extends BaseGenerator {
    constructor(options: any) {
        super(options);
    }

    async generate(): Promise<string> {
        const filename = this.formatFileName(this.options.name);
        await this.writeFile(filename, '');
        return filename;
    }

    protected getDefaultDirectory(): string {
        return 'src/screens';
    }
}

describe('BaseGenerator utilities', () => {
    test('formatComponentName and formatFileName', () => {
        const g = new TestGenerator({ projectPath: '/tmp', name: 'my-awesome_component', typescript: true });
        expect((g as any).formatComponentName('my-awesome_component')).toBe('MyAwesomeComponent');
        expect((g as any).formatFileName('my-awesome_component')).toMatch(/MyAwesomeComponent\.(tsx|jsx)$/);
    });

    test('TemplateBuilder builds code sections', () => {
        const b = new TemplateBuilder();
        b.addImport("import React from 'react';");
        b.addInterface('interface FooProps { id: string; }');
        b.setComponent('export default function Foo() { return null; }');
        b.setStyles('\nconst styles = {}');

        const output = b.build();
        expect(output).toContain("import React from 'react';");
        expect(output).toContain('interface FooProps');
        expect(output).toContain('export default function Foo');
        expect(output).toContain('const styles');
    });
});

describe('Config storage', () => {
    const tmpDir = path.join(os.tmpdir(), `expo-genie-test-${Date.now()}`);

    test('create and load project config', async () => {
        await fileSystem.createDirectory(tmpDir);

        const cfg = config.createDefaultConfig('test-app', 'blank', 'nativewind', 'zustand', 'npm');
        await config.saveProjectConfig(tmpDir, cfg);

        const exists = await config.isExpoGenieProject(tmpDir);
        expect(exists).toBe(true);

        const loaded = await config.loadProjectConfig(tmpDir);
        expect(loaded).not.toBeNull();
        expect(loaded?.projectName).toBe('test-app');

        await fileSystem.deleteDirectory(tmpDir);
    });
});
