# OnlyBuendisch.de

Satirische Parodie-Website im Stil von OnlyFans – aber für bündischen und Outdoor-Content.  
Lagerfeuer, Knoten, Rucksäcke, Zelte. Vollständig jugendfrei.

## Tech-Stack

- **React 19** + **TypeScript**
- **Vite** als Build-Tool
- **Tailwind CSS v4** (via Vite-Plugin)
- **Framer Motion** für Animationen
- **Lucide React** für Icons
- **Plausible Analytics** (datenschutzfreundlich)

## Voraussetzungen

- Node.js ≥ 18
- npm

## Installation

```bash
npm install
```

## Entwicklung

```bash
npm run dev
```

Öffne [http://localhost:5173](http://localhost:5173) im Browser.

## Build

```bash
npm run build
```

Das fertige Bundle landet in `dist/`.

## Vorschau des Builds

```bash
npm run preview
```

## Platzhalter-GIFs generieren

Die Seite erwartet kurze Loop-Videos/-GIFs unter `public/gifs/`. Prozedurale Platzhalter (kein echtes Videomaterial nötig) lassen sich mit folgendem Skript erzeugen:

```bash
npm run generate:gifs
```

Die Dateien werden nach `public/gifs/` geschrieben. Für echte Video-Clips können die Prompts in [GIF.md](GIF.md) als Vorlage für KI-Video-Tools (Runway, Pika, Kling u. Ä.) verwendet werden.

## Linting

```bash
npm run lint
```

## Projektstruktur

```
public/
  fonts/        – Schriftarten & fonts.css
  gifs/         – Video-Clips / GIF-Loops (nicht im Repo)
  images/       – Creator-Avatare (Unsplash-Fotos)
  profiles/     – Eigene Profilbilder
scripts/
  generate-gif-placeholders.mjs  – Prozeduraler GIF-Generator
src/
  App.tsx       – Gesamte App-Logik und UI
  main.tsx      – React-Einstiegspunkt
  index.css     – Globale Styles
GIF.md          – KI-Prompts für Video-/GIF-Erstellung
```

## Lizenz

Dieses Projekt ist eine Satire und dient ausschließlich humoristischen Zwecken.
