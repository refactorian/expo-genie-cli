/**
 * Screen Generator
 * Generates React Native screens with various configurations
 */

import { BaseGenerator, TemplateBuilder, GeneratorOptions } from './base';

export type ScreenType = 'blank' | 'list' | 'detail' | 'form' | 'settings' | 'profile';

export interface ScreenGeneratorOptions extends GeneratorOptions {
  screenType?: ScreenType;
  withNavigation?: boolean;
  withHeader?: boolean;
  withLoading?: boolean;
  withError?: boolean;
}

export class ScreenGenerator extends BaseGenerator {
  private screenOptions: ScreenGeneratorOptions;

  constructor(options: ScreenGeneratorOptions) {
    super(options);
    this.screenOptions = {
      screenType: 'blank',
      withNavigation: true,
      withHeader: true,
      withLoading: false,
      withError: false,
      ...options,
    };
  }

  protected getDefaultDirectory(): string {
    return 'src/screens';
  }

  async generate(): Promise<string> {
    const componentName = this.formatComponentName(this.options.name);
    const screenName = componentName.endsWith('Screen')
      ? componentName
      : `${componentName}Screen`;

    const builder = new TemplateBuilder();

    // Add imports
    this.addImports(builder);

    // Add interfaces
    if (this.options.typescript) {
      this.addInterfaces(builder, screenName);
    }

    // Add component
    this.addComponent(builder, screenName);

    // Add styles
    this.addStyles(builder);

    const content = builder.build();
    const filename = this.formatFileName(screenName);
    const filePath = await this.writeFile(filename, content);

    return filePath;
  }

  private addImports(builder: TemplateBuilder): void {
    const imports = [
      "React, { useState, useEffect } from 'react'",
      "{ View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native'",
    ];

    if (this.screenOptions.withNavigation) {
      imports.push("{ useNavigation } from '@react-navigation/native'");
    }

    if (this.options.styling === 'tailwind') {
      // Tailwind doesn't need StyleSheet import
    }

    imports.forEach(imp => builder.addImport(`import ${imp};`));
  }

  private addInterfaces(builder: TemplateBuilder, screenName: string): void {
    let propsInterface = `interface ${screenName}Props {`;

    if (this.screenOptions.withNavigation) {
      propsInterface += `\n  navigation?: any;`;
      propsInterface += `\n  route?: any;`;
    }

    propsInterface += `\n}`;

    builder.addInterface(propsInterface);
  }

  private addComponent(builder: TemplateBuilder, screenName: string): void {
    const { screenType } = this.screenOptions;

    let component = '';

    switch (screenType) {
      case 'list':
        component = this.generateListScreen(screenName);
        break;
      case 'detail':
        component = this.generateDetailScreen(screenName);
        break;
      case 'form':
        component = this.generateFormScreen(screenName);
        break;
      case 'settings':
        component = this.generateSettingsScreen(screenName);
        break;
      case 'profile':
        component = this.generateProfileScreen(screenName);
        break;
      default:
        component = this.generateBlankScreen(screenName);
    }

    builder.setComponent(component);
  }

