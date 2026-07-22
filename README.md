# Vita Resume Studio

Vita is a local-first resume builder with a structured editor, a live A4 preview,
customizable visual themes, and browser-based PDF export. It is designed for
creating a professional German-style CV without requiring an account, backend,
or database.

All resume content is edited directly in the browser and stored locally on the
current device. A versioned JSON export makes it possible to back up a draft or
continue working in another browser.

## Features

- Structured editor for personal details, profile text, career history,
  education, skills, languages, and interests
- Career timeline with dedicated entry types for employment, personal projects,
  training, and career breaks
- Multiple roles grouped under the same employer or project
- Reordering of career entries for a clear reverse-chronological timeline
- Optional hiding of redundant station titles in the resume preview
- Live A4 preview while editing
- Six color themes, modern and classic typefaces, two heading styles, and three
  spacing densities
- Configurable left/right column layout
- Optional profile photo upload with client-side cropping and resizing
- Circle, rounded, and square photo treatments
- Automatic local saving without an account
- Versioned JSON import and export, including the selected design settings
- Print-optimized, single-page A4 PDF export through the browser
- Responsive edit/preview switch for smaller screens

## Privacy and data storage

Vita has no application backend and does not upload resume data to a database.
Drafts are stored in the browser under the `vita-resume` local-storage key.

Important details:

- Clearing browser data also removes the locally saved draft.
- Export a JSON backup before clearing storage or switching devices.
- An uploaded profile photo is stored as encoded image data and is included in
  the JSON backup.
- JSON backups can contain sensitive personal information and should be handled
  accordingly.
- The application itself does not send resume content to an AI service.

## AI-assisted development

The project was built and iterated with an AI-assisted software-development
workflow. Generative AI was used as an engineering tool for requirements
exploration, implementation, refactoring, testing, and documentation. Suggested
changes were reviewed, integrated, and validated through the regular build and
test workflow.

AI assistance is part of the development process, not a runtime feature of the
resume builder.

## Technology

- [Next.js 16](https://nextjs.org/) with the App Router
- [React 19](https://react.dev/)
- TypeScript
- Component-scoped application state and browser `localStorage`
- Print-specific CSS for the A4 resume output
- Node.js 22
- Multi-stage Docker build using the Next.js standalone output

## Getting started

### Requirements

- Node.js `>=22.13.0`
- npm

### Local development

```bash
git clone https://github.com/t-MURO/vita.git
cd vita
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in a browser.

### Production build

```bash
npm run build
npm start
```

## Docker

Build and run the application with Docker Compose:

```bash
docker compose up --build -d
```

The application is then available at
[http://localhost:3000](http://localhost:3000).

Useful commands:

```bash
# Follow application logs
docker compose logs -f vita

# Stop and remove the container
docker compose down
```

The production image uses a multi-stage build and runs as an unprivileged user.

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Next.js development server |
| `npm run build` | Create an optimized production build |
| `npm start` | Run the production server |
| `npm test` | Build the application and run repository checks |
| `npm run lint` | Run ESLint |

## PDF export

1. Complete the resume in the editor.
2. Select **Als PDF exportieren**.
3. Choose **Save as PDF** in the browser print dialog.
4. Use A4 paper size and enable background graphics if the selected browser
   omits color accents by default. Content that exceeds the page is
   automatically scaled so the resume remains on one A4 page.

The exported PDF is generated entirely by the browser; no resume data is sent
to a server for conversion.

## Backup and restore

Use **JSON exportieren** to download the current content and all design settings.
Use **JSON importieren** to restore a compatible version-1 snapshot. Imported
career data is normalized so older drafts remain compatible with the current
grouped timeline model.

## Project structure

```text
app/
├── ResumeBuilder.tsx   # Editor state, interactions, import/export, and preview
├── globals.css         # Application, resume, responsive, and print styles
├── layout.tsx          # Fonts and page metadata
└── page.tsx            # Application entry point
public/                 # Static assets
tests/                  # Repository-level application checks
Dockerfile              # Multi-stage production image
docker-compose.yaml     # Local container setup
```

## Current limitations

- Drafts are local to one browser unless manually exported.
- Very dense resumes are scaled down to stay on one A4 page and can therefore
  become harder to read.
- There is currently one resume layout with configurable visual variants rather
  than multiple independent templates.
