import path from 'path';
import { fileSystem } from './fs';

export const templateManager = {
    async getTemplatePath(templateName: string): Promise<string> {
        // Works for both src/ (dev) and dist/ (prod) structure
        // src/utils/templateManager.ts -> src/data/templates
        // dist/utils/templateManager.js -> dist/data/templates
        const templatePath = path.join(__dirname, '../data/templates', templateName);

        if (!(await fileSystem.isDirectory(templatePath))) {
            throw new Error(`Template "${templateName}" not found at ${templatePath}`);
        }

        return templatePath;
    },

    async copyTemplate(templateName: string, targetPath: string): Promise<void> {
        const sourcePath = await this.getTemplatePath(templateName);
        await fileSystem.copyTemplate(sourcePath, targetPath);
    }
};
