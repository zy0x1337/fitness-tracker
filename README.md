# Trainingsplan — Privater Fitness Tracker

Eine **private, offline-first PWA** zum Planen und Tracken deines Trainings.
Alle Daten bleiben ausschließlich lokal auf deinem Gerät (`localStorage`) —
kein Konto, kein Server, keine Cloud.

## Funktionen

- **Wochenplan** — erstelle pro Wochentag eigene Workouts mit frei wählbarem
  Namen, Kategorie (Push, Pull, Beine, Cardio, Core, Mobility, Sonstiges) und
  optionaler geschätzter Dauer. Ein Tag ohne Workout ist automatisch ein Ruhetag.
- **Heute** — sieh die für heute geplanten Workouts und markiere sie als
  **Erledigt** oder **Nicht erledigt** (für Tage ohne Zeit oder wenn es körperlich
  nicht geht), jeweils mit **optionaler Notiz**.
- **Verlauf** — Trainings-Tagebuch der letzten Tage inkl. **Streak** (Serie
  aufeinanderfolgender Tage mit mindestens einem erledigten Workout).
- **Hell / Dunkel / System** — light-first Design mit warmem Off-White, dezenter
  Dark Mode. Umschaltbar oben rechts.
- **Installierbar & offline** — als App auf dem Homescreen installierbar (PWA),
  funktioniert vollständig ohne Internet.

Mobile-first gestaltet (optimiert für große Smartphones, ~6,9″) mit fixer
Bottom-Navigation.

## Entwicklung

```bash
npm install        # Abhängigkeiten installieren
npm run dev        # Dev-Server (http://localhost:5173)
npm run build      # Production-Build nach dist/
npm run preview    # Production-Build lokal testen
npm run lint       # ESLint
npm run icons      # App-Icons aus public/app-icon.svg neu generieren
```

## Tech-Stack

- **React + TypeScript + Vite**
- **vite-plugin-pwa** (Service Worker + Web App Manifest, `autoUpdate`)
- Eigenes, schlankes Design-System mit CSS Custom Properties (keine UI-Library)
- Persistenz über `localStorage` (State via React Context + `useReducer`)

## Deployment (Vercel)

Das Projekt ist als Vite-App von Vercel automatisch erkennbar und sofort
deploybar (Build `npm run build`, Output `dist/`, siehe `vercel.json`).
Einfach das Repository in Vercel importieren — keine weitere Konfiguration nötig.

## Datenschutz

Es werden keinerlei Daten übertragen. Workouts, Tageslogs und Einstellungen
liegen nur im Browser-Speicher des jeweiligen Geräts. Leerst du die
Browser-Daten, werden auch die Trainingsdaten entfernt.
