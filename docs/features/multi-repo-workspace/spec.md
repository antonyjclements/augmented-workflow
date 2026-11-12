---
title: Multi-Repository Workspaces
status: active
created: 2026-11-12
updated: 2026-11-12
tags:
  - workflow
  - workspace
related_decisions: []
---

# Multi-Repository Workspaces

## Intent

A developer working across sibling Git checkouts can coordinate one task while
each repository retains authority over its workflow. For example, a shell and
micro-frontend can share an implementation request and use different test
policies and shipping providers.

## Acceptance Criteria

### AWSPACE-001 — Resolve the workspace from the invocation directory

`aw-gate.js workspace` selects an explicit `--workspace-root <dir>` first, then
`AW_WORKSPACE_ROOT`, then the closest user-owned regular `aw-workspace.yml`
above or at the current directory. Discovery crosses Git boundaries and checks
at most 12 parents. It stops before the home directory or after the filesystem
root. An explicit root must contain a regular marker and an invalid override
fails with a diagnostic. Relative overrides resolve from the invocation directory.

### AWSPACE-002 — Preserve repository mode and read-only resolution

Without an eligible marker or an explicit override, resolution succeeds in
repository mode. Marker contents are unused. Symlinks and directories are
ineligible as markers. Resolution provides a human-readable result and optional
JSON, and performs no writes or repository enumeration. Automatic discovery
requires a platform that exposes the current UID.

### AWSPACE-003 — Route touched repositories independently

In workspace mode, `aw-work`, `aw-ship`, and
`aw-check-workflow-compliance` use the repositories touched by the authorized
task. Each repository contributes its own guidance, config, Git scope, providers,
and applicable checks. Repository-specific commands and evidence run from that
checkout. An absent config uses the existing defaults. Sibling changes enter
scope only when they belong to the task, and publishing follows existing
permissions for each repo. Read-only shipping modes continue to resolve the
requested PR and follow their existing read-only contract.
