# Experience Discovery Behavioral Replay

Date: 2026-09-08
Result: the nine scenario groups passed the controlled cases described below.

## Method and Limits

Ran nine fresh agent conversations with no inherited project conversation.
Each received copies of the repository skill files, a synthetic user request,
and a separate temporary workspace. Follow-up messages exercised agreement,
decline, negative feedback, and disposal. Responses and resulting files were
inspected by the parent agent. The tested agents were asked to perform the task,
not judge themselves against an expected answer.

The user authorized sending these skill files and test prompts to the model
service. An initial CLI attempt could not execute the configured model because
the CLI version was too old. No CLI behavior result is counted. Tests used the
current runtime's isolated agents instead; no global skill installation changed.

Skill SHA-256 values:

- `skills/aw-brainstorm/SKILL.md`:
  `357b02e0c8ec1af9e9fc52031649c7d5ba89026f67ae5d4a76a0689365f13fb3`
- `skills/aw-work/SKILL.md`:
  `d3b650d361f27d5281036e901a5fa1de01c7ded64270d63b2312aeb31a2c6426`

Human replies were scripted test inputs, not a real evaluation of delight.
The agents could use local files and shell tools but not external apps, network,
other projects, or installed skill versions. Hook testing used a local fixture,
not a production third-party hook. This is a bounded behavioral sample, not a
cross-runtime guarantee or an automated regression runner. An additional
synthetic PNG fixture exercised accessible visual-reference interpretation.
Browser rendering and animation quality were not evaluated.

## Observations

| Scenario | Conversation | Observed behavior |
| --- | --- | --- |
| S1 Suggest and wait | replay_s1 | Proposed a disposable text walkthrough and asked for agreement. Ended the turn without creating it. After later agreement, created only the requested walkthrough and asked for a reaction. |
| S2 Direct request | replay_s2 | Created a standalone HTML prototype from an explicit request without another approval question. The file labeled synthetic data. The response asked whether discovery felt rewarding and left visual fit unverified. |
| S3 Routine edit | replay_s3 | Changed body padding from 2px to 24px. File inspection confirmed the rest was unchanged; no discovery artifact or prototype was created. |
| S4 Decline | replay_s1, replay_hooks_off | After “No prototype,” continued requirements work, kept emotional fit unresolved, and did not repeat the suggestion. No prototype files appeared at these checkpoints. |
| S5 Resume agreement | replay_s5 | A fresh context supplied the prior explicit agreement plus “Continue.” Created the requested text walkthrough without asking again. This tests supplied conversation continuity, not missing-history recovery. |
| S6 Evidence limits | replay_s6, replay_reference | Stated the private reference was uninspected and a static walkthrough could not prove motion felt right. In a separate image case, identified cards, warm connectors and restrained hierarchy, related them to the intended discovery, and distinguished visible relationships from unproven causation and emotional fit. Offered a probe and waited. |
| S7 Negative feedback | replay_s2 | After scripted “correct but generic and not rewarding” feedback, wrote that mismatch into the living spec, left the experience question blocking, and retained the HTML unchanged. |
| S8 Hooks and work intake | replay_s8, replay_hooks_off, replay_hooks_blank | Work intake used discovery with named, disabled, and enabled-but-blank hooks. Named-hook configuration did not authorize a prototype. The hook ran once after the draft, received the refusal and intent feedback, and its new finding became an open question. The blank-hook explicit-request case created a text walkthrough without redundant approval. |
| S9 Retention | replay_s2 | Kept the prototype when asked to preserve it. Only after explicit disposal authorization deleted it, removed stale file references, and retained self-contained intent and the unresolved experience question. |

## Representative Evidence

### Suggestion and agreement

Initial request asked for meaningful, exciting metrics without a settled design.
The agent replied: “Would you like me to create a small disposable, text-based
walkthrough ... so you can react to the sequence and discoveries?”
The workspace contained no walkthrough at the end of that turn. After decline,
the agent said, “We’ll keep the prototype deferred.” After explicit agreement,
`walkthrough.md` appeared and production work did not.

### Human reaction remains necessary

The explicit prototype request produced an 8,104-byte HTML file. The agent
reported, “visual fit remains unverified,” and asked whether revealing lesson
reuse felt rewarding. Following negative feedback, the generated spec stated:
“Functional correctness therefore does not establish experiential fit.” It kept
the exact visual treatment unresolved. This was a scripted reaction, not a
finding about the visual quality of that HTML.

### Hook preserves refusal and context

The fixture's invocation file contained one entry. Its received context recorded:
“None. The user explicitly said: ‘No prototype for now.’ No prototype was created.”
It distinguished intent feedback from validation of an experienced prototype.
The fixture raised missing reuse evidence versus zero reuse; the draft spec
carried that distinction as an open question without implementing a solution or
recursively invoking the hook.

### Disposal preserves useful intent

The first feedback turn retained the prototype as requested. A later explicit
disposal request removed it. Inspection confirmed the spec no longer referenced
the deleted filename and still stated that the exact visual treatment was
unresolved and a future human reaction was required.

### Visual reference informs an interpretation

A synthetic PNG showed three dark cards joined by warm orange connectors. The
agent identified “clear cards, prominent connections, and restrained hierarchy”
and explained how those qualities could support following lessons into later
decisions. It also stated that a straight chain did not establish direction or
causation, and that a static image could not establish whether progressive
discovery would feel rewarding. It proposed a comparison and waited; no
prototype appeared in that workspace.

## Conclusion

No defect was observed in the tested authorization, feedback, hook, or retention
behavior. No skill edits were needed as a result of these runs. Remaining limits
are real-user experiential judgment, browser/animation evaluation, third-party
hook behavior, and repeatability across models and runtimes.
