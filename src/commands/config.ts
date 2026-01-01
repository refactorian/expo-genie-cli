import { ui } from '../utils/ui';
import { config } from '../utils/config';

export async function configCommand(action: string, key?: string, value?: string) {
  try {
    const globalConfig = await config.loadGlobalConfig();

    switch (action) {
      case 'set':
        if (!key || value === undefined) {
          ui.error('Usage: eg config set <key> <value>');
          process.exit(1);
        }
        await config.saveGlobalConfig({ [key]: value });
        ui.success(`Set ${key} = ${value}`);
        break;

      case 'get': {
        if (!key) {
          ui.error('Usage: eg config get <key>');
          process.exit(1);
        }
        const val = (globalConfig as any)[key];
        if (val !== undefined) {
          console.log(val);
        } else {
          ui.error(`Configuration key "${key}" not found`);
        }
        break;
      }

      case 'list':
        ui.section('Global Configuration');
        ui.table(globalConfig as any);
        break;

      case 'reset':
        await config.saveGlobalConfig({
          defaultTemplate: 'blank',
          defaultPackageManager: 'npm',
          autoInstall: true,
          gitCommit: false,
        });
        ui.success('Configuration reset to defaults');
        break;

      default:
        ui.error('Invalid action. Use: set, get, list, or reset');
        process.exit(1);
    }
  } catch (error: any) {
    ui.error(error.message || 'An error occurred');
    process.exit(1);
  }
}