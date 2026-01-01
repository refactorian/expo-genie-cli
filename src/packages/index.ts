/**
 * Complete Package Abstraction System
 * Supports multiple packages for Icons, Animations, Forms, HTTP/API, etc.
 */

// ============================================
// ICON LIBRARIES
// ============================================
export type IconLibrary = 'lucide' | 'vector-icons' | 'heroicons' | 'feather' | 'ionicons' | 'none';

export interface IconLibraryConfig {
  name: IconLibrary;
  displayName: string;
  packages: string[];
  devPackages?: string[];
  importPattern: string;
  usage: string;
}

export const iconLibraries: Record<IconLibrary, IconLibraryConfig> = {
  lucide: {
    name: 'lucide',
    displayName: 'Lucide Icons',
    packages: ['lucide-react-native'],
    importPattern: "import { Home, User, Settings } from 'lucide-react-native'",
    usage: '<Home size={24} color="#000" />',
  },
  'vector-icons': {
    name: 'vector-icons',
    displayName: 'React Native Vector Icons',
    packages: ['react-native-vector-icons'],
    devPackages: ['@types/react-native-vector-icons'],
    importPattern: "import Icon from 'react-native-vector-icons/Ionicons'",
    usage: '<Icon name="home" size={24} color="#000" />',
  },
  heroicons: {
    name: 'heroicons',
    displayName: 'Heroicons',
    packages: ['react-native-heroicons'],
    importPattern: "import { HomeIcon } from 'react-native-heroicons/outline'",
    usage: '<HomeIcon size={24} color="#000" />',
  },
  feather: {
    name: 'feather',
    displayName: 'Feather Icons',
    packages: ['react-native-vector-icons'],
    importPattern: "import Icon from 'react-native-vector-icons/Feather'",
    usage: '<Icon name="home" size={24} color="#000" />',
  },
  ionicons: {
    name: 'ionicons',
    displayName: 'Ionicons',
    packages: ['react-native-vector-icons'],
    importPattern: "import Icon from 'react-native-vector-icons/Ionicons'",
    usage: '<Icon name="home-outline" size={24} color="#000" />',
  },
  none: {
    name: 'none',
    displayName: 'No Icons',
    packages: [],
    importPattern: '',
    usage: '',
  },
};

// ============================================
// ANIMATION LIBRARIES
// ============================================
export type AnimationLibrary = 'reanimated' | 'moti' | 'lottie' | 'skia' | 'animated-api' | 'none';

export interface AnimationLibraryConfig {
  name: AnimationLibrary;
  displayName: string;
  packages: string[];
  setupInstructions: string[];
  example: string;
}

export const animationLibraries: Record<AnimationLibrary, AnimationLibraryConfig> = {
  reanimated: {
    name: 'reanimated',
    displayName: 'React Native Reanimated',
    packages: ['react-native-reanimated'],
    setupInstructions: [
      'Add "react-native-reanimated/plugin" to babel.config.js plugins (must be last)',
    ],
    example: `import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

const offset = useSharedValue(0);
const animatedStyles = useAnimatedStyle(() => ({
  transform: [{ translateX: withSpring(offset.value * 255) }],
}));`,
  },
  moti: {
    name: 'moti',
    displayName: 'Moti',
    packages: ['moti'],
    setupInstructions: ['Moti requires React Native Reanimated'],
    example: `import { MotiView } from 'moti';

<MotiView
  from={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ type: 'timing', duration: 1000 }}
/>`,
  },
  lottie: {
    name: 'lottie',
    displayName: 'Lottie',
    packages: ['lottie-react-native'],
    setupInstructions: ['Import JSON animations'],
    example: `import LottieView from 'lottie-react-native';

<LottieView
  source={require('./animation.json')}
  autoPlay
  loop
/>`,
  },
  skia: {
    name: 'skia',
    displayName: 'React Native Skia',
    packages: ['@shopify/react-native-skia'],
    setupInstructions: ['Advanced 2D graphics'],
    example: `import { Canvas, Circle } from '@shopify/react-native-skia';

<Canvas style={{ flex: 1 }}>
  <Circle cx={100} cy={100} r={50} color="blue" />
</Canvas>`,
  },
  'animated-api': {
    name: 'animated-api',
    displayName: 'React Native Animated API',
    packages: [],
    setupInstructions: ['Built-in to React Native'],
    example: `import { Animated } from 'react-native';

const fadeAnim = new Animated.Value(0);
Animated.timing(fadeAnim, {
  toValue: 1,
  duration: 1000,
  useNativeDriver: true,
}).start();`,
  },
  none: {
    name: 'none',
    displayName: 'No Animations',
    packages: [],
    setupInstructions: [],
    example: '',
  },
};

// ============================================
// FORM LIBRARIES
// ============================================
export type FormLibrary = 'react-hook-form' | 'formik' | 'final-form' | 'none';

