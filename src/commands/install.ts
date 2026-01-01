import inquirer from 'inquirer';
import { ui } from '../utils/ui';
import { config } from '../utils/config';
import { packageManager } from '../utils/packageManager';
import { fileSystem } from '../utils/fs';
import path from 'path';

interface PackageConfig {
  name: string;
  displayName: string;
  packages: string[];
  devPackages?: string[];
  configFiles?: { path: string; content: string }[];
  instructions?: string[];
}

const packageConfigs: Record<string, PackageConfig> = {
  tailwind: {
    name: 'tailwind',
    displayName: 'NativeWind (Tailwind CSS)',
    packages: ['nativewind'],
    devPackages: ['tailwindcss'],
    configFiles: [
      {
        path: 'tailwind.config.js',
        content: `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}`,
      },
    ],
    instructions: [
      'Add to babel.config.js plugins: "nativewind/babel"',
      'Import NativeWind types in your app',
    ],
  },

  lucide: {
    name: 'lucide',
    displayName: 'Lucide Icons',
    packages: ['lucide-react-native'],
    instructions: [
      'Import icons like: import { Home, User } from "lucide-react-native"',
      'Use: <Home color="black" size={24} />',
    ],
  },

  paper: {
    name: 'paper',
    displayName: 'React Native Paper',
    packages: ['react-native-paper', 'react-native-safe-area-context'],
    configFiles: [
      {
        path: 'src/theme/paper-theme.ts',
        content: `import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#6200ee',
    secondary: '#03dac6',
  },
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#bb86fc',
    secondary: '#03dac6',
  },
};`,
      },
    ],
    instructions: [
      'Wrap your app with <PaperProvider theme={theme}>',
      'Import theme from src/theme/paper-theme.ts',
    ],
  },

  'vector-icons': {
    name: 'vector-icons',
    displayName: 'React Native Vector Icons',
    packages: ['react-native-vector-icons'],
    devPackages: ['@types/react-native-vector-icons'],
    instructions: [
      'Import icons like: import Icon from "react-native-vector-icons/FontAwesome"',
      'Use: <Icon name="rocket" size={30} color="#900" />',
    ],
  },

  zustand: {
    name: 'zustand',
    displayName: 'Zustand State Management',
    packages: ['zustand'],
    configFiles: [
      {
        path: 'src/store/example.ts',
        content: `import { create } from 'zustand';

interface ExampleState {
  count: number;
  increment: () => void;
  decrement: () => void;
}

export const useExampleStore = create<ExampleState>((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
}));`,
      },
    ],
    instructions: [
      'Use the store in components: const { count, increment } = useExampleStore()',
    ],
  },

  reanimated: {
    name: 'reanimated',
    displayName: 'React Native Reanimated',
    packages: ['react-native-reanimated'],
    instructions: [
      'Add to babel.config.js plugins: "react-native-reanimated/plugin"',
      'This must be listed last in plugins array',
    ],
  },

  axios: {
    name: 'axios',
    displayName: 'Axios HTTP Client',
    packages: ['axios'],
    configFiles: [
      {
        path: 'src/api/client.ts',
        content: `import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.API_URL || 'https://api.example.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    // Add auth token here
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle errors
    return Promise.reject(error);
  }
);

export default apiClient;`,
      },
    ],
    instructions: [
      'Import and use: import apiClient from "./src/api/client"',
      'Make requests: apiClient.get("/endpoint")',
    ],
  },
};

export async function installCommand(packageName?: string) {
  try {
    const projectPath = process.cwd();

    // Load project config
    const projectConfig = await config.loadProjectConfig(projectPath);
    if (!projectConfig) {
      ui.error('Not in an Expo Genie CLI project directory');
      process.exit(1);
    }

    // Prompt for package if not provided
    if (!packageName) {
      const availablePackages = Object.keys(packageConfigs).map((key) => ({
        name: `${packageConfigs[key].displayName}`,
        value: key,
      }));

      const { selectedPackage } = await inquirer.prompt([
        {
          type: 'list',
          name: 'selectedPackage',
          message: 'Select a package to install:',
          choices: availablePackages,
          pageSize: 15,
        },
      ]);

      packageName = selectedPackage;
    }

    // Get package config
    const pkgConfig = packageConfigs[packageName!];
    if (!pkgConfig) {
      ui.error(`Package "${packageName}" not found or not supported yet`);
      ui.info('Available packages:');
      ui.list(Object.keys(packageConfigs));
      process.exit(1);
    }

    ui.section(`Installing ${pkgConfig.displayName}`);

    const spinner = ui.spinner('Installing packages...');
    const startTime = Date.now();

    try {
      const pm = projectConfig.preferences.packageManager as any;

      // Install main packages
      await packageManager.install(pm, projectPath, pkgConfig.packages);

      // Install dev packages
      if (pkgConfig.devPackages && pkgConfig.devPackages.length > 0) {
        spinner.text = 'Installing dev dependencies...';
        await packageManager.install(pm, projectPath, pkgConfig.devPackages, true);
      }

      // Create config files
      if (pkgConfig.configFiles) {
        spinner.text = 'Creating configuration files...';
        for (const file of pkgConfig.configFiles) {
          const filePath = path.join(projectPath, file.path);
          await fileSystem.writeFile(filePath, file.content);
        }
      }

      const elapsed = Date.now() - startTime;
      spinner.succeed(`${pkgConfig.displayName} installed successfully! (${Math.floor(elapsed / 1000)}s)`);

      // Show instructions
      if (pkgConfig.instructions && pkgConfig.instructions.length > 0) {
        ui.successBox(`${pkgConfig.displayName} is ready!`, [
          '',
          '📝 Additional steps:',
          '',
          ...pkgConfig.instructions.map((i, idx) => `${idx + 1}. ${i}`),
        ]);
      } else {
        ui.success('Package installed and configured!');
      }
    } catch (error) {
      spinner.fail(`Failed to install ${pkgConfig.displayName}`);
      throw error;
    }
  } catch (error: any) {
    ui.error(error.message || 'An error occurred');
    process.exit(1);
  }
}