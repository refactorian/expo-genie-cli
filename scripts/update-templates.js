/**
 * Template Update Script
 * 
 * This script updates all official Expo templates to their latest versions.
 * 
 * Usage:
 *   npm run update-templates
 * 
 * What it does:
 * 1. For each official template (default, blank, blank-typescript, tabs, bare-minimum):
 *    - Creates a backup with timestamp
 *    - Removes the original template directory
 *    - Generates fresh template using create-expo-app@latest
 *    - Removes .git folder from generated template
 *    - If successful, deletes backup; if failed, restores from backup
 * 
 * Requirements:
 * - Node.js 16+
 * - npm/npx available in PATH
 */

const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');

const TEMPLATES_DIR = path.join(__dirname, '../src/data/templates');

// Official templates with their create-expo-app template names
const OFFICIAL_TEMPLATES = [
    { name: 'default', createExpoTemplate: 'default' },
    { name: 'blank', createExpoTemplate: 'blank' },
    { name: 'blank-typescript', createExpoTemplate: 'blank-typescript' },
    { name: 'tabs', createExpoTemplate: 'tabs' },
    { name: 'bare-minimum', createExpoTemplate: 'bare-minimum' },
];

async function updateTemplate(template) {
    const templatePath = path.join(TEMPLATES_DIR, template.name);
    const backupPath = `${templatePath}.backup-${Date.now()}`;

    console.log(`\n📦 Updating template: ${template.name}`);
    console.log(`   Template path: ${templatePath}`);

    try {
        // Step 1: Create backup if template exists
        if (await fs.pathExists(templatePath)) {
            console.log(`   Creating backup...`);
            await fs.copy(templatePath, backupPath);
            console.log(`   ✓ Backup created: ${backupPath}`);

            // Remove original
            console.log(`   Removing original template...`);
            await fs.remove(templatePath);
            console.log(`   ✓ Original removed`);
        } else {
            console.log(`   Template doesn't exist, creating new...`);
        }

        // Step 2: Generate fresh template
        console.log(`   Generating fresh template from create-expo-app...`);
        const command = `npx create-expo-app@latest ${templatePath} --template ${template.createExpoTemplate} --yes`;

        execSync(command, {
            stdio: 'inherit',
            cwd: path.dirname(templatePath),
        });

        console.log(`   ✓ Template generated`);

        // Step 3: Clean up unnecessary files
        console.log(`   Cleaning up unnecessary files...`);
        const filesToRemove = [
            path.join(templatePath, '.git'),
            path.join(templatePath, 'node_modules'),
            path.join(templatePath, 'package-lock.json'),
            path.join(templatePath, 'yarn.lock'),
            path.join(templatePath, 'pnpm-lock.yaml'),
            path.join(templatePath, 'bun.lockb'),
            path.join(templatePath, '.DS_Store'),
            path.join(templatePath, '.vscode'),
        ];

        for (const fileToRemove of filesToRemove) {
            if (await fs.pathExists(fileToRemove)) {
                await fs.remove(fileToRemove);
            }
        }
        console.log(`   ✓ Cleanup complete`);

        // Step 4: Success - remove backup
        if (await fs.pathExists(backupPath)) {
            console.log(`   Cleaning up backup...`);
            await fs.remove(backupPath);
        }

        console.log(`   ✅ ${template.name} updated successfully!`);
        return true;

    } catch (error) {
        console.error(`   ❌ Failed to update ${template.name}:`, error.message);

        // Restore from backup if it exists
        if (await fs.pathExists(backupPath)) {
            console.log(`   Restoring from backup...`);
            try {
                // Remove failed attempt
                if (await fs.pathExists(templatePath)) {
                    await fs.remove(templatePath);
                }
                // Restore backup
                await fs.copy(backupPath, templatePath);
                await fs.remove(backupPath);
                console.log(`   ✓ Restored from backup`);
            } catch (restoreError) {
                console.error(`   ❌ Failed to restore backup:`, restoreError.message);
            }
        }

        return false;
    }
}

async function main() {
    console.log('🧞 Expo Genie CLI - Template Update Script');
    console.log('==========================================\n');
    console.log(`Templates directory: ${TEMPLATES_DIR}\n`);

    // Ensure templates directory exists
    await fs.ensureDir(TEMPLATES_DIR);

    const results = {
        success: [],
        failed: [],
    };

    // Update each template
    for (const template of OFFICIAL_TEMPLATES) {
        const success = await updateTemplate(template);
        if (success) {
            results.success.push(template.name);
        } else {
            results.failed.push(template.name);
        }
    }

    // Summary
    console.log('\n==========================================');
    console.log('📊 Update Summary');
    console.log('==========================================\n');
    console.log(`✅ Successfully updated: ${results.success.length}/${OFFICIAL_TEMPLATES.length}`);
    if (results.success.length > 0) {
        results.success.forEach(name => console.log(`   - ${name}`));
    }

    if (results.failed.length > 0) {
        console.log(`\n❌ Failed to update: ${results.failed.length}/${OFFICIAL_TEMPLATES.length}`);
        results.failed.forEach(name => console.log(`   - ${name}`));
        process.exit(1);
    }

    console.log('\n✨ All templates updated successfully!');
    console.log('\n💡 Next steps:');
    console.log('   1. Run: npm run build');
    console.log('   2. Test with: eg init test-project\n');
}

main().catch(error => {
    console.error('\n❌ Fatal error:', error);
    process.exit(1);
});
