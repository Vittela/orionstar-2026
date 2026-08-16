# Deployment and release guide

The presentation is published as a static Vite build on GitHub Pages:

<https://vittela.github.io/orionstar-2026/>

The workflow in `.github/workflows/deploy.yml` runs whenever `main` is updated and can also be started manually from GitHub Actions.

## Prerequisites

- GitHub Pages is enabled with **GitHub Actions** as its source.
- The repository workflow has `pages: write` and `id-token: write` permissions.
- Node.js 20 is available locally; CI installs the same major version.
- The release version and changelog are already updated on the release branch.

## Pre-deployment checks

Run from a clean checkout:

```bash
npm ci
npm run check
```

Before merging, also verify:

- the three project cards open their respective dialogs;
- Escape and the visible close control dismiss each dialog;
- the flow diagram loads and exposes its textual description;
- the converter mockup remains usable by keyboard and at mobile widths;
- the comparison loads the image, Markdown, embedded EPUB, and downloads;
- the downloadable EPUB opens as a valid ZIP-based EPUB package;
- no formal accessibility certification is present without a completed evaluation.

## Release procedure

1. Update `package.json`, `package-lock.json`, and `CHANGELOG.md`.
2. Run the pre-deployment checks.
3. Commit the release branch with Conventional Commits.
4. Merge the release branch into `main`.
5. Create and push an annotated tag such as `v1.0.0`.
6. Wait for the GitHub Pages workflow to finish successfully.
7. Open the public URL and run the smoke checks below.
8. Publish the GitHub release using the matching changelog entry.

## Production smoke checks

- The home page returns HTTP 200 and displays the project title.
- JavaScript and CSS assets load from `/orionstar-2026/`.
- All three cards and nested dialogs remain operable.
- The external bibliography link and local downloads resolve correctly.
- Desktop and mobile layouts do not introduce horizontal page scrolling.

## Rollback

GitHub Pages deploys immutable build artifacts, so rollback is performed through Git history:

1. Identify the release merge that introduced the problem.
2. Revert it with a new conventional commit; do not rewrite `main` history.
3. Push the revert to `main` and wait for the Pages workflow.
4. Repeat the production smoke checks.
5. If the release tag points to a defective commit, publish a corrective patch version instead of moving the existing tag.

Rollback is warranted when the page cannot load, a primary dialog is inaccessible, a required download is missing, or the production workflow fails without a safe immediate correction.
