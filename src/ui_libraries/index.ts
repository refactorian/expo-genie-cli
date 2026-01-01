/**
 * UI Library Abstraction System
 * Supports multiple UI libraries and provides conversion between them
 */

export type UILibrary = 'nativewind' | 'paper' | 'nativebase' | 'elements' | 'tamagui' | 'none';

export interface UILibraryConfig {
  name: UILibrary;
  displayName: string;
  packages: string[];
  devPackages?: string[];
  configFiles?: { path: string; content: string }[];
  setupInstructions: string[];
}

export interface ComponentDefinition {
  imports: string[];
  component: string;
  styles?: string;
}

export const uiLibraries: Record<UILibrary, UILibraryConfig> = {
  nativewind: {
    name: 'nativewind',
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
    setupInstructions: [
      'Add to babel.config.js plugins: "nativewind/babel"',
      'Import className from nativewind',
    ],
  },

  paper: {
    name: 'paper',
    displayName: 'React Native Paper',
    packages: ['react-native-paper', 'react-native-safe-area-context'],
    setupInstructions: [
      'Wrap app with <PaperProvider>',
      'Import components from react-native-paper',
    ],
  },

  nativebase: {
    name: 'nativebase',
    displayName: 'NativeBase',
    packages: ['native-base'],
    setupInstructions: [
      'Wrap app with <NativeBaseProvider>',
      'Import components from native-base',
    ],
  },

  elements: {
    name: 'elements',
    displayName: 'React Native Elements',
    packages: ['@rneui/themed', '@rneui/base'],
    setupInstructions: [
      'Wrap app with <ThemeProvider>',
      'Import components from @rneui/themed',
    ],
  },

  tamagui: {
    name: 'tamagui',
    displayName: 'Tamagui',
    packages: ['tamagui', '@tamagui/core'],
    setupInstructions: [
      'Configure tamagui.config.ts',
      'Wrap app with <TamaguiProvider>',
    ],
  },

  none: {
    name: 'none',
    displayName: 'React Native (No UI Library)',
    packages: [],
    setupInstructions: ['Use React Native core components'],
  },
};

/**
 * UI Library Component Generators
 * Each UI library has specific component generation logic
 */

export class UILibraryAdapter {
  constructor(private uiLibrary: UILibrary) {}

  generateButton(props: {
    title: string;
    onPress: string;
    variant?: 'primary' | 'secondary' | 'outlined';
  }): ComponentDefinition {
    switch (this.uiLibrary) {
      case 'nativewind':
        return this.generateNativeWindButton(props);
      case 'paper':
        return this.generatePaperButton(props);
      case 'nativebase':
        return this.generateNativeBaseButton(props);
      case 'elements':
        return this.generateElementsButton(props);
      case 'tamagui':
        return this.generateTamaguiButton(props);
      default:
        return this.generateDefaultButton(props);
    }
  }

  private generateNativeWindButton(props: any): ComponentDefinition {
    const bgColor = props.variant === 'outlined' 
      ? 'bg-transparent border-2 border-blue-500' 
      : props.variant === 'secondary'
      ? 'bg-gray-500'
      : 'bg-blue-500';

    return {
      imports: ["import { TouchableOpacity, Text } from 'react-native'"],
      component: `<TouchableOpacity 
  className="${bgColor} py-3 px-6 rounded-lg active:opacity-80"
  onPress={${props.onPress}}
>
  <Text className="text-white text-center font-semibold">
    {${props.title}}
  </Text>
</TouchableOpacity>`,
    };
  }

  private generatePaperButton(props: any): ComponentDefinition {
    const mode = props.variant === 'outlined' ? 'outlined' : 'contained';
    return {
      imports: ["import { Button } from 'react-native-paper'"],
      component: `<Button 
  mode="${mode}" 
  onPress={${props.onPress}}
>
  {${props.title}}
</Button>`,
    };
  }

  private generateNativeBaseButton(props: any): ComponentDefinition {
    const variant = props.variant === 'outlined' ? 'outline' : 'solid';
    return {
      imports: ["import { Button } from 'native-base'"],
      component: `<Button 
  variant="${variant}" 
  onPress={${props.onPress}}
>
  {${props.title}}
</Button>`,
    };
  }

  private generateElementsButton(props: any): ComponentDefinition {
    const type = props.variant === 'outlined' ? 'outline' : 'solid';
    return {
      imports: ["import { Button } from '@rneui/themed'"],
      component: `<Button 
  type="${type}" 
  onPress={${props.onPress}}
  title={${props.title}}
/>`,
    };
  }

