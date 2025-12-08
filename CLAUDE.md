# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

!!! First of all: always using chinese.

## Project Overview

SoybeanAdmin is a Vue 3 + TypeScript admin template built with:
- **Framework**: Vue 3.5.22 with Composition API
- **Build Tool**: Vite 7.1.12
- **Language**: TypeScript 5.9.3
- **UI Library**: Naive UI 2.43.1
- **CSS**: UnoCSS with SCSS preprocessor
- **State Management**: Pinia 3.0.3
- **Router**: Vue Router 4.6.3 with Elegant Router for auto-generation
- **HTTP Client**: Axios and Alova (custom packages)
- **Package Manager**: pnpm (>=10.5.0) with monorepo structure
- **Node Version**: >=20.19.0

## Essential Commands

```bash
# Development
pnpm dev           # Start dev server (test mode, port 9527)
pnpm dev:prod      # Start dev server with production API

# Build
pnpm build         # Build for production
pnpm build:test    # Build for test environment

# Code Quality
pnpm lint          # Run ESLint with auto-fix
pnpm typecheck     # Run TypeScript type checking

# Route Generation
pnpm gen-route     # Generate routes using Elegant Router

# Git
pnpm commit        # Interactive commit with conventional commits
pnpm commit:zh     # Interactive commit in Chinese

# Other
pnpm preview       # Preview production build (port 9725)
pnpm cleanup       # Clean up dependencies and cache
pnpm update-pkg    # Update package dependencies
```

## Architecture

### Directory Structure

- **src/**: Main application source code
  - **router/elegant/**: Auto-generated route files by Elegant Router
  - **views/**: Page components organized by feature modules
  - **layouts/**: Layout components for different page structures
  - **components/**: Reusable UI components (basic and advanced)
  - **store/**: Pinia stores for state management
  - **service/**: Axios-based API service layer
  - **service-alova/**: Alova-based API service layer (alternative)
  - **locales/**: i18n translation files (zh-CN, en-US)
  - **theme/**: Theme configuration and settings
  - **hooks/**: Composable functions
  - **utils/**: Utility functions
  - **typings/**: TypeScript type definitions
  - **constants/**: Application constants and enums

- **packages/**: Monorepo packages
  - **@sa/scripts**: Build and CLI scripts
  - **@sa/axios**: Axios wrapper with interceptors
  - **@sa/alova**: Alova HTTP client wrapper
  - **@sa/hooks**: Shared Vue composables
  - **@sa/materials**: Material components
  - **@sa/utils**: Shared utilities
  - **@sa/color**: Color utilities
  - **@sa/uno-preset**: UnoCSS preset configuration

### Key Architectural Patterns

1. **Route Management**: Uses @elegant-router/vue for automatic route generation from file structure. Routes are defined in src/views and auto-generated into src/router/elegant/

2. **API Layer**: Dual HTTP client support (Axios and Alova). API services are organized by feature modules with TypeScript interfaces for request/response types.

3. **State Management**: Pinia stores organized by domain (auth, app, theme, tab, route). Stores handle business logic and API communication.

4. **Theme System**: Comprehensive theme configuration supporting dark mode, color schemes, layout variants, and component tokens. Theme settings persist in localStorage.

5. **Permission System**: Role-based access control with route-level and button-level permissions. Supports both static and dynamic route generation.

6. **Component Organization**:
   - Basic components in src/components/common/
   - Business components in src/components/advanced/
   - Custom materials in packages/materials/

7. **Type Safety**: Strict TypeScript configuration with comprehensive type definitions. Auto-generated route types from Elegant Router.

## Development Workflow

1. Routes are automatically generated from the views directory structure
2. API services follow a modular pattern with TypeScript interfaces
3. Components use Vue 3 Composition API with setup syntax
4. Styles use UnoCSS utility classes with SCSS for complex styling
5. Git commits must follow conventional commit format (enforced by git hooks)
6. Pre-commit hooks run typecheck and lint automatically

## Environment Variables

- `.env`: Base configuration
- `.env.test`: Test environment (default for dev)
- `.env.prod`: Production environment
- Key variables: `VITE_BASE_URL`, `VITE_SERVICE_BASE_URL`, `VITE_PROXY_PATTERN`

## Important Notes

- This project uses pnpm workspaces - do not use npm or yarn
- Automatic route generation requires following the views directory naming convention
- Theme configuration is stored in src/theme/settings.ts
- API mocking uses ApiFox online mock data
- Supports both static routes (defined in code) and dynamic routes (from backend)