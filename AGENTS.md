# Repository Guidelines

## Project Structure & Module Organization
- `src/` holds the game entry point (`src/main.js`) and Phaser scene code.
- `public/` stores static assets served by Vite. For example, `public/images/p_ms1_1.gif` is loaded at runtime.
- `index.html` is the Vite HTML entry.
- `vite.config.js` contains build/dev configuration.

## Build, Test, and Development Commands
- `npm install`: install dependencies.
- `npm run dev`: start the Vite dev server for local development (hot reload).
- `npm test`: currently prints an error because no tests are configured.

## Coding Style & Naming Conventions
- JavaScript (ES modules) with Phaser 3.
- Keep indentation and formatting consistent with existing code (4 spaces, semicolons).
- Asset keys follow short, descriptive identifiers (e.g., `pai_1man`); keep keys stable to avoid breaking loads.
- Scene functions use Phaser conventions: `preload`, `create`, `update`.

## Testing Guidelines
- No testing framework is configured yet.
- If you add tests, document the runner and add a script in `package.json`.
- Suggested conventions if introduced: place tests in `src/` with `*.test.js` and run with `npm test`.

## Commit & Pull Request Guidelines
- Commit message conventions are not established (git history unavailable here). Use clear, imperative messages (e.g., "Add tile sprite loading").
- PRs should include a short summary, steps to verify, and screenshots or GIFs for visual changes (gameplay/UI).

## Configuration & Assets Notes
- Remote assets can be loaded in `preload`, but prefer local files under `public/` for stability.
- Keep asset paths absolute from the Vite public root (e.g., `/images/p_ms1_1.gif`).
