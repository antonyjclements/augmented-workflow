---
title: Paper website and Wren idle motion
status: completed
---

# Implementation plan

Source: [living spec](spec.md), TBS-012 through TBS-015.

1. U1: Add shared paper CSS and static Wren to the three existing pages; preserve narrative and navigation. Verify desktop/mobile rendering, asset links, and overflow.
2. U2: Add one shared idle controller on the existing static Wren illustrations. Reset on interaction, schedule after 10 seconds, choose a fully visible mascot and a gentle CSS gesture, select theme by surface, and prevent overlap. Verify with fake timers and browser playback.
3. U3: Respect reduced motion, hidden tabs, persistence and explicit motion control; skip missing/offscreen images and cancel on viewport resizing. Cover these cases with deterministic tests.
4. U4: Review scoped changes, check acceptance coverage, and document local preview instructions and limitations.

Test policy: acceptance-first. Map each acceptance criterion to the explicit checks above before implementation. Follow the source repository's coding-approach and traceability standards: keep the implementation small and preserve existing behavior outside this scope. No deployment, commit or push is included.
