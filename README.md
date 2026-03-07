# Kyno

Premium Miami dog care marketplace — frontend prototype.

## Stack

- React 18
- Vite 5
- CSS-in-JS (style tags, no external CSS framework)
- Google Fonts: Cormorant Garamond + DM Sans

## Setup

```bash
npm install
npm run dev
```

Then open http://localhost:5173

## Project Structure

```
src/
├── main.jsx                  # Entry point
├── App.jsx                   # Root component
├── index.css                 # Body/reset styles
│
├── components/
│   ├── KynoApp.jsx           # Shell: routing, nav, phone frame
│   ├── StatusBar.jsx         # iOS-style status bar
│   ├── HomeScreen.jsx        # Home tab
│   ├── ServicesScreen.jsx    # Services tab
│   └── ProviderScreen.jsx    # Provider booking view
│
├── data/
│   └── services.js           # Services + nav data
│
└── styles/
    ├── tokens.js             # Color palette
    ├── global.js             # Phone frame, nav, animations
    └── components.js        # All component styles
```

## Color Palette

| Token       | Hex       | Usage                        |
|-------------|-----------|------------------------------|
| sand        | #E8DFD4   | App background               |
| clay        | #D6C7B6   | Cards, chips                 |
| charcoal    | #2E2A28   | Primary text, dark surfaces  |
| olive       | #7A7F6D   | Secondary text, labels       |
| brass       | #C4A46B   | Accent: dates, prices, dots  |
| espresso    | #3D2B1F   | Dog profile card background  |

## Screens

- **Home** — Dog Profile OS card, service grid, upcoming appointment
- **Services** — Full list of all 6 modules with descriptions
- **Provider** — Date/time picker + booking CTA
- **Activity / Profile** — Placeholder (coming soon)
