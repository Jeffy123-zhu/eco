# Contributing to EcoTrack

Thanks for your interest in contributing! This document outlines how to get started.

## Development Setup

1. Fork and clone the repository
2. Install dependencies: `npm install`
3. Copy `.env.example` to `.env.local` and add your API keys (optional for basic development)
4. Run the development server: `npm run dev`

## Project Structure

```
src/
  app/           # Next.js App Router pages and API routes
  components/    # React components
  hooks/         # Custom React hooks
  lib/           # Utility functions and helpers
  types/         # TypeScript type definitions
```

## Code Style

- Use TypeScript for all new code
- Follow existing patterns in the codebase
- Use meaningful variable and function names
- Add comments for complex logic

## Pull Request Process

1. Create a feature branch from `main`
2. Make your changes
3. Test locally
4. Submit a PR with a clear description

## Reporting Issues

Please include:
- Steps to reproduce
- Expected vs actual behavior
- Browser/OS information
- Screenshots if applicable

## Questions?

Open an issue or reach out to the maintainers.