  private generateTamaguiButton(props: any): ComponentDefinition {
    return {
      imports: ["import { Button } from 'tamagui'"],
      component: `<Button 
  onPress={${props.onPress}}
>
  {${props.title}}
</Button>`,
    };
  }

  private generateDefaultButton(props: any): ComponentDefinition {
    return {
      imports: ["import { TouchableOpacity, Text, StyleSheet } from 'react-native'"],
      component: `<TouchableOpacity 
  style={styles.button} 
  onPress={${props.onPress}}
>
  <Text style={styles.buttonText}>{${props.title}}</Text>
</TouchableOpacity>`,
      styles: `button: {
  backgroundColor: '#007AFF',
  paddingVertical: 12,
  paddingHorizontal: 24,
  borderRadius: 8,
},
buttonText: {
  color: '#fff',
  fontSize: 16,
  fontWeight: '600',
  textAlign: 'center',
},`,
    };
  }

  generateTextInput(props: {
    placeholder: string;
    value: string;
    onChangeText: string;
    type?: 'text' | 'password' | 'email';
  }): ComponentDefinition {
    switch (this.uiLibrary) {
      case 'nativewind':
        return {
          imports: ["import { TextInput } from 'react-native'"],
          component: `<TextInput
  className="border border-gray-300 rounded-lg px-4 py-3 text-base"
  placeholder="${props.placeholder}"
  value={${props.value}}
  onChangeText={${props.onChangeText}}
  ${props.type === 'password' ? 'secureTextEntry' : ''}
  ${props.type === 'email' ? 'keyboardType="email-address"' : ''}
/>`,
        };
      case 'paper':
        return {
          imports: ["import { TextInput } from 'react-native-paper'"],
          component: `<TextInput
  mode="outlined"
  label="${props.placeholder}"
  value={${props.value}}
  onChangeText={${props.onChangeText}}
  ${props.type === 'password' ? 'secureTextEntry' : ''}
/>`,
        };
      case 'nativebase':
        return {
          imports: ["import { Input } from 'native-base'"],
          component: `<Input
  placeholder="${props.placeholder}"
  value={${props.value}}
  onChangeText={${props.onChangeText}}
  ${props.type === 'password' ? 'type="password"' : ''}
/>`,
        };
      default:
        return {
          imports: ["import { TextInput, StyleSheet } from 'react-native'"],
          component: `<TextInput
  style={styles.input}
  placeholder="${props.placeholder}"
  value={${props.value}}
  onChangeText={${props.onChangeText}}
  ${props.type === 'password' ? 'secureTextEntry' : ''}
/>`,
          styles: `input: {
  borderWidth: 1,
  borderColor: '#ddd',
  borderRadius: 8,
  padding: 12,
  fontSize: 16,
},`,
        };
    }
  }

  generateCard(props: { title?: string; content: string }): ComponentDefinition {
    switch (this.uiLibrary) {
      case 'nativewind':
        return {
          imports: ["import { View, Text } from 'react-native'"],
          component: `<View className="bg-white rounded-lg p-4 shadow-md mb-4">
  ${props.title ? `<Text className="text-xl font-bold mb-2">{${props.title}}</Text>` : ''}
  {${props.content}}
</View>`,
        };
      case 'paper':
        return {
          imports: ["import { Card, Title, Paragraph } from 'react-native-paper'"],
          component: `<Card>
  <Card.Content>
    ${props.title ? `<Title>{${props.title}}</Title>` : ''}
    {${props.content}}
  </Card.Content>
</Card>`,
        };
      case 'nativebase':
        return {
          imports: ["import { Box, Heading } from 'native-base'"],
          component: `<Box bg="white" rounded="lg" p={4} shadow={2} mb={4}>
  ${props.title ? `<Heading size="md">{${props.title}}</Heading>` : ''}
  {${props.content}}
</Box>`,
        };
      default:
        return {
          imports: ["import { View, Text, StyleSheet } from 'react-native'"],
          component: `<View style={styles.card}>
  ${props.title ? `<Text style={styles.cardTitle}>{${props.title}}</Text>` : ''}
  {${props.content}}
</View>`,
          styles: `card: {
  backgroundColor: '#fff',
  borderRadius: 8,
  padding: 16,
  marginBottom: 16,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 3,
},
cardTitle: {
  fontSize: 20,
  fontWeight: 'bold',
  marginBottom: 8,
},`,
        };
    }
  }
}

export const getUILibrary = (name: string): UILibraryConfig | undefined => {
  return uiLibraries[name as UILibrary];
};

export const createUIAdapter = (uiLibrary: UILibrary): UILibraryAdapter => {
  return new UILibraryAdapter(uiLibrary);
};