import chalk from 'chalk';
import ora, { Ora } from 'ora';
import boxen from 'boxen';
import gradient from 'gradient-string';

export const ui = {
  success: (message: string) => {
    console.log(chalk.green('✓'), message);
  },

  error: (message: string) => {
    console.log(chalk.red('✗'), message);
  },

  warning: (message: string) => {
    console.log(chalk.yellow('⚠'), message);
  },

  info: (message: string) => {
    console.log(chalk.blue('ℹ'), message);
  },

  spinner: (text: string): Ora => {
    return ora({
      text,
      color: 'cyan',
      spinner: 'dots',
    }).start();
  },

  box: (message: string, options: any = {}) => {
    console.log(
      boxen(message, {
        padding: 1,
        margin: 1,
        borderStyle: 'round',
        borderColor: 'cyan',
        ...options,
      })
    );
  },

  successBox: (title: string, content: string[]) => {
    const message = [
      chalk.green.bold(`✅ ${title}`),
      '',
      ...content.map(line => chalk.gray(line)),
    ].join('\n');

    console.log(
      boxen(message, {
        padding: 1,
        margin: 1,
        borderStyle: 'round',
        borderColor: 'green',
      })
    );
  },

  section: (title: string) => {
    console.log('\n' + chalk.cyan.bold(`${title}`));
    console.log(chalk.gray('─'.repeat(50)));
  },

  gradient: (text: string) => {
    return gradient.pastel(text);
  },

  header: (text: string) => {
    console.log('\n' + gradient.pastel.multiline(text) + '\n');
  },

  list: (items: string[]) => {
    items.forEach(item => {
      console.log(chalk.gray('  •'), item);
    });
  },

  table: (data: Record<string, string>) => {
    const maxKeyLength = Math.max(...Object.keys(data).map(k => k.length));
    Object.entries(data).forEach(([key, value]) => {
      console.log(
        chalk.cyan(key.padEnd(maxKeyLength + 2)),
        chalk.gray('→'),
        chalk.white(value)
      );
    });
  },

  divider: () => {
    console.log(chalk.gray('─'.repeat(60)));
  },

  newLine: () => {
    console.log('');
  },
};

export const formatTime = (ms: number): string => {
  if (ms < 1000) return `${ms}ms`;
  const seconds = Math.floor(ms / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
};