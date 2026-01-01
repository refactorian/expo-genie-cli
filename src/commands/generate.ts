import inquirer from 'inquirer';
import { ui } from '../utils/ui';
import { ScreenGenerator, ScreenType } from '../generators/ScreenGenerator';
import { ComponentGenerator, ComponentType } from '../generators/ComponentGenerator';
import { fileSystem } from '../utils/fs';
import path from 'path';

interface GenerateOptions {
  directory?: string;
  typescript?: boolean;
}

export async function generateCommand(type?: string, name?: string, options: GenerateOptions = {}) {
  try {
    const projectPath = process.cwd();

    // Check if TypeScript is configured
    const tsConfigExists = await fileSystem.fileExists(path.join(projectPath, 'tsconfig.json'));
    const useTypescript = options.typescript !== undefined ? options.typescript : tsConfigExists;

    // Prompt for type if not provided
    if (!type) {
      const { selectedType } = await inquirer.prompt([
        {
          type: 'list',
          name: 'selectedType',
          message: 'What do you want to generate?',
          choices: [
            { name: 'Screen', value: 'screen' },
            { name: 'Component', value: 'component' },
            { name: 'Hook', value: 'hook' },
            { name: 'API Service', value: 'api' },
            { name: 'Store (State)', value: 'store' },
            { name: 'Model', value: 'model' },
          ],
        },
      ]);
      type = selectedType;
    }

    // Prompt for name if not provided
    if (!name) {
      const { inputName } = await inquirer.prompt([
        {
          type: 'input',
          name: 'inputName',
          message: `Enter ${type} name:`,
          validate: (input: string) => {
            if (!input || input.trim().length === 0) {
              return 'Name is required';
            }
            return true;
          },
        },
      ]);
      name = inputName;
    }

    switch (type) {
      case 'screen':
        await generateScreen(projectPath, name!, { ...options, typescript: useTypescript });
        break;
      case 'component':
        await generateComponent(projectPath, name!, { ...options, typescript: useTypescript });
        break;
      case 'hook':
        await generateHook(projectPath, name!, { ...options, typescript: useTypescript });
        break;
      case 'api':
        await generateApiService(projectPath, name!, { ...options, typescript: useTypescript });
        break;
      case 'store':
        await generateStore(projectPath, name!, { ...options, typescript: useTypescript });
        break;
      case 'model':
        await generateModel(projectPath, name!, { ...options, typescript: useTypescript });
        break;
      default:
        ui.error(`Unknown type: ${type}`);
        ui.info('Available types: screen, component, hook, api, store, model');
        process.exit(1);
    }
  } catch (error: any) {
    ui.error(error.message || 'An error occurred');
    process.exit(1);
  }
}

async function generateScreen(projectPath: string, name: string, options: GenerateOptions) {
  ui.section(`Generating Screen: ${name}`);

  // Ask for screen configuration
  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'screenType',
      message: 'Screen type:',
      choices: [
        { name: 'Blank (empty screen)', value: 'blank' },
        { name: 'List (scrollable list)', value: 'list' },
        { name: 'Detail (detail view)', value: 'detail' },
        { name: 'Form (input form)', value: 'form' },
        { name: 'Settings (settings page)', value: 'settings' },
        { name: 'Profile (user profile)', value: 'profile' },
      ],
    },
    {
      type: 'confirm',
      name: 'withNavigation',
      message: 'Include navigation?',
      default: true,
    },
    {
      type: 'confirm',
      name: 'withLoading',
      message: 'Include loading state?',
      default: false,
    },
    {
      type: 'confirm',
      name: 'withError',
      message: 'Include error handling?',
      default: false,
    },
  ]);

  const spinner = ui.spinner('Generating screen...');

  try {
    const generator = new ScreenGenerator({
      projectPath,
      name,
      directory: options.directory,
      typescript: options.typescript,
      screenType: answers.screenType as ScreenType,
      withNavigation: answers.withNavigation,
      withLoading: answers.withLoading,
      withError: answers.withError,
    });

    const filePath = await generator.generate();
    spinner.succeed(`Screen created: ${filePath}`);

    ui.successBox('Screen Generated Successfully!', [
      '',
      `📄 File: ${filePath}`,
      '',
      'Next steps:',
      '1. Import the screen in your navigation',
      '2. Customize the screen logic',
      '3. Add your API calls or data fetching',
    ]);
  } catch (error) {
    spinner.fail('Failed to generate screen');
    throw error;
  }
}

