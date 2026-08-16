# Contributing

This repository is intentionally small. Contributions should preserve its academic tone, accessibility baseline, and straightforward React architecture.

## Development workflow

1. Create one branch for one focused change.
2. Use a conventional branch name such as `feat/epub-navigation`, `fix/modal-focus`, or `docs/release-guide`. Automated Codex branches use the `codex/` prefix.
3. Install the locked dependencies with `npm ci`.
4. Make the smallest change that fully addresses the issue.
5. Run `npm run check` before opening or merging a pull request.

## Commit messages

Use [Conventional Commits](https://www.conventionalcommits.org/):

```text
feat: add keyboard navigation to the viewer
fix: restore focus after closing the modal
docs: clarify the deployment process
chore: release version 1.0.0
```

Do not add `Co-authored-by` trailers. Keep unrelated changes in separate commits and branches.

## Language and content

- Source code, commit messages, and repository documentation are written in English.
- The presentation interface is currently written in Brazilian Portuguese.
- Prefer direct, academic language over promotional copy.
- Preserve user-provided SVG and Excalidraw content unless a change explicitly targets those files.
- Attribute external material close to where it is presented.

## Accessibility baseline

New interactions must remain usable with keyboard navigation and assistive technology. At minimum, verify:

- visible focus and logical focus order;
- accessible names for controls and images;
- modal focus containment and focus restoration;
- usable reflow at a 320 CSS-pixel viewport;
- reduced-motion behavior;
- sufficient text and component contrast.

Consult [the accessibility audit](docs/accessibility-audit.md) before changing modal, mockup, comparison, or EPUB behavior.

## Versioning

The project follows [Semantic Versioning](https://semver.org/):

- patch releases fix defects without changing expected behavior;
- minor releases add backward-compatible presentation features;
- major releases introduce incompatible behavior or a new stable project baseline.

Update `package.json`, `package-lock.json`, and `CHANGELOG.md` together when preparing a release.

## Pull request checklist

- [ ] The branch contains one focused change.
- [ ] Commit messages follow Conventional Commits.
- [ ] `npm run check` passes.
- [ ] Accessibility-sensitive behavior was tested by keyboard.
- [ ] Documentation and release notes were updated when needed.
- [ ] No `Co-authored-by` trailer was added.
