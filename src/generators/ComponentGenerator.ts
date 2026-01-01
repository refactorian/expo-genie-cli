/**
 * Component Generator
 * Generates reusable React Native components
 */

import { BaseGenerator, TemplateBuilder, GeneratorOptions } from './base';

export type ComponentType = 'functional' | 'card' | 'button' | 'input' | 'modal' | 'list-item';

export interface ComponentGeneratorOptions extends GeneratorOptions {
  componentType?: ComponentType;
  withProps?: boolean;
  withState?: boolean;
  withStyles?: boolean;
}

export class ComponentGenerator extends BaseGenerator {
  private componentOptions: ComponentGeneratorOptions;

  constructor(options: ComponentGeneratorOptions) {
    super(options);
    this.componentOptions = {
      componentType: 'functional',
      withProps: true,
      withState: false,
      withStyles: true,
      ...options,
    };
  }

  protected getDefaultDirectory(): string {
    return 'src/components';
  }

  async generate(): Promise<string> {
    const componentName = this.formatComponentName(this.options.name);
    const builder = new TemplateBuilder();

    this.addImports(builder);

    if (this.options.typescript && this.componentOptions.withProps) {
      this.addInterfaces(builder, componentName);
    }

    this.addComponent(builder, componentName);

    if (this.componentOptions.withStyles) {
      this.addStyles(builder);
    }

    const content = builder.build();
    const filename = this.formatFileName(componentName);
    const filePath = await this.writeFile(filename, content);

    return filePath;
  }

  private addImports(builder: TemplateBuilder): void {
    const imports = ["React from 'react'"];

    if (this.componentOptions.withState) {
      imports[0] = "React, { useState } from 'react'";
    }

    const viewImports = ['View', 'Text'];

    if (this.componentOptions.componentType === 'button') {
      viewImports.push('TouchableOpacity');
    }
    if (this.componentOptions.componentType === 'input') {
      viewImports.push('TextInput');
    }
    if (this.componentOptions.componentType === 'modal') {
      viewImports.push('Modal', 'TouchableOpacity');
    }

    if (this.componentOptions.withStyles) {
      viewImports.push('StyleSheet');
    }

    imports.push(`{ ${viewImports.join(', ')} } from 'react-native'`);

    imports.forEach(imp => builder.addImport(`import ${imp};`));
  }

  private addInterfaces(builder: TemplateBuilder, componentName: string): void {
    const { componentType } = this.componentOptions;
    let props: Record<string, string> = {};

    switch (componentType) {
      case 'button':
        props = {
          title: 'string',
          onPress: '() => void',
          disabled: 'boolean',
          loading: 'boolean',
        };
        break;
      case 'input':
        props = {
          value: 'string',
          onChangeText: '(text: string) => void',
          placeholder: 'string',
          secureTextEntry: 'boolean',
        };
        break;
      case 'card':
        props = {
          title: 'string',
          description: 'string',
          onPress: '() => void',
        };
        break;
      case 'modal':
        props = {
          visible: 'boolean',
          onClose: '() => void',
          children: 'React.ReactNode',
        };
        break;
      case 'list-item':
        props = {
          title: 'string',
          subtitle: 'string',
          onPress: '() => void',
        };
        break;
      default:
        props = {
          children: 'React.ReactNode',
        };
    }

    const interfaceCode = this.buildInterface(componentName, props);
    builder.addInterface(interfaceCode);
  }

  private addComponent(builder: TemplateBuilder, componentName: string): void {
    const { componentType } = this.componentOptions;
    let component = '';

    switch (componentType) {
      case 'button':
        component = this.generateButton(componentName);
        break;
      case 'input':
        component = this.generateInput(componentName);
        break;
      case 'card':
        component = this.generateCard(componentName);
        break;
      case 'modal':
        component = this.generateModal(componentName);
        break;
      case 'list-item':
        component = this.generateListItem(componentName);
        break;
      default:
        component = this.generateFunctional(componentName);
    }

    builder.setComponent(component);
  }

  private generateFunctional(name: string): string {
    const propsType = this.options.typescript ? `: ${name}Props` : '';

    return `export default function ${name}(props${propsType}) {
  ${this.componentOptions.withState ? "const [state, setState] = useState();" : ""}
  
  return (
    <View style={styles.container}>
      {props.children}
    </View>
  );
}`;
  }

  private generateButton(name: string): string {
    const propsType = this.options.typescript ? `: ${name}Props` : '';
    const destructure = this.options.typescript
      ? '{ title, onPress, disabled = false, loading = false }'
      : 'props';

    return `export default function ${name}(${destructure}${propsType}) {
  return (
    <TouchableOpacity
      style={[styles.button, ${!this.options.typescript ? 'props.' : ''}disabled && styles.buttonDisabled]}
      onPress={${!this.options.typescript ? 'props.' : ''}onPress}
      disabled={${!this.options.typescript ? 'props.' : ''}disabled || ${!this.options.typescript ? 'props.' : ''}loading}
    >
      <Text style={styles.buttonText}>
        {${!this.options.typescript ? 'props.' : ''}loading ? 'Loading...' : ${!this.options.typescript ? 'props.' : ''}title}
      </Text>
    </TouchableOpacity>
  );
}`;
  }

