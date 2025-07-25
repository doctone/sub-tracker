# Sub-Tracker Development Guidelines

## Project Overview

An application that helps users track their subscriptions by connecting directly to YNAB (You Need A Budget) API to analyze transaction data and identify recurring subscription payments.

## Tech Stack

- **Frontend**: Vite + React
- **Styling**: CSS Modules for component-scoped styles
- **Testing**: Vitest
- **API Integration**: YNAB API
- **TypeScript**: Required for all code

## Development Principles

### 1. Test-Driven Development (TDD)

- Write tests BEFORE implementing features
- Follow Red-Green-Refactor cycle
- Minimum 90% test coverage required
- Test commands: `pnpm run test`, `pnpm run test:watch`, `pnpm run test:coverage`

### 2. Type Safety

- All code must be written in TypeScript
- No `any` types allowed without explicit justification
- Enable strict mode in tsconfig.json
- Use proper type definitions for all APIs and data structures
- Type check command: `pnpm run typecheck`

### 3. Code Quality

- Run linting before commits: `pnpm run lint`
- Use ESLint + Prettier for consistent formatting
- Follow React best practices and hooks rules
- Implement proper error boundaries
- Use proper loading and error states

### 4. CSS Modules Guidelines

- **Component-scoped styling**: Use CSS Modules (.module.css) for all component styles
- **Import pattern**: `import styles from './Component.module.css'`
- **Class naming**: Use camelCase for CSS class names (e.g., `.primaryButton`, `.headerSection`)
- **Design system**: Leverage CSS custom properties (CSS variables) defined in `index.css`
- **No global styles**: Avoid global CSS classes except for design system variables and base styles
- **Responsive design**: Use CSS Grid and Flexbox with proper media queries within modules
- **No inline styles**: Prefer CSS modules over inline styles for maintainability

### 5. YNAB API Integration Features

- Secure handling of YNAB OAuth tokens
- Privacy-first approach - no unnecessary data retention
- Proper error handling for YNAB API calls
- Rate limiting and retry logic for API requests
- Respect YNAB API usage limits and best practices

### 6. Testing Strategy

- Unit tests for utility functions
- Component tests for React components
- Integration tests for YNAB API processing
- Mock external APIs (YNAB API calls)
- Test error scenarios and edge cases

### 7. Build Process

- Build command: `pnpm run build`
- Ensure zero TypeScript errors
- Verify all tests pass before deployment
- Check bundle size and performance

## Required Commands

Before any commit or deployment:

1. `pnpm run test` - All tests must pass
2. `pnpm run typecheck` - Zero TypeScript errors
3. `pnpm run lint` - Zero linting errors
4. `pnpm run build` - Successful build required

## Architecture Guidelines

- Keep components small and focused
- Use custom hooks for complex logic
- Implement proper data validation
- Use React Query/SWR for server state
- Organize code by feature, not by file type

## Security Considerations

- Never log sensitive financial data or transaction details
- Implement proper input validation
- Use environment variables for API keys and secrets
- Sanitize all user inputs before processing
- Follow YNAB API security best practices
- Secure storage of OAuth tokens
