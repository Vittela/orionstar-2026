# Accessibility audit

Audit date: 2026-08-16  
Target: WCAG 2.2, levels A and AA  
Scope: main presentation page, project-section modal, Excalidraw flow viewer, accessible-converter mockup, comparison view, expanded figure dialog, and embedded EPUB preview.

## Reference basis

- [Web Content Accessibility Guidelines (WCAG) 2.2](https://www.w3.org/TR/WCAG22/)
- [How to Meet WCAG 2.2](https://www.w3.org/WAI/WCAG22/quickref/)
- [WAI-ARIA Authoring Practices: Modal Dialog Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)

The target is practical alignment with WCAG 2.2 AA. This document is not a formal conformance claim. Automated inspection and code review cannot replace testing with disabled users, screen readers, browser zoom, custom style sheets, and multiple reading systems.

## Method

The review combined:

1. JSX, HTML, CSS, EPUB XHTML, and interaction-logic inspection.
2. Keyboard and focus testing in the rendered application.
3. Semantic-tree inspection of the main page and every project section.
4. Reflow testing at a 320 CSS-pixel viewport.
5. Programmatic checks for duplicate identifiers, missing accessible names, missing image alternatives, target dimensions, document language, and page title.
6. Approximate computed-color contrast checks, followed by direct review of component borders and state indicators.
7. Static JSX accessibility linting added to the project.

## Findings and resolutions

| ID | Severity | Finding | Related criteria | Resolution |
| --- | --- | --- | --- | --- |
| A11Y-01 | Critical | Opening a project section left the complete page available behind the modal to sequential and assistive navigation. `aria-modal` alone did not make the background inert. | 2.4.3 Focus Order; 4.1.2 Name, Role, Value; WAI-ARIA dialog pattern | The dialog is now rendered in a portal. The presentation page receives both `inert` and `aria-hidden="true"` while the dialog is open, and its previous state is restored on close. |
| A11Y-02 | High | At narrow widths the visible “Fechar” text was hidden, leaving an icon-only close control with no accessible name. | 2.4.6 Headings and Labels; 4.1.2 Name, Role, Value | The control now has the persistent accessible name “Fechar visualização”, independent of visual breakpoint. The figure dialog uses “Fechar figura ampliada”. |
| A11Y-03 | High | Selecting an item in the structure tree on mobile hid the focused button when the interface switched to the review panel. Focus fell back to the document body. | 2.4.3 Focus Order; 2.4.11 Focus Not Obscured | The review-panel heading is now programmatically focused after the mobile panel change. Desktop selection keeps focus on the selected tree item. |
| A11Y-04 | High | The converter mockup imposed a 320-pixel minimum width inside a 304-pixel modal content area. Content was clipped at a 320-pixel viewport. The page also inherited horizontal overflow from the body minimum width. | 1.4.4 Resize Text; 1.4.10 Reflow | Fixed minimum widths were removed. The mockup now matches its container, the base page no longer overflows horizontally, and the document preview uses reduced padding and no forced minimum width on small screens. |
| A11Y-05 | High | The flow diagram was primarily a canvas experience and had no equivalent description of the process. | 1.1.1 Non-text Content | A keyboard-accessible “Descrição textual do fluxo” disclosure now provides the six process stages as an ordered list. The canvas is also exposed as a named region. |
| A11Y-06 | High | The expanded figure behaved as a second modal but did not make the parent project dialog inert. Assistive navigation could reach both modal layers. | 2.4.3 Focus Order; 4.1.2 Name, Role, Value; WAI-ARIA dialog pattern | The figure dialog is now portalled to the document body. The parent dialog becomes inert and hidden from assistive technology until the figure closes. Focus returns to the enlargement trigger. |
| A11Y-07 | High | Backdrop dismissal used `mousedown`, so the action completed on the pointer down-event rather than after pointer cancellation remained possible. | 2.5.2 Pointer Cancellation | Backdrops now use native buttons and `click`, which fires on the up-event. Visible close buttons remain available. |
| A11Y-08 | Medium | Initial modal focus moved directly to “Fechar”, before users encountered the title or purpose of a large, structured dialog. The focus trap also included elements that might be visually hidden. | 2.4.3 Focus Order; WAI-ARIA dialog pattern | Initial focus now moves to a non-tabbable dialog heading. The focus loop filters out non-rendered and inert elements and handles forward and reverse traversal from the heading. |
| A11Y-09 | Medium | Two Excalidraw controls exposed by view/zen chrome had no accessible name and were not needed for presentation. | 4.1.2 Name, Role, Value | The unused main-menu and zen-exit controls are no longer displayed. Named zoom controls, fit-to-screen, the canvas region, and the textual flow remain available. |
| A11Y-10 | Medium | The whole application was a single `main`; the project header and references footer therefore did not expose their expected banner and content-information landmarks. There was no bypass link. | 1.3.1 Info and Relationships; 2.4.1 Bypass Blocks | The page now has banner, main, and content-information landmarks. A visible-on-focus “Pular para o conteúdo principal” link targets the main region. |
| A11Y-11 | Medium | Loading, errors, action feedback, and zoom changes were not consistently announced without moving focus. | 4.1.3 Status Messages | Loading and action feedback use polite status regions, load failures use alerts, and the current document zoom is an `output` with a polite accessible label. |
| A11Y-12 | Medium | Button groups that switched local panels were marked as navigation regions. The reading-order label wrapped multiple controls instead of grouping them semantically. | 1.3.1 Info and Relationships; 4.1.2 Name, Role, Value | Local switchers are now named control groups with pressed state and controlled-panel references. Reading-order controls now use a `fieldset` and `legend`. |
| A11Y-13 | Medium | Several muted labels measured just below the 4.5:1 text contrast threshold, and important input/control borders were too faint to reliably identify component boundaries. | 1.4.3 Contrast (Minimum); 1.4.11 Non-text Contrast | Muted text colors were darkened and essential borders now use a stronger neutral. Links in the references area are underlined by default rather than identified by color alone. |
| A11Y-14 | Medium | Multiple controls in the compact mockup were smaller than 24 CSS pixels. Some explanatory text was approximately 10 pixels high. | 2.5.8 Target Size (Minimum); readability advisory | Interactive controls now have at least a 36-pixel height, mobile panel switches use 48 pixels, and compact interface labels were increased to 12 pixels or more. Inline text links retain the WCAG inline-target exception. |
| A11Y-15 | Medium | Motion and transitions did not respect the operating-system reduced-motion preference. Fit-to-screen always animated. | 2.3.3 Animation from Interactions (AAA advisory); 2.2.2 Pause, Stop, Hide | `prefers-reduced-motion` now suppresses transitions and repeating animation. Excalidraw fit-to-screen disables animation when the preference is active. |
| A11Y-16 | Low | External references opened new tabs without communicating that behavior. Repeated “Baixar arquivo” links were less useful when read outside their visual panel. | 2.4.4 Link Purpose; 3.2.5 Change on Request (AAA advisory) | External references now append “abre em nova aba” to their accessible names. Download links are named “Baixar Markdown” and “Baixar EPUB”. |
| A11Y-17 | Low | The comparison table had correct row and column scopes but no explicit accessible title. | 1.3.1 Info and Relationships | A descriptive table caption was added for assistive technology. |
| A11Y-18 | Preventive | The project lint configuration did not check JSX accessibility rules, allowing regressions such as unnamed controls or invalid interaction semantics to pass. | Robustness and maintenance | `eslint-plugin-jsx-a11y` recommended rules are now part of `npm run lint`. |

## Positive baseline retained

- The document already declared `lang="pt-BR"` and a descriptive page title.
- The main visible heading hierarchy was coherent.
- The presentation images already had intentional alternatives or were correctly hidden as decorative card previews.
- Native buttons were used for the primary project cards and mockup actions.
- The comparison table already used column and row header scopes.
- The EPUB iframe already had a view-specific title.
- The reconstructed EPUB preview includes language metadata, headings, landmarks, MathML, figure alternatives, detailed descriptions, and a table of contents.

## Validation after correction

- No horizontal page overflow at a 320 CSS-pixel viewport.
- The converter mockup width equals the available modal content width at 320 pixels.
- No visible non-inline control under 24 by 24 CSS pixels in the tested modal states.
- No missing accessible names among visible buttons, links, inputs, selects, or text areas.
- No duplicate HTML identifiers in the tested states.
- No image element without an `alt` attribute.
- Focus enters each dialog at its title, remains inside the active modal layer, returns to the triggering control, and moves to the review heading after the mobile tree transition.
- The flow, mockup, comparison, embedded EPUB switcher, and expanded figure remain operable by keyboard.
- Static lint and production build pass after the changes.

## Residual manual testing

Before making a formal WCAG conformance claim, the following should still be performed:

1. End-to-end reading with NVDA + Firefox/Chrome and VoiceOver + Safari.
2. Browser text zoom at 200% and page zoom at 400%, including custom WCAG text-spacing overrides.
3. Windows High Contrast and additional forced-color combinations.
4. Touch exploration with TalkBack or VoiceOver on a physical mobile device.
5. The downloaded EPUB in more than one reading system, including Thorium Reader, with Ace by DAISY and EPUBCheck reports archived alongside the tested version.
6. A short usability session with blind, low-vision, motor-disabled, and cognitively disabled participants, since WCAG coverage alone does not represent every user need.
