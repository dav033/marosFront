# Maros Construction - Frontend

Frontend application for Maros Construction project management system built with Astro, React, and Preact.

## 🚀 Technology Stack

- **Astro** - Static site generator with islands architecture
- **React/Preact** - UI components with compatibility layer
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Vite** - Fast development and build tool

## 📁 Project Structure

```text
/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── common/         # Reusable UI components
│   │   ├── contacts/       # Contact management components
│   │   ├── leads/          # Lead management components
│   │   └── sidebar/        # Navigation components
│   ├── contexts/           # React contexts
│   ├── hooks/              # Custom React hooks
│   ├── layouts/            # Astro layouts
│   ├── pages/              # Astro pages and routing
│   ├── services/           # API services
│   ├── styles/             # Global styles
│   ├── types/              # TypeScript type definitions
│   └── utils/              # Utility functions
├── astro.config.mjs        # Astro configuration
├── package.json
└── tailwind.config.js      # Tailwind configuration
```

## 🛠️ Development

### Prerequisites

- Node.js 18+ 
- npm or pnpm

### Installation

```bash
npm install
```

### Development Server

```bash
npm run dev
```

Open [http://localhost:4321](http://localhost:4321) to view the application.

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# API Configuration
API_BASE_URL=http://localhost:8080
```

### Astro Configuration

The project is configured to support both React and Preact with compatibility mode enabled in `astro.config.mjs`.

## 📚 Features

- **Lead Management** - Create, edit, and track construction leads
- **Contact Management** - Manage customer and contractor contacts  
- **Project Types** - Support for different construction project types
- **Responsive Design** - Mobile-first responsive interface
- **Dark Mode** - Built-in dark theme support
- **Performance Optimized** - Lazy loading and code splitting
- **Type Safety** - Full TypeScript support

## 🏗️ Architecture

### Components

- **Common Components** - Reusable UI elements (buttons, modals, forms)
- **Feature Components** - Domain-specific components (leads, contacts)
- **Layout Components** - Page structure and navigation

### State Management

- React Context for global state
- Custom hooks for data fetching and local state
- Optimized re-rendering with useMemo and useCallback

### Styling

- Tailwind CSS for utility-first styling
- CSS modules for component-specific styles
- Dark mode support with CSS variables

## 🔗 Related Repositories

- **Backend**: [marosServer](https://github.com/dav033/marosServer)

## 📝 License

This project is private and proprietary.

---

Built with ❤️ for Maros Construction
├── public/
│   └── favicon.svg
├── src
│   ├── assets
│   │   └── astro.svg
│   ├── components
│   │   └── Welcome.astro
│   ├── layouts
│   │   └── Layout.astro
│   └── pages
│       └── index.astro
└── package.json
```

To learn more about the folder structure of an Astro project, refer to [our guide on project structure](https://docs.astro.build/en/basics/project-structure/).

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).
# marosFront
