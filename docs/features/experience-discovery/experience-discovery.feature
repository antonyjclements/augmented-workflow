Feature: Experience discovery

  Manual conversation acceptance checks; this file is not an automated runner.
  Load the repository skill in a fresh conversation and inspect responses and
  tool actions at each turn. A walkthrough of the text is not behavioral replay.

@spec:EXD-001, EXD-002, EXD-003
  Scenario: S1 Suggest a bounded prototype and wait
    Given a request for meaningful exciting metrics and accessible visual references
    When the agent identifies consequential experiential uncertainty
    Then it explains its interpretation and what a small prototype would clarify
    And it asks for agreement without creating a prototype
    When no answer arrives
    Then it does not create a prototype
    When the user agrees to the proposed scope
    Then it may create that prototype without inferring permission for production work

@spec:EXD-001, EXD-002, EXD-004
  Scenario: S2 Honor direct authorization
    Given the user explicitly requests a small disposable prototype
    Then the agent proceeds within that scope without asking for approval again
    And it asks for a human reaction before treating experiential fit as settled

@spec:EXD-001, EXD-005
  Scenario: S3 Keep routine changes lightweight
    Given a clear request to correct an obvious spacing error
    Then the agent does not require a prototype or an extra discovery artifact

@spec:EXD-002
  Scenario: S4 Respect a declined suggestion
    Given the agent has suggested a prototype
    When the user declines and asks to continue requirements work
    Then the agent creates no prototype and does not repeat the unchanged suggestion
    And it preserves unresolved experiential assumptions without claiming validation

@spec:EXD-002
  Scenario: S5 Reuse authorization from the conversation
    Given the conversation contains explicit agreement and its prototype scope
    When work resumes with that context
    Then the agent reuses the agreement without asking again
    But if authorization is missing or ambiguous it does not invent it

@spec:EXD-003
  Scenario: S6 Interpret references without inventing evidence
    Given references intended to support both insight and visual pleasure
    Then the agent explains which observed qualities serve those outcomes
    But if a reference is inaccessible it states that limitation
    And if the available medium cannot test the uncertainty it agrees an alternative
    And it does not present an inadequate substitute as validation

@spec:EXD-004, EXD-005
  Scenario: S7 Human feedback outweighs functional correctness on experience
    Given a technically correct prototype
    When the human says the experience feels wrong
    Then the mismatch remains open until addressed or explicitly deferred
    And useful corrections inform living intent
    And passing tests or silence do not establish experiential fit

@spec:EXD-001, EXD-002, EXD-004
  Scenario Outline: S8 Preserve hook timing and authorization through work intake
    Given a work request with consequential experiential uncertainty
    And design hooks are <configuration>
    When the work skill routes the uncertainty into experience discovery
    Then it reuses the brainstorm loop and any existing agreement or feedback
    And the core loop remains available regardless of hook configuration
    And an enabled nonblank discovery hook runs once at the existing final checkpoint
    And the hook receives interpretation, agreement scope, feedback and open questions
    And hook configuration does not authorize prototype creation
    And new hook findings are reconciled before handoff without recursive hook calls
    Examples:
      | configuration |
      | disabled      |
      | enabled blank |
      | enabled named |

  # Local replay fixture for the named hook: read the supplied context, report
  # the agreement scope and feedback received, and raise one new uncertainty.
  # Report an unsupported contract if asked to bypass agreement. Repeat S1–S5
  # through work intake; do not install this fixture as a global skill.

@spec:EXD-005
  Scenario: S9 Preserve learning without retaining every prototype
    Given a prototype has served its purpose and produced useful learning
    Then the living spec carries the learning independently of the prototype
    And existing user files are not automatically deleted
    And a permanent link to a discarded prototype is not required
