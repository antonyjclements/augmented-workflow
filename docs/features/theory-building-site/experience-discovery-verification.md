# Experience Discovery Site Copy Verification

Date: 2026-09-08
Policy: acceptance-first

HTML changes are on `docs/experience-discovery-pages`, based on `gh-pages`.
The aligned spec and manual scenarios are on `docs/experience-discovery-site`,
based on `main`. The public pages have not been deployed by this verification.

- TBS-010: inspected the overview's People/Agents cards and technical discovery
  explanation. Intent includes understanding, action, and feeling. Suggested
  prototypes require agreement; explicit requests already authorize their scope.
  Routine changes remain lightweight.
- TBS-011: the technical explanation preserves human reaction, unresolved
  experiential fit, and useful learning after a prototype is discarded.
- Browser inspection: both pages at 1440px and 390px widths. No horizontal
  overflow; images loaded. Screenshots were visually inspected. The technical
  explanation uses a bounded reading width within the existing layout.
- Local navigation and asset targets exist. Both branch diffs pass whitespace
  checks. Registry validation passes; trace passes with optional code-anchor
  warnings, as expected for prose-based site requirements.
- Review: copy remains consistent with human-held Theory, the existing brand,
  and the implemented discovery contract. No remaining findings. No new scripts,
  dependencies, workflow behavior, or main README changes are needed.

These checks establish copy/layout consistency, not a real-user emotional
response. Publication and PR compliance are separate shipping steps.
