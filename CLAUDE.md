# Sub-Tracker Development Guidelines

## Project Overview

An application that helps users identify their subscriptions by analyzing emails using an LLM.

## Tech Stack

- **Frontend**: Vite + React
- **Testing**: Vitest
- **AI Integration**: AI SDK
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

### 4. Email Analysis Features

- Secure handling of email data
- Privacy-first approach - no unnecessary data retention
- Proper error handling for LLM API calls
- Rate limiting and retry logic for AI requests

### 5. Testing Strategy

- Unit tests for utility functions
- Component tests for React components
- Integration tests for email processing
- Mock external APIs (LLM calls)
- Test error scenarios and edge cases

### 6. Build Process

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

- Never log sensitive email content
- Implement proper input validation
- Use environment variables for API keys
- Sanitize all user inputs before processing