async function generateComponent(projectPath: string, name: string, options: GenerateOptions) {
  ui.section(`Generating Component: ${name}`);

  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'componentType',
      message: 'Component type:',
      choices: [
        { name: 'Functional (generic component)', value: 'functional' },
        { name: 'Button', value: 'button' },
        { name: 'Input', value: 'input' },
        { name: 'Card', value: 'card' },
        { name: 'Modal', value: 'modal' },
        { name: 'List Item', value: 'list-item' },
      ],
    },
    {
      type: 'confirm',
      name: 'withState',
      message: 'Include local state?',
      default: false,
    },
  ]);

  const spinner = ui.spinner('Generating component...');

  try {
    const generator = new ComponentGenerator({
      projectPath,
      name,
      directory: options.directory,
      typescript: options.typescript,
      componentType: answers.componentType as ComponentType,
      withState: answers.withState,
      withProps: true,
      withStyles: true,
    });

    const filePath = await generator.generate();
    spinner.succeed(`Component created: ${filePath}`);

    ui.successBox('Component Generated Successfully!', [
      '',
      `📄 File: ${filePath}`,
      '',
      'Next steps:',
      '1. Import the component where needed',
      '2. Customize styles and behavior',
      '3. Add any additional props',
    ]);
  } catch (error) {
    spinner.fail('Failed to generate component');
    throw error;
  }
}

async function generateHook(projectPath: string, name: string, options: GenerateOptions) {
  ui.section(`Generating Hook: ${name}`);

  const hookName = name.startsWith('use') ? name : `use${name.charAt(0).toUpperCase() + name.slice(1)}`;
  const ext = options.typescript ? 'ts' : 'js';
  const dir = options.directory || 'src/hooks';
  const filePath = path.join(projectPath, dir, `${hookName}.${ext}`);

  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'hookType',
      message: 'Hook type:',
      choices: [
        { name: 'Custom Hook (generic)', value: 'custom' },
        { name: 'API Hook (data fetching)', value: 'api' },
        { name: 'Form Hook (form management)', value: 'form' },
        { name: 'Storage Hook (local storage)', value: 'storage' },
      ],
    },
  ]);

  const spinner = ui.spinner('Generating hook...');

  try {
    let content = '';

    if (answers.hookType === 'api') {
      content = generateApiHook(hookName, options.typescript!);
    } else if (answers.hookType === 'form') {
      content = generateFormHook(hookName, options.typescript!);
    } else if (answers.hookType === 'storage') {
      content = generateStorageHook(hookName, options.typescript!);
    } else {
      content = generateCustomHook(hookName, options.typescript!);
    }

    await fileSystem.createDirectory(path.dirname(filePath));
    await fileSystem.writeFile(filePath, content);

    spinner.succeed(`Hook created: ${filePath}`);

    ui.successBox('Hook Generated Successfully!', [
      '',
      `📄 File: ${filePath}`,
      '',
      'Next steps:',
      '1. Import and use the hook in your components',
      '2. Customize the hook logic',
      '3. Add any additional functionality',
    ]);
  } catch (error) {
    spinner.fail('Failed to generate hook');
    throw error;
  }
}

function generateCustomHook(name: string, typescript: boolean): string {
  return `import { useState, useEffect } from 'react';

export function ${name}() {
  const [data, setData] = useState${typescript ? '<any>' : ''}(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState${typescript ? '<string | null>' : ''}(null);

  useEffect(() => {
    // Your hook logic here
  }, []);

  return {
    data,
    loading,
    error,
  };
}
`;
}

