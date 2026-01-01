import { fileSystem } from './fs';
import path from 'path';
import os from 'os';

export interface ExpoGenieConfig {
  version: string;
  projectName: string;
  template?: string;
  uiLibrary: 'nativewind' | 'paper' | 'nativebase' | 'elements' | 'tamagui' | 'none';
  stateManagement: 'zustand' | 'redux' | 'mobx' | 'jotai' | 'context' | 'none';
  features: {
    [key: string]: FeatureConfig;
  };
  preferences: {
    packageManager: string;
    autoInstall: boolean;
    gitCommit: boolean;
    typescript: boolean;
    darkMode: boolean;
  };
  screens: {
    [key: string]: ScreenConfig;
  };
  components: {
    [key: string]: ComponentConfig;
  };
}

export interface FeatureConfig {
  enabled: boolean;
  version: string;
  installedAt: string;
  uiLibrary: string;
  stateManagement: string;
  files: string[];
  dependencies: string[];
}

export interface ScreenConfig {
  type: string;
  uiLibrary: string;
  stateManagement: string;
  createdAt: string;
  filePath: string;
}

export interface ComponentConfig {
  type: string;
  uiLibrary: string;
  createdAt: string;
  filePath: string;
}

export interface GlobalConfig {
  defaultTemplate: string;
  defaultPackageManager: string;
  defaultUILibrary: string;
  defaultStateManagement: string;
  autoInstall: boolean;
  gitCommit: boolean;
  darkMode: boolean;
  recentProjects: string[];
}

const CONFIG_FILE_NAME = 'expo-genie.json';
const GLOBAL_CONFIG_DIR = path.join(os.homedir(), '.expo-genie');
const GLOBAL_CONFIG_FILE = path.join(GLOBAL_CONFIG_DIR, 'config.json');
const LOCK_FILE = path.join(GLOBAL_CONFIG_DIR, '.lock');

export const config = {
  async loadProjectConfig(projectPath: string): Promise<ExpoGenieConfig | null> {
    const configPath = path.join(projectPath, CONFIG_FILE_NAME);
    if (await fileSystem.fileExists(configPath)) {
      return await fileSystem.readJson(configPath);
    }
    return null;
  },

  async saveProjectConfig(projectPath: string, config: ExpoGenieConfig): Promise<void> {
    const configPath = path.join(projectPath, CONFIG_FILE_NAME);
    await fileSystem.writeJson(configPath, config);
  },

  async loadGlobalConfig(): Promise<GlobalConfig> {
    const defaults: GlobalConfig = {
      defaultTemplate: 'blank',
      defaultPackageManager: 'npm',
      defaultUILibrary: 'nativewind',
      defaultStateManagement: 'zustand',
      autoInstall: true,
      gitCommit: false,
      darkMode: false,
      recentProjects: [],
    };

    if (await fileSystem.fileExists(GLOBAL_CONFIG_FILE)) {
      const saved = await fileSystem.readJson(GLOBAL_CONFIG_FILE);
      return { ...defaults, ...saved };
    }

    return defaults;
  },

  async saveGlobalConfig(config: Partial<GlobalConfig>): Promise<void> {
    await fileSystem.createDirectory(GLOBAL_CONFIG_DIR);
    const existing = await this.loadGlobalConfig();
    const updated = { ...existing, ...config };
    await fileSystem.writeJson(GLOBAL_CONFIG_FILE, updated);
  },

  async updateProjectConfig(
    projectPath: string,
    updates: Partial<ExpoGenieConfig>
  ): Promise<void> {
    const existing = await this.loadProjectConfig(projectPath);
    if (existing) {
      const updated = { ...existing, ...updates };
      await this.saveProjectConfig(projectPath, updated);
    }
  },

  createDefaultConfig(
    projectName: string,
    template: string,
    uiLibrary: string,
    stateManagement: string,
    packageManager: string
  ): ExpoGenieConfig {
    return {
      version: '1.0.0',
      projectName,
      template,
      uiLibrary: uiLibrary as any,
      stateManagement: stateManagement as any,
      features: {},
      preferences: {
        packageManager,
        autoInstall: true,
        gitCommit: false,
        typescript: true,
        darkMode: false,
      },
      screens: {},
      components: {},
    };
  },

  async addFeature(
    projectPath: string,
    featureName: string,
    featureConfig: FeatureConfig
  ): Promise<void> {
    const existing = await this.loadProjectConfig(projectPath);
    if (existing) {
      existing.features[featureName] = featureConfig;
      await this.saveProjectConfig(projectPath, existing);
    }
  },

  async addScreen(
    projectPath: string,
    screenName: string,
    screenConfig: ScreenConfig
  ): Promise<void> {
    const existing = await this.loadProjectConfig(projectPath);
    if (existing) {
      existing.screens[screenName] = screenConfig;
      await this.saveProjectConfig(projectPath, existing);
    }
  },

  async addComponent(
    projectPath: string,
    componentName: string,
    componentConfig: ComponentConfig
  ): Promise<void> {
    const existing = await this.loadProjectConfig(projectPath);
    if (existing) {
      existing.components[componentName] = componentConfig;
      await this.saveProjectConfig(projectPath, existing);
    }
  },

  async removeFeature(projectPath: string, featureName: string): Promise<void> {
    const existing = await this.loadProjectConfig(projectPath);
    if (existing && existing.features[featureName]) {
      delete existing.features[featureName];
      await this.saveProjectConfig(projectPath, existing);
    }
  },

  async getUILibrary(projectPath: string): Promise<string> {
    const config = await this.loadProjectConfig(projectPath);
    return config?.uiLibrary || 'nativewind';
  },

  async getStateManagement(projectPath: string): Promise<string> {
    const config = await this.loadProjectConfig(projectPath);
    return config?.stateManagement || 'zustand';
  },

  async updateUILibrary(projectPath: string, uiLibrary: string): Promise<void> {
    await this.updateProjectConfig(projectPath, { uiLibrary: uiLibrary as any });
  },

  async updateStateManagement(projectPath: string, stateManagement: string): Promise<void> {
    await this.updateProjectConfig(projectPath, {
      stateManagement: stateManagement as any,
    });
  },

  async addRecentProject(projectPath: string): Promise<void> {
    const globalConfig = await this.loadGlobalConfig();
    const recentProjects = globalConfig.recentProjects.filter((p) => p !== projectPath);
    recentProjects.unshift(projectPath);
    if (recentProjects.length > 10) {
      recentProjects.pop();
    }
    await this.saveGlobalConfig({ recentProjects });
  },

  async isExpoGenieProject(projectPath: string): Promise<boolean> {
    const configPath = path.join(projectPath, CONFIG_FILE_NAME);
    return await fileSystem.fileExists(configPath);
  },

  async createLock(): Promise<void> {
    await fileSystem.createDirectory(GLOBAL_CONFIG_DIR);
    await fileSystem.writeFile(LOCK_FILE, Date.now().toString());
  },

  async releaseLock(): Promise<void> {
    if (await fileSystem.fileExists(LOCK_FILE)) {
      await fileSystem.deleteDirectory(LOCK_FILE);
    }
  },

  async isLocked(): Promise<boolean> {
    return await fileSystem.fileExists(LOCK_FILE);
  },
};