# Electron + Vue + Vite Starter Project

This is a starter template for building an Electron application using Vue 3 and Vite, featuring:

- Hot reload support for both Electron main and Vue renderer processes
- Secure Electron context isolation with preload script
- ESLint and Prettier integration for consistent code style and linting
- Development and production build workflows

---

## Features

- Modern Stack: Vue 3 + Vite + Electron

- Secure Architecture: Context isolation with preload scripts

- Developer Experience:

   Hot-reloading for both processes

   Linting with ESLint (Vue plugin)

   Code formatting with Prettier

- Production Ready: Build and packaging scripts

---

## Getting Started

### Prerequisites

Make sure you have the following installed:

- **Node.js** v16 or higher
- **npm** or **yarn**

---

### Installation

1. **Clone** the repository or [download](https://github.com/Anas-hishamSet-Up-Project-Scaffold) the source code.
2. Open your terminal in the project directory and run:

```bash
npm install
```

### Development Scripts

Builds the Vue renderer process for production.

```bash
npm run build
```

Builds the Vue app (same as build), then launches Electron loading the production build.
This simulates the final production app behavior.

```bash
   npm run dev
```

Starts the app in development mode. Launches Vite and Electron concurrently.

```bash
npm run preview
```

Builds the app and packages it

```bash
npm run dist
```

Packages and publishes the app (e.g., GitHub releases, if configured).

```bash
npm run publish
```
### Project Structure

GL Stream
│
├── main/                     # Electron main process files
│   ├── handlers/             # Event handlers for main process
│   ├── utils/                # Utility functions for main process
│   ├── index.js              # Main entry point for Electron app
│   ├── preload.js            # Preload script for context isolation
│   └── windowManager.js      # Manages browser windows
│
├── renderer/                 # Vue.js frontend application
│   ├── components/           # Vue components
│   │   ├── brackets/         # Bracket-related components
│   │   ├── main/             # Main view components
│   │   ├── matches/          # Match-related components
│   │   ├── playersStats/     # Player statistics components
│   │   ├── settings/         # Settings components
│   │
│   ├── routes/               # Vue router configuration
│   ├── views/                # Main views/pages
│   ├── App.vue               # Root Vue component
│   ├── main.js               # Frontend entry point
│   └── style.css             # Global styles
│
└── (other root files)        # Likely includes package.json, etc.