function generateApiHook(name: string, typescript: boolean): string {
  return `import { useState, useEffect } from 'react';

${typescript ? 'interface FetchOptions {\n  url: string;\n  method?: string;\n  body?: any;\n}\n\n' : ''}export function ${name}(${typescript ? 'options: FetchOptions' : 'options'}) {
  const [data, setData] = useState${typescript ? '<any>' : ''}(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState${typescript ? '<string | null>' : ''}(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(options.url, {
        method: options.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        body: options.body ? JSON.stringify(options.body) : undefined,
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      setData(result);
    } catch (err${typescript ? ': any' : ''}) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [options.url]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
}
`;
}

function generateFormHook(name: string, typescript: boolean): string {
  return `import { useState } from 'react';

${typescript ? 'interface FormValues {\n  [key: string]: any;\n}\n\n' : ''}export function ${name}(initialValues${typescript ? ': FormValues' : ''}) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState${typescript ? '<FormValues>' : ''}({});
  const [touched, setTouched] = useState${typescript ? '<Record<string, boolean>>' : ''}({});

  const handleChange = (name${typescript ? ': string' : ''}, value${typescript ? ': any' : ''}) => {
    setValues(prev => ({ ...prev, [name]: value }));
    
    if (touched[name]) {
      validateField(name, value);
    }
  };

  const handleBlur = (name${typescript ? ': string' : ''}) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name, values[name]);
  };

  const validateField = (name${typescript ? ': string' : ''}, value${typescript ? ': any' : ''}) => {
    // Add your validation logic here
    let error = '';
    
    if (!value) {
      error = 'This field is required';
    }
    
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = (callback${typescript ? ': (values: FormValues) => void' : ''}) => {
    // Validate all fields
    Object.keys(values).forEach(key => {
      validateField(key, values[key]);
    });

    // Check if there are any errors
    const hasErrors = Object.values(errors).some(error => error !== '');
    
    if (!hasErrors) {
      callback(values);
    }
  };

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
  };
}
`;
}

function generateStorageHook(name: string, typescript: boolean): string {
  return `import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function ${name}(key${typescript ? ': string' : ''}, initialValue${typescript ? ': any' : ''}) {
  const [storedValue, setStoredValue] = useState(initialValue);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadValue();
  }, [key]);

  const loadValue = async () => {
    try {
      const item = await AsyncStorage.getItem(key);
      if (item !== null) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.error('Error loading value:', error);
    } finally {
      setLoading(false);
    }
  };

  const setValue = async (value${typescript ? ': any' : ''}) => {
    try {
      setStoredValue(value);
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving value:', error);
    }
  };

  const removeValue = async () => {
    try {
      setStoredValue(initialValue);
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing value:', error);
    }
  };

  return {
    storedValue,
    setValue,
    removeValue,
    loading,
  };
}
`;
}

async function generateApiService(projectPath: string, name: string, options: GenerateOptions) {
  ui.section(`Generating API Service: ${name}`);

  const spinner = ui.spinner('Generating API service...');

  try {
    const ext = options.typescript ? 'ts' : 'js';
    const dir = options.directory || 'src/services';
    const fileName = `${name}.${ext}`;
    const filePath = path.join(projectPath, dir, fileName);

    const content = `import axios from 'axios';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.example.com';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const ${name}Service = {
  getAll: async () => {
    const response = await apiClient.get('/${name.toLowerCase()}');
    return response.data;
  },

  getById: async (id${options.typescript ? ': string | number' : ''}) => {
    const response = await apiClient.get(\`/${name.toLowerCase()}/\${id}\`);
    return response.data;
  },

  create: async (data${options.typescript ? ': any' : ''}) => {
    const response = await apiClient.post('/${name.toLowerCase()}', data);
    return response.data;
  },

  update: async (id${options.typescript ? ': string | number' : ''}, data${options.typescript ? ': any' : ''}) => {
    const response = await apiClient.put(\`/${name.toLowerCase()}/\${id}\`, data);
    return response.data;
  },

  delete: async (id${options.typescript ? ': string | number' : ''}) => {
    const response = await apiClient.delete(\`/${name.toLowerCase()}/\${id}\`);
    return response.data;
  },
};
`;

    await fileSystem.createDirectory(path.dirname(filePath));
    await fileSystem.writeFile(filePath, content);

    spinner.succeed(`API service created: ${filePath}`);

    ui.success('API Service generated successfully!');
  } catch (error) {
    spinner.fail('Failed to generate API service');
    throw error;
  }
}

