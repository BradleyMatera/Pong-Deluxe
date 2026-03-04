# Pong Deluxe

Arcade-style 2-player Pong built with TypeScript + Vite.

## Controls
- `Space`: Start game
- `W` / `S`: Move Player 1
- `Arrow Up` / `Arrow Down`: Move Player 2
- `P`: Pause / Resume
- `R`: Restart after game over

## Gameplay
- First player to 7 points wins.
- Random power-ups spawn during matches:
  - `S`: Speed boost
  - `B`: Bigger paddle
  - `N`: Smaller paddle
  - `M`: Multiball

## Development
```bash
npm install
npm run dev
```

## Production Build
```bash
npm run build:pages
```

## GitHub Pages
Deployment is automated via `.github/workflows/deploy.yml`.
