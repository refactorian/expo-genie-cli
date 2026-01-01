import inquirer from 'inquirer';
import { ui } from '../utils/ui';
import { config } from '../utils/config';
import { packageManager } from '../utils/packageManager';
import { getFeature, features } from '../features';
import { authGenerator } from '../features/auth/generator';
import path from 'path';

interface AddOptions {
  yes?: boolean;
  force?: boolean;
}

export async function addCommand(featureName: string, options: AddOptions = {}) {
  try {
    const projectPath = process.cwd();

    // Check if in Expo Genie CLI project
    const isGenieProject = await config.isExpoGenieProject(projectPath);
    if (!isGenieProject) {
      ui.error('Not in an Expo Genie CLI project directory.');
      ui.info('Run this command from your project root or initialize a new project with: eg init');
      process.exit(1);
    }

    // Load project config
    const projectConfig = await config.loadProjectConfig(projectPath);
    if (!projectConfig) {
      ui.error('Could not load project configuration');
      process.exit(1);
    }

    // Get current UI library and state management
    const currentUILibrary = projectConfig.uiLibrary;
    const currentStateManagement = projectConfig.stateManagement;

    ui.info(`🎨 UI Library: ${currentUILibrary}`);
    ui.info(`🔄 State Management: ${currentStateManagement}`);
    ui.newLine();

    // Prompt for feature if not provided
    if (!featureName) {
      const availableFeatures = Object.values(features).map((f) => ({
        name: `${f.displayName} - ${f.description}`,
        value: f.name,
      }));

      const { selectedFeature } = await inquirer.prompt([
        {
          type: 'list',
          name: 'selectedFeature',
          message: 'Select a feature to add:',
          choices: availableFeatures,
          pageSize: 15,
        },
      ]);

      featureName = selectedFeature;
    }

    // Check if feature exists
    const feature = getFeature(featureName);
    if (!feature) {
      ui.error(`Feature "${featureName}" not found`);
      ui.info('Available features:');
      ui.list(Object.values(features).map((f) => `${f.name} - ${f.description}`));
      process.exit(1);
    }

    // Check if feature is already added
    if (projectConfig.features[featureName] && !options.force) {
      ui.warning(`Feature "${featureName}" is already installed`);

      const existingFeature = projectConfig.features[featureName];
      const needsRegeneration =
        existingFeature.uiLibrary !== currentUILibrary ||
        existingFeature.stateManagement !== currentStateManagement;

      if (needsRegeneration) {
        ui.warning(`This feature was generated with different settings:`);
        ui.info(`  Previous UI Library: ${existingFeature.uiLibrary}`);
        ui.info(`  Current UI Library: ${currentUILibrary}`);
        ui.info(`  Previous State: ${existingFeature.stateManagement}`);
        ui.info(`  Current State: ${currentStateManagement}`);
        ui.newLine();

        const { regenerate } = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'regenerate',
            message: 'Do you want to regenerate with current settings?',
            default: true,
          },
        ]);

        if (!regenerate) {
          process.exit(0);
        }

        // Delete old files
        ui.info('🗑️  Removing old files...');
        for (const file of existingFeature.files) {
          const filePath = path.join(projectPath, file);
          try {
            await import('../utils/fs').then(fs => fs.fileSystem.deleteDirectory(filePath));
          } catch (error) {
            // File might not exist, continue
          }
        }
      } else {
        const { overwrite } = await inquirer.prompt([
          {
            type: 'confirm',
            name: 'overwrite',
            message: 'Do you want to reinstall this feature?',
            default: false,
          },
        ]);

        if (!overwrite) {
          process.exit(0);
        }
      }
    }

    ui.section(`Adding ${feature.displayName}`);
    ui.info(feature.description);
    ui.newLine();

    // Get feature-specific answers
    let answers: any = {};
    if (feature.prompts && feature.prompts.length > 0 && !options.yes) {
      answers = await inquirer.prompt(feature.prompts);
    }

    const spinner = ui.spinner('Installing dependencies...');
    const startTime = Date.now();

    try {
      const pm = projectConfig.preferences.packageManager as any;

      // Get feature-specific dependencies based on answers
      let deps = [...feature.dependencies];

      // Feature-specific dependency resolution
      if (featureName === 'navigation' && answers.type) {
        if (answers.type === 'tabs') {
          deps.push('@react-navigation/bottom-tabs');
        } else if (answers.type === 'drawer') {
          deps.push('@react-navigation/drawer', 'react-native-gesture-handler', 'react-native-reanimated');
        }
      }

      if (featureName === 'database' && answers.provider) {
        deps = getDatabaseDependencies(answers.provider);
      }

      if (featureName === 'backend' && answers.service) {
        deps = getBackendDependencies(answers.service);
      }

      // Install dependencies
      if (deps.length > 0) {
        await packageManager.install(pm, projectPath, deps);
      }

      if (feature.devDependencies && feature.devDependencies.length > 0) {
        spinner.text = 'Installing dev dependencies...';
        await packageManager.install(pm, projectPath, feature.devDependencies, true);
      }

      // Generate feature files
      spinner.text = 'Generating files...';
      const generatedFiles: string[] = [];

      if (featureName === 'auth') {
        await authGenerator.generateAuthStore(projectPath, answers.stateManagement || currentStateManagement);
        await authGenerator.generateLoginScreen(projectPath);
        await authGenerator.generateSignupScreen(projectPath);
        generatedFiles.push(
          'src/store/authStore.ts',
          'src/features/auth/screens/LoginScreen.tsx',
          'src/features/auth/screens/SignupScreen.tsx'
        );
      } else if (featureName === 'payments') {
        const { paymentsGenerator } = await import('../features/payments/generator');
        await paymentsGenerator.generateStripeSetup(projectPath);
        await paymentsGenerator.generatePaymentScreen(projectPath);
        generatedFiles.push(
          'src/config/stripe.ts',
          'src/features/payments/screens/PaymentScreen.tsx'
        );
      } else if (featureName === 'ai-chat') {
        const { aiChatGenerator } = await import('../features/ai_chat/generator');
        await aiChatGenerator.generateAIChatHook(projectPath);
        await aiChatGenerator.generateAIChatScreen(projectPath);
        generatedFiles.push(
          'src/hooks/useAIChat.ts',
          'src/features/ai-chat/screens/AIChatScreen.tsx'
        );
      } else if (featureName === 'realtime-chat') {
        const { realtimeChatGenerator } = await import('../features/realtime_chat/generator');
        await realtimeChatGenerator.generateChatStore(projectPath);
        await realtimeChatGenerator.generateChatScreen(projectPath);
        generatedFiles.push(
          'src/store/chatStore.ts',
          'src/features/realtime-chat/screens/ChatScreen.tsx'
        );
      } else if (featureName === 'camera') {
        const { cameraGenerator } = await import('../features/camera/generator');
        await cameraGenerator.generateCameraScreen(projectPath);
        await cameraGenerator.generateCameraHook(projectPath);
        generatedFiles.push(
          'src/features/camera/screens/CameraScreen.tsx',
          'src/hooks/useCamera.ts'
        );
      } else if (featureName === 'maps') {
        const { mapsGenerator } = await import('../features/maps/generator');
        await mapsGenerator.generateMapScreen(projectPath, answers.provider || 'google');
        await mapsGenerator.generateLocationHook(projectPath);
        generatedFiles.push(
          'src/features/maps/screens/MapScreen.tsx',
          'src/hooks/useLocation.ts'
        );
      }

      // Update project config with feature info
      await config.addFeature(projectPath, featureName, {
        enabled: true,
        version: '1.0.0',
        installedAt: new Date().toISOString(),
        uiLibrary: currentUILibrary,
        stateManagement: currentStateManagement,
        files: generatedFiles,
        dependencies: deps,
      });

      const elapsed = Date.now() - startTime;
      spinner.succeed(`${feature.displayName} added successfully! (${Math.floor(elapsed / 1000)}s)`);

      // Show next steps
      ui.successBox(`✨ ${feature.displayName} is ready!`, [
        '',
        '📝 Next steps:',
        '',
        ...getNextSteps(featureName, answers),
        '',
        `📖 Learn more: https://docs.expo-genie.dev/features/${featureName}`,
      ]);
    } catch (error) {
      spinner.fail(`Failed to add ${feature.displayName}`);
      throw error;
    }
  } catch (error: any) {
    ui.error(error.message || 'An error occurred');
    process.exit(1);
  }
}

