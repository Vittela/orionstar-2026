# OrionStar 2026

Interactive presentation of **Accessible semantic reconstruction of digitized books: from PDFs and images to EPUBs navigable by assistive technologies**.

[View the published presentation](https://vittela.github.io/orionstar-2026/)

The project was developed by João Victor Correia de Araujo da Silva for the OrionStar 2026 competition, promoted by Laboratório Orion as part of OrionHub 2026. The interface is currently available in Brazilian Portuguese.

## About the project

This research proposal explores an AI-assisted workflow for turning scanned educational material into structured EPUB publications. AI provides an initial interpretation of headings, reading order, formulas, and figures; a person reviews those suggestions before export.

The presentation is divided into three parts:

1. **Project flow** — the path from digitization and OCR to human review and EPUB validation.
2. **Accessible converter** — a navigable mockup of the proposed review interface.
3. **Version comparison** — the scanned page, Mathpix transcription, and reconstructed EPUB shown side by side.

## Run locally

### Requirements

- Node.js 20 or newer
- npm 10 or newer

### Setup

```bash
npm ci
npm run dev
```

Vite will print the local address in the terminal. The application does not require environment variables, a backend, or external services at runtime.

### Available commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run lint` | Run JavaScript and JSX accessibility linting |
| `npm run build` | Create the production build in `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run check` | Run lint and production build together |

## Project structure

```text
.
├── src/                         React application and project views
│   ├── components/              Header, cards, dialogs, viewers, and mockup
│   └── data/                    External reference metadata
├── public/
│   ├── artifacts/               Comparison inputs and downloadable EPUB
│   ├── diagrams/                Excalidraw source file
│   ├── epub-preview/            Unpacked EPUB used by the embedded preview
│   └── previews/                Static card illustrations
├── docs/
│   ├── accessibility-audit.md   Accessibility findings and remaining tests
│   └── deployment.md            Release, deployment, and rollback procedure
└── .github/workflows/           GitHub Pages deployment workflow
```

React and Vite provide the application shell. The Excalidraw viewer is loaded only when the project flow is opened, and the card illustrations remain static SVGs to keep the initial page light.

## Accessibility

The interface was reviewed against WCAG 2.2 levels A and AA, including keyboard operation, focus management, reflow, accessible names, contrast, reduced motion, and equivalent text for the Excalidraw flow.

The completed review and remaining manual tests are documented in [the accessibility audit](docs/accessibility-audit.md). This work represents a practical accessibility target, not a formal conformance certification.

## Source excerpt

The comparison uses page 3 of *Pré-cálculo: operações, equações, funções e trigonometria*, by Francisco Magalhães Gomes, 1st edition, Cengage Learning, 2019, ISBN 978-85-221-2789-4. Bibliographic details are available on the [author's Unicamp page](https://ime.unicamp.br/~chico/pre-calculo/livro.htm).

The excerpt and derived educational sample are not covered by the repository's MIT license. See [third-party notices](THIRD_PARTY_NOTICES.md).

## Documentation

- [Contributing guide](CONTRIBUTING.md)
- [Accessibility audit](docs/accessibility-audit.md)
- [Deployment and rollback](docs/deployment.md)
- [Release history](CHANGELOG.md)

## Deployment

Updates to `main` are built and published to GitHub Pages by GitHub Actions. The complete release procedure and rollback path are described in [the deployment guide](docs/deployment.md).

## License

The original source code and project documentation are available under the [MIT License](LICENSE). Third-party content retains its original rights.
