// Complete list of Expo SDK features that can be added to projects

export interface ExpoFeature {
  name: string;
  displayName: string;
  description: string;
  category: string;
  packages: string[];
  complexity: 'basic' | 'intermediate' | 'advanced';
  documentation: string;
}

export const expoFeatures: Record<string, ExpoFeature> = {
  // ============================================
  // CAMERA & MEDIA
  // ============================================
  'expo-camera': {
    name: 'expo-camera',
    displayName: 'Camera',
    description: 'Take photos and record videos',
    category: 'media',
    packages: ['expo-camera', 'expo-media-library'],
    complexity: 'intermediate',
    documentation: 'https://docs.expo.dev/versions/latest/sdk/camera/',
  },
  'expo-image-picker': {
    name: 'expo-image-picker',
    displayName: 'Image Picker',
    description: 'Pick images and videos from device library',
    category: 'media',
    packages: ['expo-image-picker'],
    complexity: 'basic',
    documentation: 'https://docs.expo.dev/versions/latest/sdk/imagepicker/',
  },
  'expo-image-manipulator': {
    name: 'expo-image-manipulator',
    displayName: 'Image Manipulator',
    description: 'Crop, resize, and manipulate images',
    category: 'media',
    packages: ['expo-image-manipulator'],
    complexity: 'intermediate',
    documentation: 'https://docs.expo.dev/versions/latest/sdk/imagemanipulator/',
  },
  'expo-video': {
    name: 'expo-video',
    displayName: 'Video',
    description: 'Video playback with controls',
    category: 'media',
    packages: ['expo-video'],
    complexity: 'intermediate',
    documentation: 'https://docs.expo.dev/versions/latest/sdk/video/',
  },
  'expo-av': {
    name: 'expo-av',
    displayName: 'Audio & Video',
    description: 'Play audio and video files',
    category: 'media',
    packages: ['expo-av'],
    complexity: 'intermediate',
    documentation: 'https://docs.expo.dev/versions/latest/sdk/av/',
  },

  // ============================================
  // LOCATION & MAPS
  // ============================================
  'expo-location': {
    name: 'expo-location',
    displayName: 'Location',
    description: 'GPS location and geofencing',
    category: 'location',
    packages: ['expo-location'],
    complexity: 'intermediate',
    documentation: 'https://docs.expo.dev/versions/latest/sdk/location/',
  },
  'react-native-maps': {
    name: 'react-native-maps',
    displayName: 'Maps',
    description: 'Display interactive maps',
    category: 'location',
    packages: ['react-native-maps'],
    complexity: 'intermediate',
    documentation: 'https://docs.expo.dev/versions/latest/sdk/map-view/',
  },

  // ============================================
  // SENSORS
  // ============================================
  'expo-accelerometer': {
    name: 'expo-accelerometer',
    displayName: 'Accelerometer',
    description: 'Device acceleration sensor',
    category: 'sensors',
    packages: ['expo-sensors'],
    complexity: 'intermediate',
    documentation: 'https://docs.expo.dev/versions/latest/sdk/accelerometer/',
  },
  'expo-gyroscope': {
    name: 'expo-gyroscope',
    displayName: 'Gyroscope',
    description: 'Device rotation sensor',
    category: 'sensors',
    packages: ['expo-sensors'],
    complexity: 'intermediate',
    documentation: 'https://docs.expo.dev/versions/latest/sdk/gyroscope/',
  },
  'expo-barometer': {
    name: 'expo-barometer',
    displayName: 'Barometer',
    description: 'Atmospheric pressure sensor',
    category: 'sensors',
    packages: ['expo-sensors'],
    complexity: 'intermediate',
    documentation: 'https://docs.expo.dev/versions/latest/sdk/barometer/',
  },
  'expo-pedometer': {
    name: 'expo-pedometer',
    displayName: 'Pedometer',
    description: 'Step counter',
    category: 'sensors',
    packages: ['expo-sensors'],
    complexity: 'basic',
    documentation: 'https://docs.expo.dev/versions/latest/sdk/pedometer/',
  },

  // ============================================
  // DEVICE HARDWARE
  // ============================================
  'expo-battery': {
    name: 'expo-battery',
    displayName: 'Battery',
    description: 'Battery status and monitoring',
    category: 'hardware',
    packages: ['expo-battery'],
    complexity: 'basic',
    documentation: 'https://docs.expo.dev/versions/latest/sdk/battery/',
  },
  'expo-brightness': {
    name: 'expo-brightness',
    displayName: 'Brightness',
    description: 'Control screen brightness',
    category: 'hardware',
    packages: ['expo-brightness'],
    complexity: 'basic',
    documentation: 'https://docs.expo.dev/versions/latest/sdk/brightness/',
  },
  'expo-haptics': {
    name: 'expo-haptics',
    displayName: 'Haptics',
    description: 'Haptic feedback',
    category: 'hardware',
    packages: ['expo-haptics'],
    complexity: 'basic',
    documentation: 'https://docs.expo.dev/versions/latest/sdk/haptics/',
  },
  'expo-screen-orientation': {
    name: 'expo-screen-orientation',
    displayName: 'Screen Orientation',
    description: 'Control screen orientation',
    category: 'hardware',
    packages: ['expo-screen-orientation'],
    complexity: 'basic',
    documentation: 'https://docs.expo.dev/versions/latest/sdk/screen-orientation/',
  },
  'expo-screen-capture': {
    name: 'expo-screen-capture',
    displayName: 'Screen Capture',
    description: 'Prevent/detect screenshots',
    category: 'hardware',
    packages: ['expo-screen-capture'],
    complexity: 'basic',
    documentation: 'https://docs.expo.dev/versions/latest/sdk/screen-capture/',
  },

  // ============================================
  // AUTHENTICATION & SECURITY
  // ============================================
  'expo-local-authentication': {
    name: 'expo-local-authentication',
    displayName: 'Biometric Auth',
    description: 'Face ID and Touch ID',
    category: 'security',
    packages: ['expo-local-authentication'],
    complexity: 'intermediate',
    documentation: 'https://docs.expo.dev/versions/latest/sdk/local-authentication/',
  },
  'expo-secure-store': {
    name: 'expo-secure-store',
    displayName: 'Secure Storage',
    description: 'Encrypted key-value storage',
    category: 'security',
    packages: ['expo-secure-store'],
    complexity: 'basic',
    documentation: 'https://docs.expo.dev/versions/latest/sdk/securestore/',
  },
  'expo-crypto': {
    name: 'expo-crypto',
    displayName: 'Crypto',
    description: 'Cryptographic operations',
    category: 'security',
    packages: ['expo-crypto'],
    complexity: 'advanced',
    documentation: 'https://docs.expo.dev/versions/latest/sdk/crypto/',
  },

  // ============================================
  // NOTIFICATIONS & COMMUNICATION
  // ============================================
  'expo-notifications': {
    name: 'expo-notifications',
    displayName: 'Notifications',
    description: 'Push and local notifications',
    category: 'communication',
    packages: ['expo-notifications'],
    complexity: 'advanced',
    documentation: 'https://docs.expo.dev/versions/latest/sdk/notifications/',
  },
  'expo-sms': {
    name: 'expo-sms',
    displayName: 'SMS',
    description: 'Send SMS messages',
    category: 'communication',
    packages: ['expo-sms'],
    complexity: 'basic',
    documentation: 'https://docs.expo.dev/versions/latest/sdk/sms/',
  },
  'expo-mail-composer': {
    name: 'expo-mail-composer',
    displayName: 'Email',
    description: 'Compose and send emails',
    category: 'communication',
    packages: ['expo-mail-composer'],
    complexity: 'basic',
    documentation: 'https://docs.expo.dev/versions/latest/sdk/mail-composer/',
  },
  'expo-contacts': {
    name: 'expo-contacts',
    displayName: 'Contacts',
    description: 'Access device contacts',
    category: 'communication',
    packages: ['expo-contacts'],
    complexity: 'intermediate',
    documentation: 'https://docs.expo.dev/versions/latest/sdk/contacts/',
  },
  'expo-calendar': {
    name: 'expo-calendar',
    displayName: 'Calendar',
    description: 'Access device calendar',
    category: 'communication',
    packages: ['expo-calendar'],
    complexity: 'intermediate',
    documentation: 'https://docs.expo.dev/versions/latest/sdk/calendar/',
  },

  // ============================================
  // SHARING & SOCIAL
  // ============================================
  'expo-sharing': {
    name: 'expo-sharing',
    displayName: 'Sharing',
    description: 'Share content to other apps',
    category: 'social',
    packages: ['expo-sharing'],
    complexity: 'basic',
    documentation: 'https://docs.expo.dev/versions/latest/sdk/sharing/',
  },
  'expo-clipboard': {
    name: 'expo-clipboard',
    displayName: 'Clipboard',
    description: 'Copy/paste clipboard access',
    category: 'social',
    packages: ['expo-clipboard'],
    complexity: 'basic',
    documentation: 'https://docs.expo.dev/versions/latest/sdk/clipboard/',
  },

  // ============================================
  // DEVICE INFO
  // ============================================
  'expo-device': {
    name: 'expo-device',
    displayName: 'Device Info',
    description: 'Device information',
    category: 'device',
    packages: ['expo-device'],
    complexity: 'basic',
    documentation: 'https://docs.expo.dev/versions/latest/sdk/device/',
  },
  'expo-application': {
    name: 'expo-application',
    displayName: 'Application',
    description: 'App metadata',
    category: 'device',
    packages: ['expo-application'],
    complexity: 'basic',
    documentation: 'https://docs.expo.dev/versions/latest/sdk/application/',
  },
  'expo-network': {
    name: 'expo-network',
    displayName: 'Network',
    description: 'Network status',
    category: 'device',
    packages: ['expo-network'],
    complexity: 'basic',
    documentation: 'https://docs.expo.dev/versions/latest/sdk/network/',
  },

  // ============================================
  // STORAGE & FILES
  // ============================================
  'expo-file-system': {
    name: 'expo-file-system',
    displayName: 'File System',
    description: 'File operations',
    category: 'storage',
    packages: ['expo-file-system'],
    complexity: 'intermediate',
    documentation: 'https://docs.expo.dev/versions/latest/sdk/filesystem/',
  },
  'expo-sqlite': {
    name: 'expo-sqlite',
    displayName: 'SQLite',
    description: 'Local SQLite database',
    category: 'storage',
    packages: ['expo-sqlite'],
    complexity: 'intermediate',
    documentation: 'https://docs.expo.dev/versions/latest/sdk/sqlite/',
  },
  'expo-document-picker': {
    name: 'expo-document-picker',
    displayName: 'Document Picker',
    description: 'Pick documents from device',
    category: 'storage',
    packages: ['expo-document-picker'],
    complexity: 'basic',
    documentation: 'https://docs.expo.dev/versions/latest/sdk/document-picker/',
  },

  // ============================================
  // PAYMENTS & MONETIZATION
  // ============================================
  'expo-in-app-purchases': {
    name: 'expo-in-app-purchases',
    displayName: 'In-App Purchases',
    description: 'iOS/Android in-app purchases',
    category: 'monetization',
    packages: ['expo-in-app-purchases'],
    complexity: 'advanced',
    documentation: 'https://docs.expo.dev/versions/latest/sdk/in-app-purchases/',
  },

  // ============================================
  // UPDATES & DISTRIBUTION
  // ============================================
  'expo-updates': {
    name: 'expo-updates',
    displayName: 'OTA Updates',
    description: 'Over-the-air updates',
    category: 'updates',
    packages: ['expo-updates'],
    complexity: 'advanced',
    documentation: 'https://docs.expo.dev/versions/latest/sdk/updates/',
  },

  // ============================================
  // WEB & BROWSER
  // ============================================
  'expo-web-browser': {
    name: 'expo-web-browser',
    displayName: 'Web Browser',
    description: 'In-app browser',
    category: 'web',
    packages: ['expo-web-browser'],
    complexity: 'basic',
    documentation: 'https://docs.expo.dev/versions/latest/sdk/webbrowser/',
  },
  'expo-linking': {
    name: 'expo-linking',
    displayName: 'Deep Linking',
    description: 'Deep links and URL schemes',
    category: 'web',
    packages: ['expo-linking'],
    complexity: 'intermediate',
    documentation: 'https://docs.expo.dev/versions/latest/sdk/linking/',
  },

  // ============================================
  // BARCODE & QR
  // ============================================
  'expo-barcode-scanner': {
    name: 'expo-barcode-scanner',
    displayName: 'Barcode Scanner',
    description: 'Scan barcodes and QR codes',
    category: 'scanning',
    packages: ['expo-barcode-scanner'],
    complexity: 'intermediate',
    documentation: 'https://docs.expo.dev/versions/latest/sdk/bar-code-scanner/',
  },

  // ============================================
  // FONTS & ASSETS
  // ============================================
  'expo-font': {
    name: 'expo-font',
    displayName: 'Custom Fonts',
    description: 'Load custom fonts',
    category: 'assets',
    packages: ['expo-font'],
    complexity: 'basic',
    documentation: 'https://docs.expo.dev/versions/latest/sdk/font/',
  },
  'expo-asset': {
    name: 'expo-asset',
    displayName: 'Asset Management',
    description: 'Manage app assets',
    category: 'assets',
    packages: ['expo-asset'],
    complexity: 'basic',
    documentation: 'https://docs.expo.dev/versions/latest/sdk/asset/',
  },
  'expo-splash-screen': {
    name: 'expo-splash-screen',
    displayName: 'Splash Screen',
    description: 'Customize splash screen',
    category: 'assets',
    packages: ['expo-splash-screen'],
    complexity: 'basic',
    documentation: 'https://docs.expo.dev/versions/latest/sdk/splash-screen/',
  },

  // ============================================
  // SPEECH & AUDIO
  // ============================================
  'expo-speech': {
    name: 'expo-speech',
    displayName: 'Text-to-Speech',
    description: 'Convert text to speech',
    category: 'audio',
    packages: ['expo-speech'],
    complexity: 'basic',
    documentation: 'https://docs.expo.dev/versions/latest/sdk/speech/',
  },

  // ============================================
  // PRINTING
  // ============================================
  'expo-print': {
    name: 'expo-print',
    displayName: 'Print',
    description: 'Print documents',
    category: 'utilities',
    packages: ['expo-print'],
    complexity: 'intermediate',
    documentation: 'https://docs.expo.dev/versions/latest/sdk/print/',
  },

  // ============================================
  // KEEP AWAKE
  // ============================================
  'expo-keep-awake': {
    name: 'expo-keep-awake',
    displayName: 'Keep Awake',
    description: 'Prevent screen from sleeping',
    category: 'utilities',
    packages: ['expo-keep-awake'],
    complexity: 'basic',
    documentation: 'https://docs.expo.dev/versions/latest/sdk/keep-awake/',
  },

  // ============================================
  // BLUR & EFFECTS
  // ============================================
  'expo-blur': {
    name: 'expo-blur',
    displayName: 'Blur View',
    description: 'Blur background effects',
    category: 'ui',
    packages: ['expo-blur'],
    complexity: 'basic',
    documentation: 'https://docs.expo.dev/versions/latest/sdk/blur-view/',
  },
  'expo-linear-gradient': {
    name: 'expo-linear-gradient',
    displayName: 'Linear Gradient',
    description: 'Gradient backgrounds',
    category: 'ui',
    packages: ['expo-linear-gradient'],
    complexity: 'basic',
    documentation: 'https://docs.expo.dev/versions/latest/sdk/linear-gradient/',
  },

  // ============================================
  // TASK MANAGER & BACKGROUND
  // ============================================
  'expo-task-manager': {
    name: 'expo-task-manager',
    displayName: 'Task Manager',
    description: 'Background tasks',
    category: 'background',
    packages: ['expo-task-manager'],
    complexity: 'advanced',
    documentation: 'https://docs.expo.dev/versions/latest/sdk/task-manager/',
  },
  'expo-background-fetch': {
    name: 'expo-background-fetch',
    displayName: 'Background Fetch',
    description: 'Fetch data in background',
    category: 'background',
    packages: ['expo-background-fetch'],
    complexity: 'advanced',
    documentation: 'https://docs.expo.dev/versions/latest/sdk/background-fetch/',
  },
};

// Categories for organizing features
export const expoCategories = {
  media: 'Camera & Media',
  location: 'Location & Maps',
  sensors: 'Sensors',
  hardware: 'Device Hardware',
  security: 'Authentication & Security',
  communication: 'Notifications & Communication',
  social: 'Sharing & Social',
  device: 'Device Info',
  storage: 'Storage & Files',
  monetization: 'Payments & Monetization',
  updates: 'Updates & Distribution',
  web: 'Web & Browser',
  scanning: 'Barcode & QR',
  assets: 'Fonts & Assets',
  audio: 'Speech & Audio',
  utilities: 'Utilities',
  ui: 'UI Effects',
  background: 'Background Tasks',
};

// Get features by category
export const getFeaturesByCategory = (category: string): ExpoFeature[] => {
  return Object.values(expoFeatures).filter(f => f.category === category);
};

// Get feature by name
export const getExpoFeature = (name: string): ExpoFeature | undefined => {
  return expoFeatures[name];
};