function getDatabaseDependencies(provider: string): string[] {
  const deps: Record<string, string[]> = {
    'expo-sqlite': ['expo-sqlite'],
    'watermelon': ['@nozbe/watermelondb'],
    'realm': ['realm'],
    'async-storage': ['@react-native-async-storage/async-storage'],
  };
  return deps[provider] || [];
}

function getBackendDependencies(service: string): string[] {
  const deps: Record<string, string[]> = {
    'supabase': ['@supabase/supabase-js'],
    'firebase': ['@react-native-firebase/app', '@react-native-firebase/auth'],
    'rest': ['axios'],
    'graphql': ['@apollo/client', 'graphql'],
  };
  return deps[service] || [];
}

function getNextSteps(featureName: string, answers: any): string[] {
  const steps: Record<string, string[]> = {
    auth: [
      '1. Update API endpoint in src/store/authStore.ts',
      '2. Configure authentication providers',
      '3. Add auth screens to your navigation',
      '4. Test login and signup flows',
    ],
    navigation: [
      '1. Import navigation in App.tsx',
      '2. Add your screens to the navigator',
      '3. Configure navigation options',
      '4. Test navigation flow',
    ],
    database: [
      `1. Set up ${answers.provider || 'database'} connection`,
      '2. Create your database schema',
      '3. Implement CRUD operations',
      '4. Test data persistence',
    ],
    backend: [
      `1. Configure ${answers.service || 'backend'} credentials`,
      '2. Set up API endpoints',
      '3. Implement data fetching',
      '4. Add error handling',
    ],
    payments: [
      '1. Add Stripe publishable key to .env',
      '2. Set up payment backend',
      '3. Test payment flow',
      '4. Handle webhooks',
    ],
    'ai-chat': [
      '1. Add OpenAI API key to .env',
      '2. Configure AI model settings',
      '3. Test chat functionality',
      '4. Add custom prompts',
    ],
    'realtime-chat': [
      '1. Set up WebSocket server',
      '2. Configure Socket.io connection',
      '3. Test real-time messaging',
      '4. Add presence indicators',
    ],
    camera: [
      '1. Test camera permissions',
      '2. Implement photo capture',
      '3. Add image processing',
      '4. Test on device',
    ],
    maps: [
      '1. Add API keys for maps',
      '2. Test location permissions',
      '3. Implement map features',
      '4. Add markers and overlays',
    ],
  };

  return steps[featureName] || [
    '1. Review generated files',
    '2. Customize for your needs',
    '3. Test functionality',
    '4. Deploy to production',
  ];
}