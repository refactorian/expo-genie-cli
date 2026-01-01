# Expo Genie CLI 🧞

The ultimate CLI tool for Expo app development. Scaffolds production-ready apps, generates code, and integrates complex features in seconds.

## Installation

```bash
npm install -g @refactorian/expo-genie-cli
```

After installation, verify that the CLI is installed correctly by checking the version. The CLI can be invoked using any of these aliases:

- **`expo-genie`** - Full command name
- **`eg`** - Short alias (recommended for daily use)
- **`🧞`** - Genie emoji alias (fun alternative!)

```bash
expo-genie --version
# or
eg --version
# or
🧞 --version
```

All three commands should output the same version number (e.g., `1.0.1`).

## Commands

### Initialize a Project
```bash
eg init [project-name]
# Interactive mode
eg init
```

**Options:**
- `-t, --template <template>` - Specify template (default, tabs, blank, blank-typescript, bare-minimum)
- `-p, --package-manager <pm>` - Package manager (npm, yarn, pnpm, bun)
- `--skip-install` - Skip dependency installation
- `--skip-git` - Skip git initialization

### Add Features
Add full-stack features to your project:
```bash
eg add [feature]
# Interactive mode
eg add

# Direct usage
eg add auth
eg add payments
eg add camera
eg add maps
```

**Options:**
- `-y, --yes` - Skip prompts and use defaults
- `--force` - Force regeneration of existing features

**Available Features:**
- `auth` - Authentication (Email/Password, Google, Apple, Phone/OTP)
- `payments` - Stripe payment integration
- `ai-chat` - AI chat interface
- `camera` - Camera integration
- `maps` - Maps integration
- `analytics` - Analytics tracking
- `push-notifications` - Push notifications

### Generate Code
Generate boilerplate code (alias: `g`):
```bash
eg generate [type] [name]
# Interactive mode
eg generate

# Direct usage
eg g screen Profile
eg g component Button
eg g hook useAuth
eg g store User
eg g api UserService
eg g model User
```

**Options:**
- `-d, --directory <dir>` - Output directory

### Install Packages
Install and configure packages:
```bash
eg install [package]
# Interactive mode
eg install

# Direct usage
eg i nativewind
eg i lucide-icons
```

### Migrate
Migrate UI libraries or state management:
```bash
eg migrate [type]
# Interactive mode
eg migrate

# Migrate UI library
eg migrate ui --from paper --to nativewind

# Migrate state management
eg migrate state --from redux --to zustand
```

**Options:**
- `--from <library>` - Source library
- `--to <library>` - Target library
- `--force` - Force migration without confirmation

### Project Health
Check project health and configuration:
```bash
eg doctor
```

Verifies:
- package.json existence
- Core dependencies
- TypeScript configuration
- node_modules installation
- Expo configuration (app.json)
- Git initialization

### Project Info
Display project details and installed features:
```bash
eg info
```

### Clean
Clean project cache and build artifacts:
```bash
eg clean
eg clean --all  # Also removes node_modules
```

### Configuration
Manage global CLI configuration:
```bash
eg config set <key> <value>
eg config get <key>
eg config list
eg config reset
```

## Templates

Available project templates:
- **default** - Expo Router with TypeScript (recommended)
- **tabs** - Expo Router with tabs navigation
- **blank** - Minimal JavaScript setup
- **blank-typescript** - Minimal TypeScript setup
- **bare-minimum** - With native directories pre-generated

## Development

### Build the CLI
```bash
npm run ci
```

### Link for Local Development
```bash
npm link
```

### Update Templates
Refresh official templates to latest Expo versions:
```bash
npm run update-templates
```

## Contributing

Contributions are welcome. Please feel free to submit a Pull Request.

## License

MIT
