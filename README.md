# Electron + Vue + Vite Starter Project

This is a starter template for building an Electron application using Vue 3 and Vite, featuring:

- Hot reload support for both Electron main and Vue renderer processes
- Secure Electron context isolation with preload script
- ESLint and Prettier integration for consistent code style and linting
- Development and production build workflows

---

## Features

- **Vue 3** with Vite as the build tool and dev server
- Electron main process with secure context isolation and IPC communication
- Preload script exposing safe API to renderer process
- Hot-reloading during development for both Electron and Vue
- Code linting with ESLint (Vue plugin) and formatting with Prettier

---

## Getting Started

### Prerequisites

- Node.js v16+ (recommended)
- npm or yarn package manager

### Installation

1. Clone this repository or download the source code
2. Run:

   ```bash
   npm install
   ```

   Builds the Vue renderer process for production.

   ```bash
   npm run build
   ```

   Builds the Vue app (same as build), then launches Electron loading the production build.
   This simulates the final production app behavior.

   ```bash
   npm run preview
   ```

   Builds the app and packages it

   ```bash
   npm run dist
   ```

   Packages and publishes the app

   ```bash
   npm run publish
   ```
   
## 📁 Project Folder Structure

src/
├── main/
│ ├── app/
│ ├── constants/
│ ├── handlers/
│ │ ├── app/
│ │ ├── cache/
│ │ └── file/
│ ├── path/
│ ├── preload/
│ ├── settings/
│ ├── updater/
│ ├── utils/
│ ├── Views/
│ ├── init.js
│ ├── index.js
│ └── windowManager.js
├── renderer/
│ ├── assets/
│ ├── components/
│ ├── composables/
│ ├── constants/
│ ├── routes/
│ ├── services/
│ ├── stores/
│ ├── styles/
│ ├── utils/
│ ├── views/
│ ├── App.vue
│ └── main.js
