---
title: AW skill context-load baseline
created: 2026-11-01
source_head: d22a658
status: baseline
---

# AW skill context-load audit

## Method and limits

Measured the repository working tree, using UTF-8 file bytes and whitespace-split
words, on 2026-11-01. Sources are `skills/*/SKILL.md` and Markdown recursively
under each skill's `references/`. Scripts, installer artifacts, retrieved code,
project documents, host prompts, skill discovery descriptions, and tool results
are excluded. No production workflow or model-token benchmark was run.

This is a baseline document, not an implemented audit command. Reproduce the
inventory with the following standard-library Python snippet from the repo root:

```python
from pathlib import Path
for p in sorted(Path("skills").glob("*/SKILL.md")):
    refs = list((p.parent / "references").rglob("*.md"))
    data = p.read_bytes()
    print(p.parent.name, len(data), len(data.split()), len(refs),
          sum(f.stat().st_size for f in refs))
```

These are exact file-size measurements for this snapshot. Bytes are not tokens.
A coarse estimate of 3–4 UTF-8 bytes per token can orient a reader but is not a
measurement and varies with model/tokenizer/content. Cached reads may reduce
billing or latency while still consuming context. Context compaction also changes
what remains available to the model. File counts do not prove runtime load.

## Full inventory

| Skill | Entry bytes | Entry words | Reference files | Reference bytes |
| --- | ---: | ---: | ---: | ---: |
| aw-capture | 13941 | 1973 | 1 | 4494 |
| aw-check-workflow-compliance | 8744 | 1171 | 0 | 0 |
| aw-create-tickets | 3422 | 472 | 0 | 0 |
| aw-create-worktree | 5974 | 800 | 0 | 0 |
| aw-debug | 3931 | 577 | 3 | 31929 |
| aw-discover-standards | 5232 | 742 | 0 | 0 |
| aw-feedback | 5889 | 790 | 0 | 0 |
| aw-help | 7277 | 1111 | 0 | 0 |
| aw-init | 3604 | 460 | 0 | 0 |
| aw-pin-behavior | 3543 | 479 | 0 | 0 |
| aw-plan | 10066 | 1377 | 6 | 85287 |
| aw-prd | 7423 | 1053 | 1 | 1016 |
| aw-refresh | 11982 | 1605 | 0 | 0 |
| aw-request-human-review | 2613 | 372 | 0 | 0 |
| aw-research | 3536 | 495 | 1 | 3353 |
| aw-resolve-pr-feedback | 4826 | 705 | 2 | 21570 |
| aw-review | 9052 | 1245 | 0 | 0 |
| aw-ship | 6725 | 900 | 6 | 35472 |
| aw-spec | 9735 | 1330 | 5 | 24863 |
| aw-synthesize-memory | 13282 | 1894 | 0 | 0 |
| aw-work | 10941 | 1469 | 6 | 35239 |
| **Total** | **151,738** | **21,020** | **31** | **243,223** |

Every entry is below the current 2,200-word limit. The 151,738 entry bytes and
243,223 reference bytes total 394,961 installed instruction bytes; ordinary
sessions should load only a subset. Installed `AGENTS.md` is 6,738 bytes and the
current config is 2,988 bytes, counted separately from these skill totals.

## Representative instruction routes

These are manually declared scenarios from current load directives, not a complete
transitive call graph or measured execution. Counts represent each named file
once, in full. Entries for multiple modes still include their irrelevant sections.
Normal project evidence and conditional helpers are additional. Passing references
to a consumer does not make them already loaded. Repeated reads must be counted
separately in a future runtime audit.