  private generateInput(name: string): string {
    const propsType = this.options.typescript ? `: ${name}Props` : '';
    const destructure = this.options.typescript
      ? '{ value, onChangeText, placeholder = "", secureTextEntry = false }'
      : 'props';

    return `export default function ${name}(${destructure}${propsType}) {
  return (
    <TextInput
      style={styles.input}
      value={${!this.options.typescript ? 'props.' : ''}value}
      onChangeText={${!this.options.typescript ? 'props.' : ''}onChangeText}
      placeholder={${!this.options.typescript ? 'props.' : ''}placeholder}
      secureTextEntry={${!this.options.typescript ? 'props.' : ''}secureTextEntry}
    />
  );
}`;
  }

  private generateCard(name: string): string {
    const propsType = this.options.typescript ? `: ${name}Props` : '';
    const destructure = this.options.typescript
      ? '{ title, description, onPress }'
      : 'props';

    return `export default function ${name}(${destructure}${propsType}) {
  return (
    <TouchableOpacity style={styles.card} onPress={${!this.options.typescript ? 'props.' : ''}onPress}>
      <Text style={styles.title}>{${!this.options.typescript ? 'props.' : ''}title}</Text>
      <Text style={styles.description}>{${!this.options.typescript ? 'props.' : ''}description}</Text>
    </TouchableOpacity>
  );
}`;
  }

  private generateModal(name: string): string {
    const propsType = this.options.typescript ? `: ${name}Props` : '';
    const destructure = this.options.typescript
      ? '{ visible, onClose, children }'
      : 'props';

    return `export default function ${name}(${destructure}${propsType}) {
  return (
    <Modal
      visible={${!this.options.typescript ? 'props.' : ''}visible}
      transparent
      animationType="fade"
      onRequestClose={${!this.options.typescript ? 'props.' : ''}onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <TouchableOpacity style={styles.closeButton} onPress={${!this.options.typescript ? 'props.' : ''}onClose}>
            <Text style={styles.closeText}>×</Text>
          </TouchableOpacity>
          {${!this.options.typescript ? 'props.' : ''}children}
        </View>
      </View>
    </Modal>
  );
}`;
  }

  private generateListItem(name: string): string {
    const propsType = this.options.typescript ? `: ${name}Props` : '';
    const destructure = this.options.typescript
      ? '{ title, subtitle, onPress }'
      : 'props';

    return `export default function ${name}(${destructure}${propsType}) {
  return (
    <TouchableOpacity style={styles.item} onPress={${!this.options.typescript ? 'props.' : ''}onPress}>
      <Text style={styles.title}>{${!this.options.typescript ? 'props.' : ''}title}</Text>
      {${!this.options.typescript ? 'props.' : ''}subtitle && <Text style={styles.subtitle}>{${!this.options.typescript ? 'props.' : ''}subtitle}</Text>}
    </TouchableOpacity>
  );
}`;
  }

  private addStyles(builder: TemplateBuilder): void {
    const { componentType } = this.componentOptions;
    let styles: Record<string, any> = {};

    switch (componentType) {
      case 'button':
        styles = {
          button: {
            backgroundColor: '#007AFF',
            padding: 15,
            borderRadius: 8,
            alignItems: 'center',
          },
          buttonDisabled: {
            opacity: 0.5,
          },
          buttonText: {
            color: '#fff',
            fontSize: 16,
            fontWeight: '600',
          },
        };
        break;
      case 'input':
        styles = {
          input: {
            borderWidth: 1,
            borderColor: '#ddd',
            borderRadius: 8,
            padding: 12,
            fontSize: 16,
          },
        };
        break;
      case 'card':
        styles = {
          card: {
            backgroundColor: '#fff',
            borderRadius: 8,
            padding: 16,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
            marginBottom: 12,
          },
          title: {
            fontSize: 18,
            fontWeight: 'bold',
            marginBottom: 8,
          },
          description: {
            fontSize: 14,
            color: '#666',
          },
        };
        break;
      case 'modal':
        styles = {
          modalOverlay: {
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
          },
          modalContent: {
            backgroundColor: '#fff',
            borderRadius: 12,
            padding: 20,
            width: '80%',
            maxHeight: '80%',
          },
          closeButton: {
            position: 'absolute',
            top: 10,
            right: 10,
            zIndex: 1,
          },
          closeText: {
            fontSize: 30,
            color: '#666',
          },
        };
        break;
      case 'list-item':
        styles = {
          item: {
            padding: 16,
            borderBottomWidth: 1,
            borderBottomColor: '#e0e0e0',
          },
          title: {
            fontSize: 16,
            fontWeight: '500',
          },
          subtitle: {
            fontSize: 14,
            color: '#666',
            marginTop: 4,
          },
        };
        break;
      default:
        styles = {
          container: {
            // Your styles here
          },
        };
    }

    const stylesCode = this.buildStyles('styles', styles);
    builder.setStyles(stylesCode);
  }
}