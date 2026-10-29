# Website verification

Scope: website working-tree changes and new files based on `origin/gh-pages` at `50dbe210e51785939e7b5edb95c172558b403285`. No commits, pushes, or deployment performed. Existing mascot work in the original workflow checkout is excluded.

## Current acceptance coverage

| Requirement | Evidence |
| --- | --- |
| TBS-012: tactile paper and mascot | Browser confirms rounded cards, SVG grain, geometric corner folds and diffuse shadows; mobile viewport and document widths both 398px |
| TBS-013: idle timing and interruption | Tests cover the 10-second cadence, a single 2.4-second gesture, and all interruption events; real browser observed `wren-lift` on the original perched illustration with a 2.4s duration |
| TBS-014: preferences and control | Tests cover reduced motion at startup and runtime, stored toggle preference, hidden tabs, and lifecycle cleanup; native motion button remains keyboard accessible |
| TBS-015: stable artwork and placement | Tests skip missing, loading, partial and offscreen illustrations; only one existing mascot animates; browser confirms no popup elements |

17 focused Node tests pass. `git diff --check` passes. Local assets and texture file are present. The current visual pass was in the in-app browser at mobile width. All three pages were checked at desktop and mobile widths during the preceding layout pass; the current shared style refinement adds no fixed widths or new layout columns.

## Changes after feedback

The user reported that the paper felt angular and the sprite animations were choppy, awkwardly placed, and sometimes absent. Rounded paper surfaces, a local fine-grain SVG texture, and restrained triangular folds replace the squared design. The original ivory palette remains.

Random popup sprites are removed from playback. Existing Wren illustrations make gentle CSS look, settle, or lift gestures only when fully visible. Movement uses the same image continuously, without frame swaps, additional downloads, content overlays, or screen crossings. Sprite sheets are retained in the asset library. If no Wren is visible, no animation is shown.

## Review and implementation policy

Sequential review covered correctness, tests, maintainability, performance, lifecycle cleanup, preference handling, and cancellation races. No unresolved actionable findings. Effective test policy during implementation was acceptance-first. README and living spec describe the current behavior. The website branch has no workflow helper, so no gate stamp is claimed.

## Limits

Safari and Firefox were not separately exercised. Source workflow installer/gate tests are unrelated to this static website change and were omitted. Publishing remains a separate step. The CSS gestures add small whole-illustration movement; they do not animate individual wings or replace the retained sprite artwork.


## Final correction after rejected gestures

The user rejected the whole-image gestures. Removed the animation runtime, its stylesheet rules, and the motion toggle from all three pages. Static Wren artwork, the rounded textured paper theme, and sprite assets remain. Previous playback and timing test results above are historical, not claims about the current static presentation. Current verification uses `test/wren-presentation.test.cjs` to ensure no page loads mascot motion, all static assets resolve, and no Wren keyframes remain.


## Latest clarification: articulate in place

The user clarified that pose animation is wanted, with no physical movement across the screen. Restored sprite playback inside the existing fixed mascot boxes. Removed all whole-image transforms, random placement, drift and gesture keyframes. Mascots hold their final poses and select only connected transitions next, with forward/reverse frame order as needed. Static endpoints share the export padding. Hero width remains 150px desktop and 100px mobile.

Current checks: four presentation checks plus sixteen behavior checks pass (20 total). Behavior coverage includes fixed-box frame changes, pose continuity, interruption/restoration, lifecycle, preferences, offscreen skipping, dark artwork, failed loads and stale-load cancellation. Earlier static-only and whole-image gesture notes are historical. Browser verification records the actual frame change and stable element rectangle separately.


Latest browser result: sprite background position changed from `66.6667% 0%` to `0% 100%` while the mascot rectangle retained identical x/y coordinates and width/height. Computed transform was `none`. The original 150px desktop box is preserved. No claim is made that the generated intermediate sprite art is a vector rig or has been regenerated.


## Complete in-place cycles

Updated idle playback to traverse all four transitions, beginning and ending at each mascot's original pose. Shared endpoint frames are not duplicated; a cycle lasts 3.5 seconds at 8 fps. All four sheets are loaded before playback so a partial load cannot strand the bird mid-cycle. Twenty-seven tests pass, including complete cycles from all four starting poses in both color treatments and exact restoration of the resting artwork.


## Ribbon fragment correction

Frame-by-frame inspection found detached ribbon fragments from neighboring atlas cells and stray paper edges embedded in several intermediate frames. Cleaned all eight website sprite sheets and synchronized the source asset set and GIF previews. Removed only isolated fragments, preserving the main bird silhouette, nearby legitimate thread, and substantial perch elements. All approved start/end cells are byte-identical to their prior versions; dimensions and exact cycle handoffs remain valid. Reviewed the full frame contact sheet after cleanup. All 27 tests and diff formatting checks pass.


## Essay-based content refresh

Refreshed overview, technical model, and usage guide from the four essays linked in the living spec. Preserved the approved paper presentation, Wren sizes, animation controller, and sprite assets. Excluded the experiments section and all pilot results as explicitly requested. Updated receipt language to distinguish a shaped agent record from independent evidence of review quality. Added practical guidance on bounded learnings, local progress, checkout reconciliation and behavior-pin limits.

Verification: all four source essays read; all source URLs fetched successfully; editorial claims compared against the essays; overview rendered at 1440px and technical/usage pages at 390px, without overflow or browser errors. The overview has four essay links and no experiments section. All 27 existing tests pass. No prose-mirroring tests added. Changes remain local and unpublished.