async function generateStore(projectPath: string, name: string, options: GenerateOptions) {
  ui.section(`Generating Store: ${name}`);

  const spinner = ui.spinner('Generating store...');

  try {
    const ext = options.typescript ? 'ts' : 'js';
    const dir = options.directory || 'src/store';
    const fileName = `${name}.${ext}`;
    const filePath = path.join(projectPath, dir, fileName);

    const storeName = name.endsWith('Store') ? name : `${name}Store`;

    const content = `import { create } from 'zustand';

${options.typescript ? `interface ${storeName.charAt(0).toUpperCase() + storeName.slice(1)}State {\n  items: any[];\n  loading: boolean;\n  error: string | null;\n  fetchItems: () => Promise<void>;\n  addItem: (item: any) => void;\n  removeItem: (id: string) => void;\n  clearError: () => void;\n}\n\n` : ''}export const use${storeName.charAt(0).toUpperCase() + storeName.slice(1)} = create${options.typescript ? `<${storeName.charAt(0).toUpperCase() + storeName.slice(1)}State>` : ''}((set, get) => ({
  items: [],
  loading: false,
  error: null,

  fetchItems: async () => {
    set({ loading: true, error: null });
    try {
      // Sample implementation: replace with your API call or adapter
      set({ error: error.message, loading: false });
    }
  },

  addItem: (item) => {
    set((state) => ({ items: [...state.items, item] }));
  },

  removeItem: (id) => {
    set((state) => ({ items: state.items.filter(item => item.id !== id) }));
  },

  clearError: () => {
    set({ error: null });
  },
}));
`;

    await fileSystem.createDirectory(path.dirname(filePath));
    await fileSystem.writeFile(filePath, content);

    spinner.succeed(`Store created: ${filePath}`);

    ui.success('Store generated successfully!');
  } catch (error) {
    spinner.fail('Failed to generate store');
    throw error;
  }
}

async function generateModel(projectPath: string, name: string, options: GenerateOptions) {
  ui.section(`Generating Model: ${name}`);

  const spinner = ui.spinner('Generating model...');

  try {
    const ext = options.typescript ? 'ts' : 'js';
    const dir = options.directory || 'src/models';
    const fileName = `${name}.${ext}`;
    const filePath = path.join(projectPath, dir, fileName);

    const modelName = name.charAt(0).toUpperCase() + name.slice(1);

    const content = options.typescript
      ? `export interface ${modelName} {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  // Add your model properties here
}

export const create${modelName} = (data: Partial<${modelName}>): ${modelName} => {
  return {
    id: data.id || '',
    createdAt: data.createdAt || new Date(),
    updatedAt: data.updatedAt || new Date(),
    ...data,
  };
};

export const validate${modelName} = (model: ${modelName}): boolean => {
  // Add validation logic
  return !!model.id;
};
`
      : `export const create${modelName} = (data) => {
  return {
    id: data.id || '',
    createdAt: data.createdAt || new Date(),
    updatedAt: data.updatedAt || new Date(),
    ...data,
  };
};

export const validate${modelName} = (model) => {
  // Add validation logic
  return !!model.id;
};
`;

    await fileSystem.createDirectory(path.dirname(filePath));
    await fileSystem.writeFile(filePath, content);

    spinner.succeed(`Model created: ${filePath}`);

    ui.success('Model generated successfully!');
  } catch (error) {
    spinner.fail('Failed to generate model');
    throw error;
  }
}