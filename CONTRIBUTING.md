# Contributing to Sovereign Self

Thank you for considering contributing to Sovereign Self! This document provides guidelines and instructions for contributing.

## Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help create a welcoming environment

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/your-username/sovereign-self.git`
3. Create a branch: `git checkout -b feature/your-feature-name`
4. Follow the setup instructions in `SETUP.md`

## Development Workflow

### Before You Start

1. Check existing issues and PRs
2. Create an issue to discuss major changes
3. Ensure you have the latest main branch

### Making Changes

1. Write clean, readable code
2. Follow the existing code style
3. Add tests for new features
4. Update documentation as needed

### Commit Messages

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new feature
fix: fix bug
docs: update documentation
style: format code
refactor: refactor code
test: add tests
chore: update dependencies
```

### Testing

```bash
# Run all tests
pnpm test

# Run specific tests
pnpm --filter api test
pnpm --filter web test

# Run e2e tests
pnpm --filter web test:e2e
```

### Linting

```bash
# Lint all code
pnpm lint

# Format code
pnpm format
```

## Pull Request Process

1. Update the README.md with details of changes if needed
2. Update CHANGELOG.md (if exists)
3. Ensure all tests pass
4. Ensure code is properly formatted
5. Request review from maintainers

### PR Guidelines

- Keep PRs focused and small
- Write clear PR descriptions
- Include screenshots for UI changes
- Link related issues
- Ensure CI passes

## Code Style

### TypeScript

- Use TypeScript for all new code
- Define proper types (no `any` unless necessary)
- Use interfaces for object shapes
- Export types from shared package when used in multiple places

### React

- Use functional components with hooks
- Keep components small and focused
- Use custom hooks for reusable logic
- Implement proper loading and error states

### CSS

- Use Tailwind utility classes
- Follow the design system colors
- Ensure responsive design (mobile-first)
- Test on multiple screen sizes

## Project Structure

```
apps/api/          - Backend code
apps/web/          - Frontend code
packages/shared/   - Shared types and schemas
```

### Adding New Features

**Backend:**
1. Add types to `packages/shared`
2. Update Prisma schema if needed
3. Create service in `apps/api/src/modules/`
4. Add tests
5. Update API documentation

**Frontend:**
1. Add UI components to `apps/web/src/components/`
2. Create React Query hooks in `apps/web/src/hooks/`
3. Add pages to `apps/web/src/pages/`
4. Add routes to `App.tsx`
5. Add tests

## Questions?

- Check existing documentation
- Ask in issues or discussions
- Reach out to maintainers

Thank you for contributing! 🎉

