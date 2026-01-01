import path from 'path';
import fs from 'fs-extra';

export interface Template {
  name: string;
  displayName: string;
  description: string;
  category: 'official' | 'custom';
  features: string[];
  screens: string[];
  complexity: 'beginner' | 'intermediate' | 'advanced';
}

// Default metadata for templates without template.json
const defaultMetadata: Record<string, Partial<Template>> = {
  'default': {
    displayName: 'Default (Expo Router)',
    description: 'Recommended. Multi-screen app with Expo Router & TypeScript.',
    category: 'official',
    features: ['Expo Router', 'TypeScript', 'Expo CLI'],
    complexity: 'beginner',
  },
  'blank': {
    displayName: 'Blank',
    description: 'Minimum required dependencies. No navigation.',
    category: 'official',
    features: ['Minimal', 'JavaScript'],
    complexity: 'beginner',
  },
  'blank-typescript': {
    displayName: 'Blank (TypeScript)',
    description: 'Blank template with TypeScript configuration.',
    category: 'official',
    features: ['Minimal', 'TypeScript'],
    complexity: 'beginner',
  },
  'tabs': {
    displayName: 'Tabs (Expo Router)',
    description: 'File-based routing with Tabs layout.',
    category: 'official',
    features: ['Expo Router', 'Tabs', 'TypeScript'],
    complexity: 'intermediate',
  },
  'bare-minimum': {
    displayName: 'Bare Minimum',
    description: 'Blank with native directories (iOS/Android) pre-generated.',
    category: 'official',
    features: ['Native Code', 'Prebuild'],
    complexity: 'advanced',
  },
};

let cachedTemplates: Template[] | null = null;

export const discoverTemplates = (): Template[] => {
  if (cachedTemplates) {
    return cachedTemplates;
  }

  const templates: Template[] = [];

  // Get templates directory path (works for both src and dist)
  const templatesDir = path.join(__dirname, '../data/templates');

  // Check if directory exists
  if (!fs.existsSync(templatesDir)) {
    console.warn('Templates directory not found:', templatesDir);
    return [];
  }

  try {
    const entries = fs.readdirSync(templatesDir, { withFileTypes: true });

    for (const entry of entries) {
      if (entry.isDirectory()) {
        const templateName = entry.name;
        const templatePath = path.join(templatesDir, templateName);

        // Try to read template.json if it exists
        const metadataPath = path.join(templatePath, 'template.json');
        let metadata: Partial<Template> = {};

        if (fs.existsSync(metadataPath)) {
          try {
            metadata = fs.readJsonSync(metadataPath);
          } catch (error) {
            console.warn(`Failed to parse template.json for ${templateName}`);
          }
        }

        // Use default metadata if available
        const defaults = defaultMetadata[templateName] || {};

        // Construct template object
        const template: Template = {
          name: templateName,
          displayName: metadata.displayName || defaults.displayName || templateName,
          description: metadata.description || defaults.description || `${templateName} template`,
          category: metadata.category || defaults.category || 'custom',
          features: metadata.features || defaults.features || [],
          screens: metadata.screens || defaults.screens || [],
          complexity: metadata.complexity || defaults.complexity || 'beginner',
        };

        templates.push(template);
      }
    }
  } catch (error) {
    console.error('Error discovering templates:', error);
  }

  // Cache the result
  cachedTemplates = templates;
  return templates;
};

export const getTemplate = (name: string): Template | undefined => {
  const templates = discoverTemplates();
  return templates.find((t) => t.name === name);
};

export const getTemplatesByCategory = (category: string): Template[] => {
  const templates = discoverTemplates();
  return templates.filter((t) => t.category === category);
};

export const getAllCategories = (): string[] => {
  const templates = discoverTemplates();
  return Array.from(new Set(templates.map((t) => t.category)));
};

// Export for backwards compatibility
export const templates = discoverTemplates();