export interface FormLibraryConfig {
  name: FormLibrary;
  displayName: string;
  packages: string[];
  validationLibraries: string[];
  example: string;
}

export const formLibraries: Record<FormLibrary, FormLibraryConfig> = {
  'react-hook-form': {
    name: 'react-hook-form',
    displayName: 'React Hook Form',
    packages: ['react-hook-form'],
    validationLibraries: ['zod', 'yup', '@hookform/resolvers'],
    example: `import { useForm, Controller } from 'react-hook-form';

const { control, handleSubmit } = useForm();
const onSubmit = (data) => console.log(data);

<Controller
  control={control}
  name="email"
  render={({ field: { onChange, value } }) => (
    <TextInput onChangeText={onChange} value={value} />
  )}
/>`,
  },
  formik: {
    name: 'formik',
    displayName: 'Formik',
    packages: ['formik'],
    validationLibraries: ['yup'],
    example: `import { Formik } from 'formik';

<Formik
  initialValues={{ email: '' }}
  onSubmit={(values) => console.log(values)}
>
  {({ handleChange, handleSubmit, values }) => (
    <TextInput
      onChangeText={handleChange('email')}
      value={values.email}
    />
  )}
</Formik>`,
  },
  'final-form': {
    name: 'final-form',
    displayName: 'React Final Form',
    packages: ['react-final-form', 'final-form'],
    validationLibraries: [],
    example: `import { Form, Field } from 'react-final-form';

<Form
  onSubmit={onSubmit}
  render={({ handleSubmit }) => (
    <Field name="email">
      {({ input }) => <TextInput {...input} />}
    </Field>
  )}
/>`,
  },
  none: {
    name: 'none',
    displayName: 'No Form Library (useState)',
    packages: [],
    validationLibraries: [],
    example: `const [email, setEmail] = useState('');
<TextInput value={email} onChangeText={setEmail} />`,
  },
};

// ============================================
// VALIDATION LIBRARIES
// ============================================
export type ValidationLibrary = 'zod' | 'yup' | 'joi' | 'validator' | 'none';

export interface ValidationLibraryConfig {
  name: ValidationLibrary;
  displayName: string;
  packages: string[];
  example: string;
}

export const validationLibraries: Record<ValidationLibrary, ValidationLibraryConfig> = {
  zod: {
    name: 'zod',
    displayName: 'Zod',
    packages: ['zod', '@hookform/resolvers'],
    example: `import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});`,
  },
  yup: {
    name: 'yup',
    displayName: 'Yup',
    packages: ['yup'],
    example: `import * as yup from 'yup';

const schema = yup.object({
  email: yup.string().email().required(),
  password: yup.string().min(8).required(),
});`,
  },
  joi: {
    name: 'joi',
    displayName: 'Joi',
    packages: ['joi'],
    example: `import Joi from 'joi';

const schema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});`,
  },
  validator: {
    name: 'validator',
    displayName: 'Validator.js',
    packages: ['validator'],
    example: `import validator from 'validator';

const isValid = validator.isEmail(email);`,
  },
  none: {
    name: 'none',
    displayName: 'Manual Validation',
    packages: [],
    example: `const validateEmail = (email) => /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email);`,
  },
};

// ============================================
// HTTP/API LIBRARIES
// ============================================
export type HTTPLibrary = 'axios' | 'fetch' | 'react-query' | 'swr' | 'apollo' | 'urql' | 'none';

export interface HTTPLibraryConfig {
  name: HTTPLibrary;
  displayName: string;
  packages: string[];
  type: 'rest' | 'graphql' | 'any';
  example: string;
}

export const httpLibraries: Record<HTTPLibrary, HTTPLibraryConfig> = {
  axios: {
    name: 'axios',
    displayName: 'Axios',
    packages: ['axios'],
    type: 'rest',
    example: `import axios from 'axios';

const response = await axios.get('/api/users');
const data = response.data;`,
  },
  fetch: {
    name: 'fetch',
    displayName: 'Fetch API',
    packages: [],
    type: 'rest',
    example: `const response = await fetch('/api/users');
const data = await response.json();`,
  },
  'react-query': {
    name: 'react-query',
    displayName: 'TanStack Query (React Query)',
    packages: ['@tanstack/react-query'],
    type: 'any',
    example: `import { useQuery } from '@tanstack/react-query';

const { data, isLoading } = useQuery({
  queryKey: ['users'],
  queryFn: () => fetch('/api/users').then(res => res.json()),
});`,
  },
  swr: {
    name: 'swr',
    displayName: 'SWR',
    packages: ['swr'],
    type: 'any',
    example: `import useSWR from 'swr';

const { data, error } = useSWR('/api/users', fetcher);`,
  },
  apollo: {
    name: 'apollo',
    displayName: 'Apollo Client',
    packages: ['@apollo/client', 'graphql'],
    type: 'graphql',
    example: `import { useQuery, gql } from '@apollo/client';

const GET_USERS = gql\`query GetUsers { users { id name } }\`;
const { data, loading } = useQuery(GET_USERS);`,
  },
  urql: {
    name: 'urql',
    displayName: 'URQL',
    packages: ['urql', 'graphql'],
    type: 'graphql',
    example: `import { useQuery } from 'urql';

const [result] = useQuery({ query: GET_USERS });`,
  },
  none: {
    name: 'none',
    displayName: 'No HTTP Library',
    packages: [],
    type: 'any',
    example: '',
  },
};

