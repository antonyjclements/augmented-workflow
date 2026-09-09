Feature: Theory-building site narrative

  Manual browser acceptance checks for the `gh-pages` implementation.

@spec:TBS-001
  Scenario: The overview leads with continuity
    Given the overview page is open
    Then its opening frames continuity as the problem code alone cannot solve

@spec:TBS-002
  Scenario: The site treats evidence honestly
    Given either public page is open
    Then repository artifacts are presented as aids to reconstructing working theory

@spec:TBS-003
  Scenario: Agents are participants rather than the premise
    Given either public page is open
    Then agents are described as accountable contributors alongside people

@spec:TBS-004
  Scenario: The pages have distinct jobs
    Given the overview and technical pages are open
    Then the overview gives the narrative and the technical page explains the operating model

@spec:TBS-005
  Scenario: The public brand is current
    Given either public page is open
    Then Augmented Workflow is used as the canonical product name

@spec:TBS-006
  Scenario: Naur informs rather than overwhelms
    Given either public page is open
    Then the theory-building source is linked and its ideas are paraphrased in original language

@spec:TBS-007
  Scenario: The site avoids obsolete product claims
    Given either public page is open
    Then no legacy commands, fixed skill counts, or retired runtime claims are presented

@spec:TBS-008
  Scenario: The site uses direct, specific prose
    Given either public page is open
    Then its narrative avoids stock AI-marketing language and repetitive false contrasts

@spec:TBS-009
  Scenario: The site follows the current brand system
    Given either public page is open
    Then its navigation, identity assets, palette, and typography follow the approved style guide

@spec:TBS-010
  Scenario: The pages explain experience discovery
    Given the overview and technical pages are open
    Then they connect intent to what people should understand, accomplish, and feel
    And the technical page explains interpretation, suggestion, agreement, feedback, and learning
    And explicit prototype requests need no repeated approval while routine changes stay lightweight

@spec:TBS-011
  Scenario: Human feedback determines experiential fit
    Given the technical page is open
    Then it distinguishes functional correctness from experiential fit
    And it explains that useful learning survives disposable prototypes
