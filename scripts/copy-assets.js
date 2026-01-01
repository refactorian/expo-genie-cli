const fs = require('fs-extra');
const path = require('path');

async function copyAssets() {
    const src = path.join(__dirname, '../src/data');
    const dest = path.join(__dirname, '../dist/data');

    try {
        // Remove existing dist/data directory to avoid conflicts
        if (await fs.pathExists(dest)) {
            console.log('Removing existing dist/data directory...');
            await fs.remove(dest);
        }

        // Copy fresh assets, excluding unnecessary files
        console.log('Copying assets from src/data to dist/data...');
        await fs.copy(src, dest, {
            filter: (src) => {
                // Exclude node_modules, .git, lock files, and other build artifacts
                const excludePatterns = [
                    'node_modules',
                    '.git',
                    'package-lock.json',
                    'yarn.lock',
                    'pnpm-lock.yaml',
                    'bun.lockb',
                    '.DS_Store',
                    'Thumbs.db',
                    '.vscode',
                ];

                const basename = path.basename(src);
                return !excludePatterns.includes(basename);
            }
        });
        console.log('✓ Assets copied successfully!');
    } catch (err) {
        console.error('✗ Error copying assets:', err);
        process.exit(1);
    }
}

copyAssets();
