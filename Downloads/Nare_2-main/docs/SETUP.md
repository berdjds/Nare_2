# Nare Travel and Tours - Setup Guide

## Prerequisites

- Node.js 16.x or higher
- npm or yarn
- Git

## Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd nare-travel
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration.

## Development

Start the development server:
```bash
npm run dev
```

The site will be available at `http://localhost:3000`

## Building for Production

```bash
npm run build
npm run start
```

## Project Structure

### Key Directories

- `app/`: Next.js app directory containing all pages and layouts
- `components/`: Reusable React components
- `hooks/`: Custom React hooks
- `lib/`: Utility functions and configurations
- `public/`: Static assets

### Important Files

- `next.config.js`: Next.js configuration
- `tailwind.config.ts`: Tailwind CSS configuration
- `lib/translations.ts`: Translation strings
- `lib/images.ts`: Image configurations

## Adding New Features

### Adding a New Page

1. Create a new directory in `app/`
2. Add a `page.tsx` file
3. Update navigation if needed

### Adding Translations

1. Add new strings to `lib/translations.ts`
2. Follow the existing structure for all languages

### Adding Components

1. Create component in `components/`
2. Use TypeScript interfaces
3. Add to documentation

## Development Guidelines

### Code Style

- Use TypeScript
- Follow ESLint rules
- Use Prettier for formatting
- Write meaningful commit messages

### Component Guidelines

- Use functional components
- Implement proper TypeScript types
- Add JSDoc comments
- Follow the component structure:
  ```typescript
  interface Props {
    // Props interface
  }

  export function ComponentName({ prop1, prop2 }: Props) {
    // Component logic
    return (
      // JSX
    )
  }
  ```

### Testing

Run tests:
```bash
npm run test
```

Add new tests in `__tests__` directories.

## Deployment

### Production Build

```bash
npm run build
```

### Static Export

```bash
npm run export
```

### Environment Variables

Required environment variables:
- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_GOOGLE_MAPS_KEY`
- Additional variables as needed

## Troubleshooting

### Common Issues

1. Build Errors
   - Check Node.js version
   - Clear `.next` directory
   - Remove `node_modules` and reinstall

2. Image Optimization
   - Verify image paths
   - Check image dimensions
   - Use proper image formats

3. Translation Issues
   - Verify translation keys
   - Check language detection
   - Clear language storage

### Support

For additional support:
- Check documentation
- Review issue tracker
- Contact development team