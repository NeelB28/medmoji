# medmoji

A small React app (Vite-powered) that provides medical-themed emoji interactions and playful UX for clinical professionals and learners.

---

Table of Contents
- [About](#about)
- [Features](#features)
- [Tech stack](#tech-stack)
- [Requirements](#requirements)
- [Getting started](#getting-started)
- [Project structure](#project-structure)
- [Environment variables](#environment-variables)
- [Scripts](#scripts)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)
- [Author](#author)

## About

medmoji is a lightweight React application built with Vite. It focuses on small, delightful interactions using medical-themed emoji and simple game-like UX elements — great for demos, learning, or a tiny utility for clinical teams.

## Features

- React 18 single-page application
- Fast dev experience with Vite 6 and HMR
- Fun emoji interactions and lightweight game UX
- Uses a couple of small utilities to keep the bundle lean (clsx, canvas-confetti)

## Tech stack

- Framework: React 18
- Build tool: Vite 6
- Router: react-router-dom
- Utilities: clsx, canvas-confetti
- Linting: ESLint 9
- Languages in repo: JavaScript, CSS, HTML

## Requirements

- Node.js 18+ (LTS recommended)
- npm 9+ (or use pnpm/yarn — adapt commands as needed)

## Getting started

Clone the repository, install dependencies, and start the dev server:

```bash
# install dependencies
npm install

# start dev server
npm run dev
```

Common lifecycle scripts:

```bash
# run linter
npm run lint

# production build
npm run build

# preview built app locally
npm run preview
```

## Project structure

```
medmoji/
├─ src/                # Application source code
├─ public/             # Static assets copied as-is
├─ index.html          # App HTML entry
├─ vite.config.js      # Vite configuration
├─ eslint.config.js    # ESLint configuration
└─ dist/               # Build output (gitignored)
```

## Environment variables

Create a `.env` or `.env.local` in the project root if you need to provide configuration.

Common Vite pattern:
- `VITE_API_BASE` — example API base URL

Note: Only variables prefixed with `VITE_` are exposed to the client.

## Scripts

- `npm run dev` — Start Vite dev server with HMR
- `npm run build` — Build for production to `dist/`
- `npm run preview` — Preview the production build locally
- `npm run lint` — Run ESLint across the repo

## Deployment

- The `dist/` folder contains the static build output.
- Deploy to any static host (Vercel, Netlify, GitHub Pages, Firebase Hosting, etc.).
- If you use client-side routing, enable SPA fallback (redirect 404s to `index.html`) so routes work after a refresh.

## Contributing

Contributions, ideas, and PRs are welcome.

Guidelines:
- Run `npm run lint` before creating a PR.
- Keep changes small and focused.
- Add a short description to your PR explaining the why and the what.

## License

TBD

## Author

NeelB28 — A small playful project for clinical professionals.

If you'd like, I can:
- Create a cleaned/updated README file in the repository,
- Or open a PR with the updated README.
Which would you prefer?
