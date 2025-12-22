# Contributing to CAVC Landing Page

Thank you for your interest in contributing to the City Advertising Ventures Corporation landing page project.

## Project Overview

This is a proprietary project for City Advertising Ventures Corporation. The landing page showcases their outdoor advertising services with a modern, responsive design built using React + Vite + Tailwind CSS.

## Development Setup

1. **Prerequisites**
   - Node.js (v16 or higher)
   - npm or yarn
   - Git

2. **Local Development**
   ```bash
   git clone <repository-url>
   cd cavc-landing-page
   npm install
   npm run dev
   ```

3. **Testing Changes**
   ```bash
   npm run build    # Test production build
   npm run preview  # Preview production build
   npm run lint     # Check code quality
   ```

## Code Standards

### React Components
- Use functional components with hooks
- Follow consistent naming conventions
- Implement proper PropTypes where applicable
- Keep components focused and reusable

### Styling
- Use Tailwind CSS utility classes
- Follow the established design system
- Maintain responsive design principles
- Keep custom CSS minimal and well-documented

### Performance
- Optimize images and assets
- Implement lazy loading where appropriate
- Minimize bundle size
- Follow React best practices

## Project Structure

```
src/
├── components/        # React components
├── App.jsx           # Main app component
├── main.jsx          # Entry point
└── index.css         # Global styles and Tailwind

public/
├── images/           # Static assets
└── index.html        # HTML template
```

## Deployment

The project is configured for automatic deployment via GitHub Actions to GitHub Pages when changes are pushed to the main branch.

## Contact

For questions or collaboration requests, please contact the development team or City Advertising Ventures Corporation directly.

---

**Note**: This is a proprietary project. All contributions must be approved by the project maintainers.
