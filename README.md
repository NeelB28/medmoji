## medmoji

Small React app powered by Vite for medical-themed emoji interactions and fun UX elements.

### Tech stack
- **Framework**: React 18
- **Build tool**: Vite 6
- **Router**: react-router-dom
- **Utilities**: clsx, canvas-confetti
- **Linting**: ESLint 9

### Requirements
- Node.js 18+ (LTS recommended)
- npm 9+ (or use `pnpm`/`yarn` if you prefer, adjust commands accordingly)

### Getting started
```bash
# install dependencies
npm install

# start dev server
npm run dev

# run linter
npm run lint

# production build
npm run build

# preview built app locally
npm run preview
```

### Project structure
```
medmoji/
├─ src/                # Application source code
├─ public/             # Static assets copied as-is
├─ index.html          # App HTML entry
├─ vite.config.js      # Vite configuration
├─ eslint.config.js    # ESLint configuration
└─ dist/               # Build output (gitignored)
```

### Environment variables
Create a `.env` or `.env.local` in the project root if needed.

Common Vite patterns:
- `VITE_API_BASE` — example API base URL

Note: Only variables prefixed with `VITE_` are exposed to the client.

### Scripts
- `npm run dev`: Start Vite dev server with HMR
- `npm run build`: Build for production to `dist/`
- `npm run preview`: Preview the production build
- `npm run lint`: Run ESLint across the repo

### Deployment
- The `dist/` folder is a static asset bundle.
- Deploy to any static host (Vercel, Netlify, GitHub Pages, Firebase Hosting, etc.).
- If using a router with client-side routes, enable SPA fallback to `index.html`.

### Contributing
PRs and suggestions are welcome. Please run `npm run lint` before submitting.

### License
TBD
