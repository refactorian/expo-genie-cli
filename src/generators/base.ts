/**
 * Base Generator Class
 * Provides common functionality for all code generators
 * Easily extensible for community contributions
 */

import { fileSystem } from '../utils/fs';
import path from 'path';

export interface GeneratorOptions {
  projectPath: string;
  name: string;
  directory?: string;
  typescript?: boolean;
  styling?: 'stylesheet' | 'tailwind' | 'styled-components';
  stateManagement?: 'none' | 'useState' | 'zustand' | 'redux';
}

export interface CodeTemplate {
  imports: string[];
  interfaces?: string[];
  component?: string;
  hooks?: string[];
  styles?: string;
  exports?: string[];
}

export abstract class BaseGenerator {
  protected options: GeneratorOptions;

  constructor(options: GeneratorOptions) {
    this.options = {
      typescript: true,
      styling: 'stylesheet',
      stateManagement: 'none',
      ...options,
    };
  }

  /**
   * Main generation method - must be implemented by subclasses
   */
  abstract generate(): Promise<string>;

  /**
   * Get file extension based on TypeScript setting
   */
  protected getFileExtension(): string {
    return this.options.typescript ? 'tsx' : 'jsx';
  }

  /**
   * Get file path for generated code
   */
  protected getFilePath(filename: string): string {
    const dir = this.options.directory || this.getDefaultDirectory();
    return path.join(this.options.projectPath, dir, filename);
  }

  /**
   * Default directory - can be overridden
   */
  protected abstract getDefaultDirectory(): string;

  /**
   * Build imports section
   */
  protected buildImports(imports: string[]): string {
    return imports.map(imp => `import ${imp};`).join('\n');
  }

  /**
   * Build TypeScript interface
   */
  protected buildInterface(name: string, props: Record<string, string>): string {
    if (!this.options.typescript) return '';

    const propsStr = Object.entries(props)
      .map(([key, type]) => `  ${key}: ${type};`)
      .join('\n');

    return `interface ${name}Props {\n${propsStr}\n}`;
  }

  /**
   * Build styles based on styling option
   */
  protected buildStyles(styleName: string, styles: Record<string, any>): string {
    if (this.options.styling === 'tailwind') {
      return ''; // Tailwind uses className
    }

    if (this.options.styling === 'styled-components') {
      return this.buildStyledComponents(styleName, styles);
    }

    return this.buildStyleSheet(styleName, styles);
  }

  /**
   * Build React Native StyleSheet
   */
  private buildStyleSheet(name: string, styles: Record<string, any>): string {
    const stylesStr = Object.entries(styles)
      .map(([key, value]) => {
        const styleProps = Object.entries(value)
          .map(([prop, val]) => `    ${prop}: ${JSON.stringify(val)},`)
          .join('\n');
        return `  ${key}: {\n${styleProps}\n  },`;
      })
      .join('\n');

    return `\nconst styles = StyleSheet.create({\n${stylesStr}\n});`;
  }

  /**
   * Build Styled Components
   */
  private buildStyledComponents(name: string, _styles: Record<string, any>): string {
    // Simplified - can be expanded
    void _styles;
    return `\nconst Styled${name} = styled.View\`\n  /* Add styles here */\n\`;`;
  }

  /**
   * Write file to disk
   */
  protected async writeFile(filename: string, content: string): Promise<string> {
    const filePath = this.getFilePath(filename);
    await fileSystem.writeFile(filePath, content);
    return filePath;
  }

  /**
   * Add import to existing file
   */
  protected async addImportToFile(filePath: string, importStatement: string): Promise<void> {
    const content = await fileSystem.readFile(filePath);
    const lines = content.split('\n');

    // Find last import line
    let lastImportIndex = 0;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith('import ')) {
        lastImportIndex = i;
      }
    }

    // Insert new import after last import
    lines.splice(lastImportIndex + 1, 0, importStatement);
    await fileSystem.writeFile(filePath, lines.join('\n'));
  }

  /**
   * Create directory if it doesn't exist
   */
  protected async ensureDirectory(dir: string): Promise<void> {
    await fileSystem.createDirectory(path.join(this.options.projectPath, dir));
  }

  /**
   * Generate component name from input
   */
  protected formatComponentName(name: string): string {
    // Convert to PascalCase
    return name
      .split(/[-_\s]/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join('');
  }

  /**
   * Generate filename from component name
   */
  protected formatFileName(name: string): string {
    const componentName = this.formatComponentName(name);
    return `${componentName}.${this.getFileExtension()}`;
  }
}

/**
 * Template Builder - Helps construct code templates
 */
export class TemplateBuilder {
  private template: CodeTemplate = {
    imports: [],
  };

  addImport(importStatement: string): this {
    this.template.imports.push(importStatement);
    return this;
  }

  addInterface(interfaceCode: string): this {
    if (!this.template.interfaces) this.template.interfaces = [];
    this.template.interfaces.push(interfaceCode);
    return this;
  }

  setComponent(componentCode: string): this {
    this.template.component = componentCode;
    return this;
  }

  addHook(hookCode: string): this {
    if (!this.template.hooks) this.template.hooks = [];
    this.template.hooks.push(hookCode);
    return this;
  }

  setStyles(stylesCode: string): this {
    this.template.styles = stylesCode;
    return this;
  }

  addExport(exportStatement: string): this {
    if (!this.template.exports) this.template.exports = [];
    this.template.exports.push(exportStatement);
    return this;
  }

  build(): string {
    const parts: string[] = [];

    // Imports
    if (this.template.imports.length > 0) {
      parts.push(this.template.imports.join('\n'));
      parts.push('');
    }

    // Interfaces
    if (this.template.interfaces && this.template.interfaces.length > 0) {
      parts.push(this.template.interfaces.join('\n\n'));
      parts.push('');
    }

    // Hooks
    if (this.template.hooks && this.template.hooks.length > 0) {
      parts.push(this.template.hooks.join('\n\n'));
      parts.push('');
    }

    // Component
    if (this.template.component) {
      parts.push(this.template.component);
    }

    // Styles
    if (this.template.styles) {
      parts.push('');
      parts.push(this.template.styles);
    }

    // Exports
    if (this.template.exports && this.template.exports.length > 0) {
      parts.push('');
      parts.push(this.template.exports.join('\n'));
    }

    return parts.join('\n');
  }

  getTemplate(): CodeTemplate {
    return this.template;
  }
}