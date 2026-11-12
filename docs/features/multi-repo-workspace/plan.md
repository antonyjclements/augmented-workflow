---
status: completed
created: 2026-11-12
origin: docs/features/multi-repo-workspace/spec.md
depth: lightweight
---

# Multi-Repository Workspaces

## Problem and Scope

Enable coordination across sibling Git checkouts with an opt-in marker and
workflow config scoped to each touched repo. Keep release numbers and existing
repository-level gate and shipping behavior outside the change.

## Implementation Units

### U1 — Read-only workspace resolution

Cover AWSPACE-001 and AWSPACE-002 in `test/gate/workspace.test.ts` before adding
the command. Exercise two sibling Git checkouts, invocation below a Git boundary,
the nearest marker, explicit override precedence, relative paths, an invalid
override, a symlinked marker, a different owner, the home and 12-parent search
boundaries, and a successful repository-mode fallback. Verify the installed
helper matches the self-hosted one and that the probe writes no state.

### U2 — Per-repository routing

Cover AWSPACE-003 in the three workflow skills and the installed workflow
reference. Walk the skill instructions against two sibling checkouts with
conflicting providers and test policies, then scope the same task to one sibling
while the other is dirty. Check provider selection, evidence ownership, shipping
authorization, an older helper, and a missing repo config. Run the existing
shipping contracts and update the README and Unreleased changelog.

## Verification

Use the configured acceptance-first policy and the coding approach, traceability,
and guard verification standards. After U1 and U2, run gate and installer suites,
review the scoped diff, and check workflow compliance before pushing.
