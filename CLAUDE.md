# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React-based merchant portal application for managing sales, reports, customers, and store operations. It uses TypeScript, Vite, React Suite (RSuite) UI components, and Zustand for state management.

**IMPORTANT**: When working on Menu Manager / Menu Composer features, ALWAYS read `MENU_COMPOSER_REFERENCE.md` first. This file contains critical information about replicating the original menu_composer.html functionality.

## Essential Commands

```bash
# Development
npm run dev              # Start development server (Vite)

# Building
npm run build            # TypeScript check + production build
npm run preview          # Preview production build

# Code Quality
npm run lint             # Run ESLint on all files

# Testing & Documentation
npm run storybook        # Start Storybook development server (if configured)

# Component Creation
npm run create-component path/ComponentName    # Create new component with proper structure
npm run create-less path/componentName         # Create LESS file for component
npm run validate-components                    # Validate component naming conventions

# LESS Compilation
python buildcss.py       # Rebuild index.less from all LESS files (required after adding styles)
python3 buildcss.py      # Alternative Python command
```

## Architecture Overview

### Technology Stack
- **React 18.2** with TypeScript 5.7
- **Vite** for build tooling
- **React Suite (RSuite)** for UI components
- **Zustand** for state management
- **React Router v7** for routing
- **LESS** for styling
- **Recharts** for data visualization

### Directory Structure

```
src/
├── components/          # Reusable UI components
│   ├── card/           # Card components
│   ├── form/           # Form components
│   ├── modal/          # Modal components
│   ├── page/           # Page components
│   ├── reports/        # Report-specific components
│   ├── table/          # Table components
│   └── [category]/[ComponentName]/
│       ├── ComponentName.tsx
│       ├── index.tsx
│       └── ComponentName.stories.tsx (optional)
├── assets/less/
│   ├── base/           # Global styles, theme
│   ├── components/     # Component-specific styles
│   ├── variables/      # Design tokens
│   └── index.less      # Auto-generated from buildcss.py
├── stores/             # Zustand stores
│   ├── Auth.ts         # Authentication state
│   ├── StoreCustomer.ts
│   └── StoreReports.ts
├── services/           # API and business logic
│   ├── Backend.ts      # API communication
│   ├── Auth.ts
│   └── SalesService.ts
├── utils/              # Utility functions
│   ├── Date.ts         # Date formatting
│   ├── Money.ts        # Currency formatting
│   └── Chart.ts        # Chart utilities
├── router/             # Routing configuration
├── layout/             # Layout components
├── headers/            # Table header configurations
└── models/             # TypeScript interfaces
```

### Key Architectural Patterns

1. **Component Structure**: Each component lives in its own directory with index export pattern
2. **State Management**: Zustand stores for global state (auth, customers, reports)
3. **API Layer**: All requests go through `Backend.ts` with caching and auth handling
4. **Styling**: LESS files mirror component structure, auto-compiled to index.less
5. **Path Aliases**: Use `@/` for src directory imports
6. **Authentication**: JWT tokens with localStorage persistence and session management

### Naming Conventions

- **Components**: PascalCase directories and files (`CardList/CardList.tsx`)
- **First-level directories**: camelCase (`card`, `form`, `modal`)
- **LESS files**: camelCase matching component name
- **LESS classes**: Use BEM-like syntax with component prefix and `&-` for nested classes (e.g., `.CardCharts { &-DropdownButton { } }` creates `.CardCharts-DropdownButton`)
- **Utilities**: PascalCase for utility files (`Date.ts`, `Money.ts`)
- **Stores**: `Store` prefix for store files (`StoreCustomer.ts`)

### Important Development Notes

1. **Pre-commit Hooks**: Uses Husky with lint-staged for ESLint and Prettier
2. **Commit Convention**: Conventional commits enforced via commitlint
3. **Component Creation**: Always use `npm run create-component` script - creates component with .tsx file, index.tsx, and .stories.tsx
4. **LESS Compilation**: Run `python buildcss.py` after adding new LESS files - auto-generates index.less from all LESS files in proper order (base → components → pages → variables)
5. **RSuite Components**: Prefer RSuite over custom implementations
6. **React Suite Priority**: ALWAYS prefer React Suite components over HTML tags when available:
   - Use `<Stack>` instead of `<div>` for layout containers
   - Use `<VStack>` instead of `<div>` for vertical layouts
   - Use `<Text>` instead of `<p>` for text content
   - Use `<Heading>` instead of `<h1>`, `<h2>`, etc.
   - Use `<Button>` instead of `<button>`
   - Use `<Container>`, `<Content>`, `<Header>`, `<Footer>` instead of semantic divs
   - Check React Suite documentation first before using HTML elements