// ============================================
// STYLING APPROACHES
// ============================================
export type StylingApproach = 'stylesheet' | 'styled-components' | 'emotion' | 'tailwind';

export interface StylingConfig {
  name: StylingApproach;
  displayName: string;
  packages: string[];
  example: string;
}

export const stylingApproaches: Record<StylingApproach, StylingConfig> = {
  stylesheet: {
    name: 'stylesheet',
    displayName: 'StyleSheet (Native)',
    packages: [],
    example: `const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
});`,
  },
  'styled-components': {
    name: 'styled-components',
    displayName: 'Styled Components',
    packages: ['styled-components'],
    example: `import styled from 'styled-components/native';

const Container = styled.View\`
  flex: 1;
  padding: 20px;
\`;`,
  },
  emotion: {
    name: 'emotion',
    displayName: 'Emotion',
    packages: ['@emotion/native'],
    example: `import styled from '@emotion/native';

const Container = styled.View\`
  flex: 1;
  padding: 20px;
\`;`,
  },
  tailwind: {
    name: 'tailwind',
    displayName: 'Tailwind CSS (NativeWind)',
    packages: ['nativewind'],
    example: `<View className="flex-1 p-5">
  <Text className="text-xl font-bold">Hello</Text>
</View>`,
  },
};

// ============================================
// NAVIGATION LIBRARIES
// ============================================
export type NavigationLibrary = 'react-navigation' | 'expo-router' | 'react-router-native';

export interface NavigationConfig {
  name: NavigationLibrary;
  displayName: string;
  packages: string[];
  example: string;
}

export const navigationLibraries: Record<NavigationLibrary, NavigationConfig> = {
  'react-navigation': {
    name: 'react-navigation',
    displayName: 'React Navigation',
    packages: [
      '@react-navigation/native',
      '@react-navigation/native-stack',
      'react-native-screens',
      'react-native-safe-area-context',
    ],
    example: `import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();`,
  },
  'expo-router': {
    name: 'expo-router',
    displayName: 'Expo Router',
    packages: ['expo-router'],
    example: `// File-based routing
// app/index.tsx
export default function Home() {
  return <View>...</View>;
}`,
  },
  'react-router-native': {
    name: 'react-router-native',
    displayName: 'React Router Native',
    packages: ['react-router-native'],
    example: `import { NativeRouter, Route } from 'react-router-native';

<NativeRouter>
  <Route path="/" component={Home} />
</NativeRouter>`,
  },
};

// ============================================
// TESTING LIBRARIES
// ============================================
export type TestingLibrary = 'jest' | 'react-native-testing-library' | 'detox' | 'maestro';

export interface TestingConfig {
  name: TestingLibrary;
  displayName: string;
  packages: string[];
  type: 'unit' | 'integration' | 'e2e';
}

export const testingLibraries: Record<TestingLibrary, TestingConfig> = {
  jest: {
    name: 'jest',
    displayName: 'Jest',
    packages: ['jest', '@types/jest'],
    type: 'unit',
  },
  'react-native-testing-library': {
    name: 'react-native-testing-library',
    displayName: 'React Native Testing Library',
    packages: ['@testing-library/react-native', '@testing-library/jest-native'],
    type: 'integration',
  },
  detox: {
    name: 'detox',
    displayName: 'Detox',
    packages: ['detox'],
    type: 'e2e',
  },
  maestro: {
    name: 'maestro',
    displayName: 'Maestro',
    packages: [],
    type: 'e2e',
  },
};

// ============================================
// UTILITY TYPES AND HELPERS
// ============================================

export interface ProjectPackages {
  uiLibrary: string;
  stateManagement: string;
  iconLibrary: string;
  animationLibrary: string;
  formLibrary: string;
  validationLibrary: string;
  httpLibrary: string;
  stylingApproach: string;
  navigationLibrary: string;
}

export const getPackageConfig = (
  category: string,
  name: string
): any => {
  const configs: Record<string, any> = {
    icon: iconLibraries,
    animation: animationLibraries,
    form: formLibraries,
    validation: validationLibraries,
    http: httpLibraries,
    styling: stylingApproaches,
    navigation: navigationLibraries,
    testing: testingLibraries,
  };
  
  return configs[category]?.[name];
};