| Scenario | Counted files | Bytes | Qualification |
| --- | --- | ---: | --- |
| Software planning | aw-plan entry | 10,066 | Most planning references are not linked from its entry |
| Plan plus required document review | aw-plan + aw-review entries | 19,118 | Relevant spec, standards and plan contents additional |
| Contained work, no review/capture invocation | aw-work entry | 10,941 | Direct small fixes may bypass aw-work entirely |
| Non-trivial work + review | aw-work + aw-review entries | 19,993 | Relevant evidence additional |
| Work + review + invoked capture checkpoint | preceding files + aw-capture entry | 33,934 | Capture invocation is conditional; this is not a universal mandatory route |
| Same, plus compliance | preceding files + aw-check-workflow-compliance entry | 42,678 | Authorized publication path adds shipping references separately |
| Direct spec authoring | aw-spec entry + spec-writing reference | 15,500 | Configured replacement writer may differ |
| Exploratory spec authoring | aw-spec entry + discovery + synthesis-summary + spec-writing | 25,622 | Visual/prototype/non-software branches additional |
| Capture learning | aw-capture entry | 13,941 | Org sync/global confirmation conditional |
| Capture solution | aw-capture entry + solution-doc | 18,435 | Full research adds project evidence |
| Refresh solutions | aw-refresh entry | 11,982 | Includes instructions for decisions, features and cleanup |
| Synthesize memory | aw-synthesize-memory entry | 13,282 | Session logs and knowledge files can dominate real load |
| Local commit, core | aw-ship entry + commit-workflow | 12,945 | GitHub-access guidance may also load; providers/branch handling vary |
| Full PR, instruction skeleton | aw-ship + full-pr-workflow + commit-workflow + github-access + pr-description-writing + pr-application + review + compliance entries | 57,755 | Includes review once; excludes optional branch creation, capture, providers and project evidence |

The work entry asks for review when time/context allows, while repository rules
require appropriate review for behavior changes. A missing instruction invocation
is not permission to skip a repository gate. The full-PR skeleton is an example,
not an obligation to re-review unchanged work: shipping permits current evidence.

## Read edges and waste candidates

- `aw-work`: progress reference/template only for qualifying work; characterization
  and e2e references only when enabled/applicable. These are useful existing gates.
- `aw-spec`: direct writer and discovery have separate routes. Discovery adds
  synthesis guidance when converging; visual guidance is conditional.
- `aw-ship`: local commit and description modes load different procedures;
  full PR adds description/application/commit procedures and actual review and
  compliance as required. Preserve explicit authority at every transition.
- `aw-review`: all four review-mode procedures currently share one loaded entry.
  Its 9,052 bytes are small enough that splitting needs a measured route benefit.
- `aw-capture` and `aw-refresh`: all mode instructions share their respective
  13,941/11,982-byte entries. These are the first extraction candidates.
- `aw-synthesize-memory`: the 13,282-byte entry embeds templates and rules. A
  template split may save nothing on synthesis itself; do not split for appearance.

The following owning-directory Markdown searches found no links naming the
support file from another Markdown file there (not proof of no external use):

| Candidate | Bytes | Concern |
| --- | ---: | --- |
| skills/aw-plan/references/synthesis-summary.md | 36,836 | Large guidance that entry no longer explicitly loads |
| skills/aw-plan/references/deepening-workflow.md | 17,040 | Entry contains a shorter inline deepening procedure |
| skills/aw-plan/references/plan-template.md | 10,672 | Entry already supplies an inline template |
| skills/aw-plan/references/plan-handoff.md | 8,889 | Contains legacy menu/dispatch claims absent from entry |
| skills/aw-work/references/shipping-workflow.md | 10,475 | Entry ends at readiness and explicit publication authority |
| skills/aw-work/references/tracker-defer.md | 13,618 | Linked by the preceding unlinked shipping procedure |

Search all repository consumers and installed compatibility expectations before
removing any candidate. Do not load stale references merely to make them reachable.
Planning's installed-reference total is not a defensible default-context estimate.

## Recommended order

1. Reproduce inventory and manually validate common-route edges before introducing
   a route budget. Keep unknown edges and repeated reads visible.
2. Reduce capture-learning and refresh-solutions routes, including their selected
   references, by a proposed 20%; preserve existing outputs and permissions.
3. Add review depth with a small selector; avoid repeating every domain checklist
   on the lightweight route. Preserve required risk coverage.
4. Reuse scoped evidence through compact handoffs; do not repeat unchanged planning,
   discovery or review. Recheck scope when evidence is stale or incomplete.
5. Load retirement evaluation only during requested maintenance/synthesis. Keep
   optional design, e2e and pin capabilities out of unrelated routes.

Keep the existing entry/routing word limits. Start route budgets as reported
baselines and reviewed exceptions, rather than a new blocking policy. Validate
quality alongside cost on fixed scenarios; fewer bytes alone is not success.
