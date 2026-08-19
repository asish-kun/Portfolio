# asishnelapati.tech

Personal portfolio of **Asish Nelapati** — Founding Engineer. A dark, cinematic
single-page site built by hand with vanilla HTML/CSS/JS. No frameworks, no build step.

**Live:** [asishnelapati.tech](https://asishnelapati.tech)

## Design

- Single committed dark theme with a papaya-orange accent
- Display type: [Anton](https://fonts.google.com/specimen/Anton) · body: Space Grotesk · labels: JetBrains Mono
- Momentum smooth-scrolling (desktop wheel), scroll-driven reveals, parallax phone stage,
  magnetic buttons, custom cursor — all vanilla JS, all disabled under `prefers-reduced-motion`
- Consistent visual system for project media: browser frames, phone frames,
  terminal cards, and stat cards

## Development

Any static server works:

```bash
python3 -m http.server 8000
# or, with live reload:
npm install && npm run dev
```

## Structure

```
Portfolio/
├── index.html          # Single page — all content lives here
├── styles.css          # Design tokens + all styles
├── script.js           # Scroll, reveals, parallax, cursor, rotator
└── assets/
    ├── site/           # Optimized derivatives used by the page
    ├── images/         # Source screenshots & documents
    └── videos/         # Kaana app demo recording
```

`assets/site/` is generated from the source images (resized, cropped, compressed);
edit sources in `assets/images/` and regenerate rather than editing derivatives.

## Deployment

Deployed to GitHub Pages via the workflow in `.github/workflows/` on every push
to `main`, with the custom domain set in `CNAME`.
