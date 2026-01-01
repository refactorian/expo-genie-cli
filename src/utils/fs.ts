import fs from 'fs-extra';
import path from 'path';


export const fileSystem = {
  async createDirectory(dirPath: string): Promise<void> {
    try {
      await fs.ensureDir(dirPath);
    } catch (error) {
      throw new Error(`Failed to create directory: ${dirPath}`);
    }
  },

  async writeFile(filePath: string, content: string): Promise<void> {
    try {
      await fs.ensureDir(path.dirname(filePath));
      await fs.writeFile(filePath, content, 'utf-8');
    } catch (error) {
      throw new Error(`Failed to write file: ${filePath}`);
    }
  },

  async readFile(filePath: string): Promise<string> {
    try {
      return await fs.readFile(filePath, 'utf-8');
    } catch (error) {
      throw new Error(`Failed to read file: ${filePath}`);
    }
  },

  async fileExists(filePath: string): Promise<boolean> {
    try {
      await fs.access(filePath);
      return true;
    } catch {
      return false;
    }
  },

  async copyTemplate(sourcePath: string, destPath: string): Promise<void> {
    try {
      await fs.copy(sourcePath, destPath);
    } catch (error) {
      throw new Error(`Failed to copy template`);
    }
  },

  async readJson(filePath: string): Promise<any> {
    try {
      return await fs.readJson(filePath);
    } catch (error) {
      throw new Error(`Failed to read JSON file: ${filePath}`);
    }
  },

  async writeJson(filePath: string, data: any): Promise<void> {
    try {
      await fs.writeJson(filePath, data, { spaces: 2 });
    } catch (error) {
      throw new Error(`Failed to write JSON file: ${filePath}`);
    }
  },

  async appendToFile(filePath: string, content: string): Promise<void> {
    try {
      await fs.appendFile(filePath, content);
    } catch (error) {
      throw new Error(`Failed to append to file: ${filePath}`);
    }
  },

  async deleteDirectory(dirPath: string): Promise<void> {
    try {
      await fs.remove(dirPath);
    } catch (error) {
      throw new Error(`Failed to delete directory: ${dirPath}`);
    }
  },

  async isDirectory(dirPath: string): Promise<boolean> {
    try {
      const stats = await fs.stat(dirPath);
      return stats.isDirectory();
    } catch {
      return false;
    }
  },

  async listFiles(dirPath: string): Promise<string[]> {
    try {
      return await fs.readdir(dirPath);
    } catch (error) {
      throw new Error(`Failed to list files in: ${dirPath}`);
    }
  },
};