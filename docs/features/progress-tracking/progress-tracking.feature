Feature: Checkout-local workstream progress

  Installer scenarios run through scripts/test-install.sh. Lifecycle scenarios
  are manual contract walkthroughs against the shipped skill instructions;
  they are not automated agent replays. Results and limits are recorded in
  docs/features/progress-tracking/verification.md.

@spec:PROG-001
  Scenario: Install and reinstall without broadening ignore scope
    Given a repository whose .gitignore has an entry without a final newline
    When the installer runs twice with gates disabled or enabled
    Then exactly one root /.aw/workstreams/ rule exists on its own line
    And a sample progress record is ignored and untracked
    And templates, durable docs and nested workstreams paths remain trackable

@spec:PROG-001
  Scenario: Reject a tracked collision before overwriting files
    Given a progress record was force-added to the Git index
    And human guidance and local record contents exist
    When installation runs with --force
    Then it fails with an explicit migration decision message
    And the guidance, ignore rules, record and index remain unchanged
    But a tracked .aw/other.md alone does not block installation

@spec:PROG-002
  Scenario: Select explicitly and reconcile stale context
    Given two records match a plan and one was updated more recently
    When a session resumes without selecting either record
    Then the guidance requires asking which workstream to use
    When the human selects one with unchanged U1 and U3 identifiers
    And its branch, HEAD, source units or dirty files differ from live state
    Then reconcile those differences before restoring its next action
    And preserve the identifiers and human notes
    And historical passing results cannot satisfy affected current checks

@spec:PROG-002
  Scenario: Preserve unreadable records and the lightweight path
    Given a selected record has an unsupported version or malformed header
    Then the original must remain unchanged
    And any recovery candidate is separate and labels uncertainty
    But a short task without a matching record needs no progress artifact

@spec:PROG-003
  Scenario: Checkpoint through one coordinator
    Given workers report U1 implementation and verification outcomes separately
    And a human changed a note or optional revision since the previous read
    Then the coordinator rereads and reconciles before updating the snapshot
    And preserves human notes and unknown fields
    And keeps at most ten recent checkpoints while retaining relevant evidence
    And a blocked or paused record includes a reason and resume condition
    And later conversion of T1 to a plan unit records an explicit mapping

@spec:PROG-004
  Scenario: Accept completion without authorizing deletion
    Given current verification and review are summarized with skips and risks
    Then the record is awaiting-human and ready-for-review
    When the human accepts completion without choosing a disposition
    Then close the record as complete and retain it locally
    And silence also retains it
    But cancellation leaves unfinished units visible and uses cancelled outcome

@spec:PROG-004
  Scenario: Export and remove only with specific authorization
    Given a human requests an export and removal of an exact local record
    Then verify the authorized export before removing the source
    And require approval covering loss of the local-only contents
    And reject traversal, symlinked ancestors, tracked collisions and unexpected edits
    And preserve unrelated files
    And generic archived cleanup and memory synthesis do not consume active progress

@spec:PROG-005
  Scenario: Transfer deliberately between checkouts
    Given a fresh worktree has no local progress record
    When the human authorizes a transfer naming source and destination
    Then preserve workstream identity and check destination collisions
    And pause the source and relinquish its coordinator
    And verify the copy and assign destination checkout and coordinator
    And reconcile sources and live context before resuming with one active copy
    And copied evidence or gate state is not current verification
