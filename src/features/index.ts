export interface Feature {
  name: string;
  displayName: string;
  description: string;
  dependencies: string[];
  devDependencies?: string[];
  files: FeatureFile[];
  prompts?: FeaturePrompt[];
}

export interface FeatureFile {
  path: string;
  content: string | ((answers: any) => string);
}

export interface FeaturePrompt {
  type: string;
  name: string;
  message: string;
  choices?: any[];
  default?: any;
}

export const features: Record<string, Feature> = {
  auth: {
    name: 'auth',
    displayName: 'Authentication',
    description: 'Complete authentication system with login, signup, and password reset',
    dependencies: [
      'zustand',
      'react-hook-form',
      'zod',
      '@hookform/resolvers',
      'react-native-keychain',
      'axios',
    ],
    files: [],
    prompts: [
      {
        type: 'checkbox',
        name: 'methods',
        message: 'Select authentication methods:',
        choices: [
          { name: 'Email/Password', value: 'email', checked: true },
          { name: 'Google Sign-In', value: 'google' },
          { name: 'Apple Sign-In', value: 'apple' },
          { name: 'Phone/OTP', value: 'phone' },
        ],
      },
      {
        type: 'list',
        name: 'stateManagement',
        message: 'State management:',
        choices: [
          { name: 'Zustand (recommended)', value: 'zustand' },
          { name: 'Redux Toolkit', value: 'redux' },
          { name: 'Context API', value: 'context' },
        ],
        default: 'zustand',
      },
    ],
  },

  navigation: {
    name: 'navigation',
    displayName: 'Navigation',
    description: 'React Navigation with stack, tabs, or drawer',
    dependencies: [
      '@react-navigation/native',
      '@react-navigation/native-stack',
      'react-native-screens',
      'react-native-safe-area-context',
    ],
    files: [],
    prompts: [
      {
        type: 'list',
        name: 'type',
        message: 'Navigation type:',
        choices: [
          { name: 'Stack Navigation', value: 'stack' },
          { name: 'Bottom Tabs', value: 'tabs' },
          { name: 'Drawer', value: 'drawer' },
          { name: 'Mixed (Stack + Tabs)', value: 'mixed' },
        ],
      },
    ],
  },

  database: {
    name: 'database',
    displayName: 'Database',
    description: 'Local database integration',
    dependencies: [],
    files: [],
    prompts: [
      {
        type: 'list',
        name: 'provider',
        message: 'Database provider:',
        choices: [
          { name: 'Expo SQLite', value: 'expo-sqlite' },
          { name: 'WatermelonDB', value: 'watermelon' },
          { name: 'Realm', value: 'realm' },
          { name: 'AsyncStorage', value: 'async-storage' },
        ],
      },
    ],
  },

  backend: {
    name: 'backend',
    displayName: 'Backend Integration',
    description: 'Connect to backend services',
    dependencies: [],
    files: [],
    prompts: [
      {
        type: 'list',
        name: 'service',
        message: 'Backend service:',
        choices: [
          { name: 'Supabase', value: 'supabase' },
          { name: 'Firebase', value: 'firebase' },
          { name: 'REST API', value: 'rest' },
          { name: 'GraphQL', value: 'graphql' },
        ],
      },
    ],
  },

  forms: {
    name: 'forms',
    displayName: 'Form Management',
    description: 'Form handling with validation',
    dependencies: ['react-hook-form', 'zod', '@hookform/resolvers'],
    files: [],
    prompts: [],
  },

  i18n: {
    name: 'i18n',
    displayName: 'Internationalization',
    description: 'Multi-language support',
    dependencies: ['react-i18next', 'i18next'],
    files: [],
    prompts: [
      {
        type: 'checkbox',
        name: 'languages',
        message: 'Select languages:',
        choices: [
          { name: 'English', value: 'en', checked: true },
          { name: 'Spanish', value: 'es' },
          { name: 'French', value: 'fr' },
          { name: 'German', value: 'de' },
          { name: 'Chinese', value: 'zh' },
          { name: 'Japanese', value: 'ja' },
        ],
      },
    ],
  },

  payments: {
    name: 'payments',
    displayName: 'Payments',
    description: 'Payment integration with Stripe',
    dependencies: ['@stripe/stripe-react-native'],
    files: [],
    prompts: [
      {
        type: 'list',
        name: 'provider',
        message: 'Payment provider:',
        choices: [
          { name: 'Stripe', value: 'stripe' },
          { name: 'PayPal', value: 'paypal' },
          { name: 'In-App Purchases', value: 'iap' },
        ],
      },
    ],
  },

  'ai-chat': {
    name: 'ai-chat',
    displayName: 'AI Chat',
    description: 'AI-powered chatbot integration',
    dependencies: ['axios'],
    files: [],
    prompts: [
      {
        type: 'list',
        name: 'provider',
        message: 'AI provider:',
        choices: [
          { name: 'OpenAI (GPT-4)', value: 'openai' },
          { name: 'Anthropic (Claude)', value: 'anthropic' },
          { name: 'Google (Gemini)', value: 'google' },
        ],
      },
    ],
  },

  'realtime-chat': {
    name: 'realtime-chat',
    displayName: 'Real-time Chat',
    description: 'Real-time messaging with WebSocket',
    dependencies: ['socket.io-client', 'zustand'],
    files: [],
    prompts: [],
  },

  analytics: {
    name: 'analytics',
    displayName: 'Analytics',
    description: 'Analytics and tracking integration',
    dependencies: [],
    files: [],
    prompts: [
      {
        type: 'checkbox',
        name: 'providers',
        message: 'Select analytics providers:',
        choices: [
          { name: 'Firebase Analytics', value: 'firebase' },
          { name: 'Amplitude', value: 'amplitude' },
          { name: 'Mixpanel', value: 'mixpanel' },
          { name: 'Segment', value: 'segment' },
        ],
      },
    ],
  },

  'push-notifications': {
    name: 'push-notifications',
    displayName: 'Push Notifications',
    description: 'Push notification setup',
    dependencies: ['expo-notifications'],
    files: [],
    prompts: [],
  },

  camera: {
    name: 'camera',
    displayName: 'Camera',
    description: 'Camera integration',
    dependencies: ['expo-camera', 'expo-media-library'],
    files: [],
    prompts: [],
  },

  maps: {
    name: 'maps',
    displayName: 'Maps & Location',
    description: 'Maps and geolocation features',
    dependencies: [],
    files: [],
    prompts: [
      {
        type: 'list',
        name: 'provider',
        message: 'Maps provider:',
        choices: [
          { name: 'Google Maps', value: 'google' },
          { name: 'Mapbox', value: 'mapbox' },
          { name: 'Apple Maps', value: 'apple' },
        ],
      },
    ],
  },
};

export const getFeature = (name: string): Feature | undefined => {
  return features[name];
};