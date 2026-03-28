# Crime Intelligence Overview Dashboard

**Live site:** [poorvithdevang861.github.io/Intelligence-dashboard/](https://poorvithdevang861.github.io/Intelligence-dashboard/) (GitHub may use capital **I** in the path; the app uses **relative** assets + **hash** routing so it loads either way. Routes: `/#/` and `/#/hotspots`.)

The old URL `…/DashboardAssgn3/` was from the **previous repository name**. This project is deployed from **[intelligence-dashboard](https://github.com/poorvithdevang861/intelligence-dashboard)** only.

A modern, desktop-optimized dashboard for visualizing Indian crime data with interactive filters and comprehensive analytics.

## Features

- **Interactive Filters**: Filter by City, Crime Type, Month, Weapon, Gender, and Age Group
- **KPI Tiles**: Total Crimes, Most Common Crime Type, Highest Crime City, Case Closure Rate
- **6 Visualizations**:
  - Crime Hotspots by City (Horizontal Bar Chart)
  - Crime Type Distribution (Vertical Bar Chart)
  - Victim Gender (Donut Chart)
  - City vs Crime Type Heatmap
  - Victim Age Distribution (Bar Chart)
  - Monthly Crime Trend (Line Chart)

## Tech Stack

- React 18
- Vite
- Tailwind CSS
- Recharts
- JSON dataset (converted from CSV for faster loading)

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to the URL shown in the terminal (typically `http://localhost:5173`)

## Project Structure

```
intelligence-dashboard/
├── public/
│   └── data/
│       └── crime-data.json      # Loaded at runtime (not bundled — keeps JS small for GitHub Pages)
├── src/
│   ├── components/
│   │   ├── Charts/              # Chart components
│   │   ├── FilterSidebar.jsx   # Filter sidebar component
│   │   └── KPITiles.jsx         # KPI tiles component
│   ├── App.jsx                  # Main app component
│   ├── main.jsx                 # Entry point
│   └── index.css                # Global styles
├── package.json
└── vite.config.js
```

## Design Specifications

- **Colors**: 
  - Primary: #1F4E79
  - Accent: #4A90E2
  - Highlight: #F5A623
- **Cards**: White (#FFFFFF), 16px radius, soft shadow
- **Font**: Inter (with system fallbacks)
- **Layout**: Desktop-optimized, non-scrollable design

## Data Format

The dashboard uses a JSON dataset converted from the original CSV file. The JSON format provides faster loading and parsing compared to CSV, making it ideal for web applications.

## GitHub Pages

Production build uses **relative** `base: './'` (see `vite.config.js`) so JS/CSS work whether the repo URL uses `Intelligence-dashboard` or `intelligence-dashboard`.

- **Repository:** [github.com/poorvithdevang861/intelligence-dashboard](https://github.com/poorvithdevang861/intelligence-dashboard)
- **Live site:** [poorvithdevang861.github.io/Intelligence-dashboard/](https://poorvithdevang861.github.io/Intelligence-dashboard/)
- **Deploy:** `npm run deploy` ([gh-pages](https://www.npmjs.com/package/gh-pages))

**If the site shows 404 or blank:** **Settings → Pages** → source **`gh-pages`** / **`/ (root)`**. Use the URL with a trailing slash. Local dev uses `base: /` so open `http://localhost:5173/`; production build uses `/intelligence-dashboard/` for GitHub Pages. After deploy, hard-refresh the live site.
