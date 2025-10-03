# Globe Paris-NewYork

A small React web project that displays globe imagery and UI components (inferred from the repository layout and built assets).

This repository contains both the source (`src/`) and a production build output in the `build/` folder.

## Quick start

Prerequisites:
- Node.js (14+ recommended) and npm (or Yarn)

Install dependencies:

```powershell
npm install
```

Run the development server:

```powershell
npm start
```

Open http://localhost:3000 in your browser. The dev server will reload on changes.

Create a production build:

```powershell
npm run build
```

The built, deployable files will be created under the `build/` directory.

Run tests:

```powershell
npm test
```

If this project uses additional scripts (lint, format, etc.) they can be run via `npm run <script>`; check `package.json` for available scripts.

## Project structure (top-level)

- `build/` — production-ready static site (already present in the repo)
- `public/` — public assets used at runtime (HTML, images)
- `src/` — React source code
  - `compMINI/` — small UI components: `FlightMini.js`, `FriendMini.js`, `HomeMini.js`, `StatMini.js`
  - `components/` — main components and pages: `Conn.js`, `Friend.js`, `Home.js`, `Insc.js`, `List.js`, `navbar.js`, `Stat.js`

Other files:
- `package.json` — npm scripts and dependencies
- `README.md` — this file

## Notes & assumptions

- The repository structure strongly suggests Create React App was used. If your project uses a different tool (Vite, Next.js, etc.), adjust commands accordingly.
- The `build/` directory contains production assets (images like `world.jpg`, `nasa.jpg`, etc.). If you plan to redeploy, you can either use these files or rebuild from `src/`.

## Deployment

You can host the contents of the `build/` folder on any static hosting (GitHub Pages, Netlify, Vercel, S3 + CloudFront, etc.). For a simple GitHub Pages deploy (project site):

```powershell
npm install --save-dev gh-pages
# add "homepage" field to package.json, then:
npm run build; npm run deploy
```

Adjust deployment steps depending on your target host.

## Contributing

- Fork the repo, create a feature branch, run tests, and open a pull request.
- Keep changes small and focused. Add tests for new behavior where appropriate.

## Need help or want changes?

If you'd like a more detailed README (badges, screenshots, CI instructions, or development notes), tell me what to include and I will update this file.
