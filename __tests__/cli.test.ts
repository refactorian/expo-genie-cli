import { execFileSync } from 'child_process';
import path from 'path';

describe('CLI Smoke Tests', () => {
    const distIndex = path.resolve(__dirname, '..', 'dist', 'index.js');

    test('prints help/usage', () => {
        const out = execFileSync('node', [distIndex, '--help'], { encoding: 'utf8' });
        expect(out).toMatch(/Usage:|Options:/);
        expect(out).toMatch(/EXPO GENIE CLI/i);
    });

    test('prints version', () => {
        const out = execFileSync('node', [distIndex, '--version'], { encoding: 'utf8' });
        expect(out).toMatch(/\d+\.\d+\.\d+/); // Matches version format like 1.0.1
    });

    test('shows available commands', () => {
        const out = execFileSync('node', [distIndex, '--help'], { encoding: 'utf8' });
        expect(out).toMatch(/init/);
        expect(out).toMatch(/add/);
        expect(out).toMatch(/generate/);
        expect(out).toMatch(/doctor/);
        expect(out).toMatch(/info/);
        expect(out).toMatch(/migrate/);
    });

    test('command aliases work', () => {
        const out = execFileSync('node', [distIndex, '--help'], { encoding: 'utf8' });
        expect(out).toMatch(/generate\|g/); // g is alias for generate
        expect(out).toMatch(/install\|i/); // i is alias for install
    });
});
