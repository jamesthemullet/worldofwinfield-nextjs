# World of Winfield

A personal blog and portfolio site built with Next.js, TypeScript, and Emotion.

## Tech Stack

- **Next.js** — pages router with ISR
- **TypeScript**
- **Emotion** — CSS-in-JS styling
- **WordPress GraphQL** — headless CMS content source for blog posts
- **Google Sheets** — data source for the favourites pages
- **TMDB** — film data for the favourite movies page
- **`realtime/`** — standalone Node WebSocket service powering the `/stocks` page
- **Jest + React Testing Library** — unit tests
- **Playwright** — end-to-end tests

## Getting Started

```bash
yarn install
yarn dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---|---|
| `yarn dev` | Start development server |
| `yarn dev:realtime` | Start the realtime WebSocket service in development |
| `yarn build` | Production build |
| `yarn start` | Start production server |
| `yarn start:realtime` | Start the realtime WebSocket service in production |
| `yarn test` | Run tests |
| `yarn test:e2e` | Run end-to-end tests with Playwright |
| `yarn lint` | Type-check and lint |
| `yarn format` | Format with Prettier |
| `yarn knip` | Find unused files, dependencies, and exports |
| `yarn postbuild` | Generate the sitemap after a production build |

## Pages

The site includes a blog, favourites (books, movies, music, cities, etc.), goals, travel, and more.
