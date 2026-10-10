# Pinned migration fixtures

`aw-upgrade-legacy-0.15.0.tar.gz` contains the twelve files from the four retired
spec/shipping skills plus the seven helper/routing files listed under `repo_files`
in `bundled-skill-fingerprints.json`, from the released baseline:

- Version: `0.15.0`
- Commit: `5fae68e9f7c1b397dd0721cfd4183cf9760c2900`
- Archive SHA-256: `7821364a2ad30e5c80666758afda812c75e4ede7e069513e95feabddc5726789`

Generated with `git archive <commit> skills/aw-brainstorm skills/aw-create-spec
skills/aw-commit skills/aw-commit-push-pr AGENTS.md CLAUDE.md .scripts/aw-gate.js
docs/workflow/README.md docs/workflow/field-guide.md docs/workflow/tracking.md
docs/standards/e2e-coverage.md | gzip -n`.

`aw-upgrade-phase1.tar.gz` contains the six `aw-spec` files and the same seven
helper/routing paths from the preserved Phase 1 implementation checkpoint, before
shipping consolidation. It is not a published release:

- Base commit: `5fae68e9f7c1b397dd0721cfd4183cf9760c2900`
- Phase 1 patch SHA-256: `329c7c4dbcc544ef18c60a3eb8edae0e75913d15830dd7d8b1383c0837e5297f`
- Archive SHA-256: `0a31ff8677359ecbaff1ec5026fa6b149fd1db7b8d656ab03485c71b25304697`

Generated from the baseline plus that patch, with sorted members, original file
modes, and zeroed archive timestamps/owner IDs. This fixture verifies that a
manifest-owned `aw-spec` remains managed through the shipping upgrade and can be
restored, and that exact Phase 1 helper/routing bytes refresh with backups. The
shipping files are unchanged from the baseline fixture. Whole-bundle 22→20 and
21→20 checks additionally use the complete pinned baseline/Phase 1 checkouts;
these focused archives intentionally do not vendor every unaffected skill.

The archives are test data used only in disposable test repositories and skills
directories, never in a real user installation. Tests verify checksums and copy
only regular files. Helper scripts may run in those isolated test repositories
when a compatibility check requires them; current installed helpers are also
executed there after upgrade. These fixtures keep ownership, helper-upgrade,
and rollback tests runnable from source
archives or shallow clones without fetching history.

The installer separately ships whole-directory fingerprints for all 22 baseline
skills in `skills/aw-init/scripts/bundled-skill-fingerprints.json`. These recognize
only byte-identical, executable-mode-identical contents. Repo-file fingerprints
accept the baseline and the pinned Phase 1 checkpoint. Unknown versions and
modified skill directories remain untouched and are reported for review; new
`aw-spec`/`aw-ship` collisions stop before writes. Manifest-backed prior installs
remain supported without registering every intermediate skill fingerprint.
