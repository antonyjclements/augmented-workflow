Feature: Product feedback triage

  Manual acceptance scenarios, not an automated model runner.
  Maintainer walkthrough outcomes are recorded in validation.md.

@spec:AWFB-001
  Scenario: Separate a reported display defect from a proposed cause
    Given build 63 photos show clipped and unchanged shield content
    And diagnostics place grace after time-up Continue
    When the feedback is reconciled
    Then the display concern is actionable but early grace is not declared proven
    And missing physical presentation evidence remains explicit

@spec:AWFB-001, AWFB-002
  Scenario: Split ready scope and reconcile accepted policy
    Given issue 29 has accepted seven-day work and unresolved free-day questions in its dated snapshot
    And issue 20 proposes a reward policy explicitly rejected by the owner
    When the feedback is reconciled
    Then ready seven-day work is separated from the policy questions
    And the rejected reward proposal does not supersede the accepted decision
    And a repeat run reuses the existing concern identifiers

@spec:AWFB-003
  Scenario: Distinguish availability from device acceptance and follow later corrections
    Given a release message reports build 81 available with device checks outstanding
    When the feedback is reconciled
    Then its fixes remain awaiting retest rather than confirmed
    When the owner says build 86 will supersede 81 for those testers
    Then the next checklist tells testers to wait for 86
    And it does not claim 86 is available before release confirmation

@spec:AWFB-004
  Scenario: Honor source defaults, provider routing and publication scope
    Given configured GitHub repositories and Slack channels
    When the user supplies one issue and requests drafts only
    Then investigation stays bounded to that issue and necessary linked context
    And drafts do not become posts or issue edits
    And an unavailable enterprise Slack provider is reported rather than bypassed
    And supplied notes still work when source configuration is absent
