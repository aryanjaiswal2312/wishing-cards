# Museum of Us — Phase 2 (Viewer Foundation)

Frontend-only gifting experience. React + TypeScript + Vite + Tailwind CSS + Framer Motion.
All data (photos, voice, text) is stored locally in IndexedDB. Nothing is uploaded.

## Run

```bash
npm i
npm run dev
```

Other commands: `npm run build` (typecheck + production build), `npm run preview`.

## Routes

| Route | Purpose |
|---|---|
| `/` | Home: start or continue a draft, list/open/delete saved museums |
| `/create` | Six-step builder + final review |
| `/view/:id` | Immersive viewer: intro room, three-knock door, room transitions (rooms 3 to 8 are placeholders) |

## Structure

```text
src/
├── components/
│   ├── ui/         Button, IconButton, Field, SelectionCard, ProgressSteps,
│   │               Modal, ConfirmDialog, Tooltip, Toast, AudioPlayer
│   ├── builder/    StepDetails … StepPromises, ReviewStep, SuccessScreen
│   └── viewer/     ViewerLayout, ViewerNavigation, RoomProgress, MuteButton, RoomTransition, ViewerStatusScreen
├── hooks/          useDraft, useRecorder, useExperiences, useDocumentTheme,
│               useViewerExperience, useRoomNavigation, useSound, useMuted
├── pages/          HomePage, BuilderPage, ViewerPage, NotFoundPage
├── rooms/          IntroRoom, DoorRoom, PendingRoom, registry.ts (room order)
├── themes/         themes.ts — all four themes as CSS custom properties
├── types/          shared TypeScript types
└── utils/          storage (all IndexedDB), image compression, validation, constants
```