  private generateBlankScreen(screenName: string): string {
    const propsType = this.options.typescript ? `: ${screenName}Props` : '';

    return `export default function ${screenName}(props${propsType}) {
  ${this.screenOptions.withLoading ? "const [loading, setLoading] = useState(false);" : ""}
  ${this.screenOptions.withError ? "const [error, setError] = useState<string | null>(null);" : ""}
  ${this.screenOptions.withNavigation ? "const navigation = useNavigation();" : ""}

  useEffect(() => {
    // Component mounted
    return () => {
      // Cleanup
    };
  }, []);

  ${this.screenOptions.withLoading ? `
  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }
  ` : ""}

  ${this.screenOptions.withError ? `
  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }
  ` : ""}

  return (
    <View style={styles.container}>
      ${this.screenOptions.withHeader ? `<Text style={styles.title}>${screenName}</Text>` : ""}
      <Text style={styles.subtitle}>Start building your screen!</Text>
    </View>
  );
}`;
  }

  private generateListScreen(screenName: string): string {
    const propsType = this.options.typescript ? `: ${screenName}Props` : '';

    return `export default function ${screenName}(props${propsType}) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  ${this.screenOptions.withNavigation ? "const navigation = useNavigation();" : ""}

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Sample data — replace with your data fetching logic
        { id: 1, title: 'Item 1' },
        { id: 2, title: 'Item 2' },
        { id: 3, title: 'Item 3' },
      ]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>${screenName}</Text>
      {data.map((item) => (
        <TouchableOpacity key={item.id} style={styles.item}>
          <Text style={styles.itemText}>{item.title}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}`;
  }

  private generateDetailScreen(screenName: string): string {
    const propsType = this.options.typescript ? `: ${screenName}Props` : '';

    return `export default function ${screenName}(props${propsType}) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  ${this.screenOptions.withNavigation ? "const navigation = useNavigation();" : ""}
  ${this.screenOptions.withNavigation ? "const { id } = props.route?.params || {};" : ""}

  useEffect(() => {
    fetchDetails();
  }, []);

  const fetchDetails = async () => {
    try {
      // Sample data — replace with fetching details using 'id'
      setData({
        id: 1,
        title: 'Item Details',
        description: 'This is a detailed view',
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{data?.title}</Text>
      <Text style={styles.description}>{data?.description}</Text>
    </ScrollView>
  );
}`;
  }

  private generateFormScreen(screenName: string): string {
    const propsType = this.options.typescript ? `: ${screenName}Props` : '';

    return `export default function ${screenName}(props${propsType}) {
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(false);
  ${this.screenOptions.withNavigation ? "const navigation = useNavigation();" : ""}

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Sample: replace with form submission implementation (API call or local handler)
      console.log('Form submitted:', formData);
      ${this.screenOptions.withNavigation ? "navigation.goBack();" : ""}
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>${screenName}</Text>
      
      {/* Add your form fields here */}
      
      <TouchableOpacity 
        style={styles.button} 
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Submitting...' : 'Submit'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}`;
  }

  private generateSettingsScreen(screenName: string): string {
    const propsType = this.options.typescript ? `: ${screenName}Props` : '';

    return `export default function ${screenName}(props${propsType}) {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>
        
        <TouchableOpacity style={styles.item}>
          <Text style={styles.itemText}>Notifications</Text>
          {/* Add Switch component here */}
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.item}>
          <Text style={styles.itemText}>Dark Mode</Text>
          {/* Add Switch component here */}
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        
        <TouchableOpacity style={styles.item}>
          <Text style={styles.itemText}>Edit Profile</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.item}>
          <Text style={styles.itemText}>Change Password</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.item}>
          <Text style={styles.itemText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}`;
  }

  private generateProfileScreen(screenName: string): string {
    const propsType = this.options.typescript ? `: ${screenName}Props` : '';

    return `export default function ${screenName}(props${propsType}) {
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    avatar: null,
  });

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {user.name.split(' ').map(n => n[0]).join('')}
          </Text>
        </View>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.email}>{user.email}</Text>
      </View>

      <View style={styles.section}>
        <TouchableOpacity style={styles.item}>
          <Text style={styles.itemText}>Edit Profile</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.item}>
          <Text style={styles.itemText}>Settings</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.item}>
          <Text style={styles.itemText}>Help & Support</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}`;
  }

  private addStyles(builder: TemplateBuilder): void {
    const { screenType } = this.screenOptions;

    const baseStyles: Record<string, any> = {
      container: {
        flex: 1,
        backgroundColor: '#fff',
      },
      title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        padding: 20,
      },
    };

    // Add screen-specific styles
    let styles = { ...baseStyles };

    switch (screenType) {
      case 'list':
        styles = {
          ...styles,
          item: {
            padding: 16,
            borderBottomWidth: 1,
            borderBottomColor: '#e0e0e0',
          },
          itemText: {
            fontSize: 16,
          },
        };
        break;
      case 'detail':
        styles = {
          ...styles,
          description: {
            fontSize: 16,
            color: '#666',
            padding: 20,
          },
        };
        break;
      case 'form':
        styles = {
          ...styles,
          button: {
            backgroundColor: '#007AFF',
            padding: 15,
            borderRadius: 8,
            margin: 20,
            alignItems: 'center',
          },
          buttonText: {
            color: '#fff',
            fontSize: 16,
            fontWeight: '600',
          },
        };
        break;
      case 'settings':
      case 'profile':
        styles = {
          ...styles,
          section: {
            marginTop: 20,
          },
          sectionTitle: {
            fontSize: 18,
            fontWeight: '600',
            padding: 20,
            paddingBottom: 10,
            color: '#666',
          },
          item: {
            padding: 16,
            borderBottomWidth: 1,
            borderBottomColor: '#e0e0e0',
            backgroundColor: '#fff',
          },
          itemText: {
            fontSize: 16,
          },
        };
        break;
      default:
        styles = {
          ...styles,
          subtitle: {
            fontSize: 16,
            color: '#666',
            padding: 20,
          },
        };
    }

    if (this.screenOptions.withError) {
      styles.errorText = {
        color: 'red',
        fontSize: 16,
        textAlign: 'center',
      };
    }

    if (screenType === 'profile') {
      styles = {
        ...styles,
        header: {
          alignItems: 'center',
          padding: 20,
          borderBottomWidth: 1,
          borderBottomColor: '#e0e0e0',
        },
        avatar: {
          width: 80,
          height: 80,
          borderRadius: 40,
          backgroundColor: '#007AFF',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 10,
        },
        avatarText: {
          color: '#fff',
          fontSize: 32,
          fontWeight: 'bold',
        },
        name: {
          fontSize: 24,
          fontWeight: 'bold',
          marginTop: 10,
        },
        email: {
          fontSize: 16,
          color: '#666',
          marginTop: 5,
        },
      };
    }

    const stylesCode = this.buildStyles('styles', styles);
    builder.setStyles(stylesCode);
  }
}