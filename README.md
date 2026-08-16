# OrionStar 2026

Interactive presentation of the project **Accessible semantic reconstruction of digitized books: from PDFs and images to EPUBs navigable by assistive technologies**.

Developed by João Victor Correia de Araujo da Silva through OrionHub Lab at UFAL for the OrionStar 2026 competition.

The current accessibility review, resolved findings, validation scope, and remaining manual checks are recorded in [`docs/accessibility-audit.md`](docs/accessibility-audit.md).

## Development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```

The repository includes a GitHub Actions workflow that publishes the `dist` build to GitHub Pages whenever `main` is updated.