7. **Color Variables**: Always use color variables from `src/assets/less/variables/colors.less` instead of hardcoded hex values (e.g., use `@background-color-light` instead of `#f5f5f5`)
8. **Type Safety**: TypeScript strict mode enabled with project references (app/node configs)
9. **Storybook Integration**: Components include .stories.tsx files for documentation

### Utility Function Standards

**IMPORTANT**: All utility functions MUST follow this exact format:

```typescript
export type ExampleType = 
| "valueA" 
| "valueB" 
| "valueC";

export interface ExampleInterface {
  name: string;
  count: number;
}

const UtilsExample = { 
methodName( 
param: ExampleType, 
options?: { config?: ExampleInterface }, 
): string { 

return "result"; 
}, 

otherMethod(input: unknown): boolean { 

return false; 
}
};

export default UtilsExample;
```

**Rules for Utility Functions:**
- Always use `const UtilsName = {}` object format (NOT arrow functions)
- Function names use camelCase method syntax
- Export types at the top of the file
- Always export default the utility object
- Include proper TypeScript types for all parameters and return values
- Group related functions in the same utility file

### Routing Architecture

- **RouterMain**: Handles top-level routing with auth protection
- **RouterStore**: Nested routing for store-specific pages
- **RouterProtected**: Wrapper for authenticated routes
- **Layout System**: BasicLayout for auth pages, FullLayout for app pages

### State Management

- **Auth Store**: User authentication, permissions, session management
- **Report Stores**: Separate stores for different report types
- **Customer Store**: Customer data and filtering
- **Modal Store**: Global modal state management


When working on reports:
- Report components are in `src/components/reports/`
- Table headers are configured in `src/headers/`
- Report services are in `src/services/ServiceReports*.ts`

When working with API:
- All API calls go through `src/services/Backend.ts`
- Authentication handled automatically via JWT tokens
- Requests are cached and deduplicated for GET requests

### Build Configuration

- **TypeScript**: ES2020 target, project references for app/node configs
- **Vite**: React plugin with path aliases (`@/` → `./src`)
- **Base Path**: Relative paths (`./`) for deployment flexibility
- **Environment**: Uses VITE_BACKEND_URL and VITE_BASE env vars


### Common Development Tasks

When working on new features:
1. Create service in `/src/services/` for API integration
2. Create store using Zustand in `/src/stores/`
3. Build components in `/src/components/` with proper structure:
   - `/src/components/{namespace}/{ComponentName}/{ComponentName}.tsx`
   - `/src/components/{namespace}/{ComponentName}/index.tsx` with `export { default } from "./ComponentName";`
4. Add page components in `/src/components/page/`
5. Configure routing in `/src/router/`
6. Add LESS styles in `/src/assets/less/components/`
7. Run `python buildcss.py` after adding LESS files
8. Remove all console.log() statements
9. NEVER add comments to code unless explicitly requested by the user


## Private Chat History Setup (Recommended)
 
To maintain development context across Claude Code sessions while keeping conversations private, follow this setup:
 
### 1. Create Private Chat History File
```bash
# Create private history file in project root
touch CHAT_HISTORY.md
```
 
### 2. Add to .gitignore
```bash
# Add to .gitignore to prevent accidental commits
echo "CHAT_HISTORY.md" >> .gitignore
```
 
### 3. File Structure Template
Use this structure in your `CHAT_HISTORY.md`:
 
```markdown
# Private Chat History - [Project Name]
 
## YYYY-MM-DD: Session Topic
 
**Focus**: Brief description of session focus  
**Status**: In Progress/Completed
 
### Key Achievements
- Achievement 1
- Achievement 2
- Achievement 3
 
### Files Modified
- `path/to/file1.dart` - Description of changes
- `path/to/file2.dart` - Description of changes
 
### Architecture Decisions
- Decision 1: Rationale and context
- Decision 2: Rationale and context
 
### Technical Details
Any important technical notes, code snippets, or implementation details
 
### Next Steps
- [ ] Task 1
- [ ] Task 2
 
---
 
## Session Index
- **YYYY-MM-DD**: Topic - Brief status
- **YYYY-MM-DD**: Topic - Brief status
```
 
### 4. Benefits
- ✅ **Context Preservation**: Maintain development history across sessions
- ✅ **Decision Tracking**: Record architectural decisions and rationale  
- ✅ **Team Alignment**: Standardized approach without sharing private details
- ✅ **Privacy Protection**: Personal conversations remain private via .gitignore
 
### 5. Usage Guidelines
- **Update after each session**: Add new entries at the top
- **Include key decisions**: Document important architectural choices
- **Reference code changes**: List modified files with brief descriptions
- **Keep it concise**: Focus on actionable information and context
 
This approach allows each developer to maintain their own development context while keeping the team aligned on best practices.