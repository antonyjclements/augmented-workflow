# Augmented Workflow — 45-minute speaker notes

Prepared 10 September 2026. Based on the fetched `gh-pages` content at `50dbe21`, with workflow details checked against `main` at `e33ad29` and CLI onboarding checked against the local `aw-cli` checkout at `a022615`.

**Delivery:** A spoken script for a mixed product, design, and engineering audience. Bracketed directions and source notes are for the presenter. The training-course application form is an invented example, not a customer story. Timings include pauses and short page walkthroughs; questions follow the 45 minutes. Read the prompts on screen as examples rather than running an unpredictable live implementation.

**Pacing:** Approximately 5,600 spoken words, excluding displayed prompts and presenter directions. At about 130 words per minute, this leaves roughly two minutes for page navigation, reading pauses, and emphasis. Treat the timestamps as rehearsal targets.

**Pages:** [Overview](https://antonyjclements.github.io/augmented-workflow/), [technical model](https://antonyjclements.github.io/augmented-workflow/technical.html), [usage guide](https://antonyjclements.github.io/augmented-workflow/usage-guide.html). Page cues below use visible section titles because most sections have no anchors.

| Time | Topic | Page to show |
| --- | --- | --- |
| 00:00–02:00 | Opening | Overview, opening |
| 02:00–08:00 | Naur and the problem of understanding | Overview, “Continuity breaks in ordinary moments” |
| 08:00–15:00 | What AI amplifies | Overview, “More participants, one standard of care” |
| 15:00–26:00 | How AW responds, and its limits | Overview evidence section, then technical model |
| 26:00–33:00 | Onboarding a repository and its contributors | Usage guide, “A simple first week”; repository files |
| 33:00–43:00 | Usage across product, design, and engineering | Usage guide, role sections and gate section |
| 43:00–45:00 | Close | Usage guide, closing |

## 00:00–02:00 — Opening

[Show the overview opening. Let people read the headline before speaking.]

Think of a part of your system that people are reluctant to change.

It might be a service with an unusual dependency. A screen that behaves differently for one kind of customer. A job that runs at a very particular time, for a reason nobody can quite remember.

The code is there. You can read it. You might even have tests that explain exactly what it does.

Then someone asks for a change, and the conversation slows down. Someone says, “We should check with whoever built this.” Or, “I think there was a reason we did it that way.”

[Pause for a few seconds.]

That situation is where I want to start, because it existed well before coding agents.

Today I’m going to talk about Augmented Workflow, or AW. It’s a way of keeping useful context in the repository so people and agents have a better basis for making the next change.

But the reason for doing that goes back much further. I want to begin with Peter Naur and an argument he made about programming in the 1980s. Then we’ll look at what changes when agents join the work, what AW tries to preserve, and where its limits are.

The last part will be practical: how to introduce it into a repository, and how product, design, and engineering can use it without turning every task into a documentation exercise.

Keep that awkward part of your own system in mind. As we go, consider what a new contributor would need to know before you’d be comfortable letting them change it.

## 02:00–05:00 — Naur’s backstory

[Stay on the overview. This is spoken background; it does not need a separate history slide.]

Peter Naur was a Danish computing pioneer. He edited the ALGOL 60 report, and his name is part of Backus–Naur Form, the notation many of us have encountered for describing programming language syntax. He later received the 2005 Turing Award for his contributions to programming language design and related work.

So this was someone with substantial experience making software precise enough for other people to implement and use.

[Source, not spoken: ACM’s announcement, preserved on [Naur’s website](https://www.naur.com/ACM.html).]

His essay, *Programming as Theory Building*, was published in 1985, following a keynote in Copenhagen in 1984.

Naur argued that programming develops a person’s understanding of how a program addresses its real-world problem. That understanding supports explanation and future changes; code and documents cannot fully convey it.

He described a compiler team handing its work to another group. The recipients had extensive documentation and personal advice. Yet they proposed awkward extensions where the original team could see simpler solutions within the existing design. Access to the written material had not transferred the same understanding.

His concern extended to staff changes: a program could keep running after the team that understood it had gone, while becoming difficult to adapt intelligently.

[Sources, not spoken: [publication details](https://doi.org/10.1016/0165-6074(85)90032-8); [Naur’s essay](https://pages.cs.wisc.edu/~remzi/Naur.pdf), especially “Programming and the Programmers’ Knowledge” and “Program Life, Death and Revival.” The historical account above is a brief paraphrase. The example that follows is this talk’s application.]

Here’s how I’d bring that into an ordinary product conversation.

Imagine an application form for a training course. It asks for your qualifications, employment history, and a supporting certificate. You can save an incomplete application and come back later.

Product sees people leaving halfway through and asks us to make the form quicker to complete. Someone suggests removing the separate save-and-return flow. Fewer steps sounds helpful.

But suppose conversations with applicants reveal why some of them leave. They need to find their certificate or ask their employer for information. They intend to come back. The save-and-return behavior was built to accommodate that pause.

Now we have something specific to protect as we simplify the form. We could put it on one page, change the wording, or remove unnecessary questions. People still need a reliable way to stop and resume.

Their task continues outside the software. Understanding that changes how we judge the proposed improvement.

## 05:00–08:00 — Understanding a system well enough to change it

[Scroll to “Continuity breaks in ordinary moments.” Allow about 15 seconds to scan the four situations.]

I want to stay with that form, because it shows how easily context gets separated from a result.

Suppose the engineer who built the save-and-return flow leaves the team. They’ve done a conscientious handover. There’s a README, a diagram, and a test called something like “restores a saved application.”

A month later, product asks why so many applications remain unfinished.

The new team can inspect the implementation. They can find the commit. They may have a ticket that says “support draft applications.” But they still need to understand why applicants stop, whether they return, and what would actually help them finish.

There’s a difference between being able to describe the current behavior and being able to make a good decision about changing it.

That distinction affects how I’d onboard someone. Reading is useful, but I’d also sit with them over an actual change. I’d ask them to explain why someone might need to save an incomplete form, then consider whether our current approach serves that person.

Perhaps they suggest saving automatically. That might help. We can then ask how the applicant knows it’s safe to leave and how they find their application again. Keeping the capability doesn’t require keeping every detail of the original design.

Their understanding develops as we look at the consequences together. The disagreement is useful. It shows us which assumptions we haven’t made clear.

The same exercise can reveal that the existing team has drifted apart. Product may count every departure as abandonment. Engineering may assume saved applications are easy to find. Design may never have watched someone return after several days.

Nobody has to be careless for that to happen. Each person has encountered a different part of the work.

So when I look at these four situations on the page—a requirement changes, a decision loses its reason, a person joins, an agent starts fresh—I see several ways that the next change can begin with an incomplete account of the system.

AW’s response is to give that next contributor better material to work with. The team still has to discuss what the material means and decide whether it remains useful.

That’s the connection I’m making to Naur. It’s an application of his concern to this workflow. I’m not claiming that he anticipated or endorsed AW.

## 08:00–11:30 — AI makes missing context more consequential

[Move to “More participants, one standard of care.”]

Now let’s put an agent into the form example.

We ask it to “simplify the form.” It sees the separate save-and-return flow as extra complexity and removes it. It updates the screens, adjusts the tests, and gives us a clear summary.

We asked for something easier to use. The agent assumed that meant fewer actions and less behavior. That assumption has become a product decision before we’ve discussed what applicants need.

The missing part was why applicants need to pause. If that reason exists only in someone’s memory or an old conversation the agent never sees, the agent has to work from what it can find.

It may infer an explanation from the code. That explanation could be useful, but we need to know that it’s an inference. An explanation written in confident prose can be easy to accept, especially when it sounds like the sort of thing our team would have decided.

I’m describing a failure mode here, not claiming every agent behaves this way. The practical issue is that we need to distinguish a reason someone actually recorded from a plausible account reconstructed later.

There’s also the amount of work we can ask for.

If a tool lets us produce changes more quickly, we can put more changes in front of reviewers. The time it takes to judge a product assumption doesn’t necessarily fall at the same rate.

A reviewer still has to ask whether applicants can realistically finish in one sitting, what happens to their information when they leave, and whether they understand how to return.

If that reasoning is missing, every review has to reconstruct it. Some reviews will do that carefully. Under pressure, others may stop at whether the implementation looks sensible and the tests pass.

Then consider a fresh session. Yesterday we explained that applicants often leave to find a certificate. Today another session starts from the repository and sees only a generic request to reduce unfinished applications.

We can paste the correction again. We can maintain a personal prompt with everything we remember. But that leaves the team depending on who happened to start the session and what they remembered to include.

This also affects two humans working together. If I know something that changes how you should approach a feature, leaving it in my own conversation doesn’t help you find it.

Agents make this problem easier to encounter because we can start a new conversation whenever we want. Each one needs a useful account of the work it’s entering.

[Pause. Point to the people and agents columns.]

The question I want a reviewer to be able to answer is: what did this contributor base the change on?

That should have an inspectable answer.

## 11:30–15:00 — More written output can still leave us uncertain

There’s an obvious response to missing context: ask the agent to document everything.

I’d be careful about that.

Suppose every session produces a long summary. Each summary describes the repository, lists the files changed, and gives a polished explanation of the architecture. After a few weeks we have a lot of text.

Now someone needs to know whether applicants must be able to save an incomplete form. Which file should they trust?

One summary says the application should be completed in one sitting. Another says people need to return later. A plan describes an approach we abandoned. The current implementation has behavior that nobody explicitly agreed to.

The reader has to establish which statement is current, which was a proposal, and which was an observation. We’ve preserved material, but we’ve also created more work for the next person.

That’s why the type of information matters.

“This is the expected behavior today” has a different job from “This is why we chose it last month.” Both matter. We need to be able to change the first without pretending that the second never happened.

“We tried this and it failed” is useful for a different reason. It can save someone from repeating an investigation. But a failed attempt isn’t automatically a permanent rule about the system.

And “these tests passed” tells us something specific about what was checked. It doesn’t tell us that every relevant user experience was examined.

The other risk is that people stop doing enough of the work to develop their own understanding. If an agent supplies the implementation, its explanation, and the test cases, we can end up reviewing several outputs that all share the same mistaken assumption.

For our example, the implementation might require every field before saving. The explanation might say that only complete applications should be stored. The tests might cover successful submission and rejection of incomplete forms.

Those outputs agree with each other. We still need to consider someone who has filled in half the form and needs to stop.

I’d want someone to ask: what happens when they go looking for that certificate? Will their work be there tomorrow? Do they know how to get back to it?

We’re building software that people use. They bring expectations, interruptions, and concerns that our code can only partly describe. A form can accept every valid submission and still make it difficult for someone to reach that point.

That’s why conversations remain part of the work. We need to ask people what they’re trying to accomplish and watch where our interpretation falls short. Agents can help us investigate and prepare examples to inspect. We then need to preserve what we learn in a form the next session can find.

That brings us to the structure AW uses.

## 15:00–19:00 — Give each kind of evidence a clear home

[Show the overview’s “Leave evidence people can use,” then the technical model’s “Evidence has different jobs.”]

Augmented Workflow keeps several kinds of context beside the code. The files are ordinary repository files, which means they can travel with a branch and be reviewed alongside a change.

Let’s use the application form to make each one concrete.

A living spec describes the expected behavior now. For this example, it might say that applicants can save an incomplete application, leave, and resume with their saved information intact. Submitting a completed application is a separate action.

It should include examples that make those statements testable. Someone saves without their certificate, returns later, adds it, and submits. Missing information can prevent submission while still allowing a draft to be saved. If product changes its mind, this is where the current intent changes.

A decision record explains a consequential choice. We might record why we kept an explicit “Save and return later” action, what alternatives we considered, and why reassurance about saving mattered to applicants.

Later, we may replace that choice. We preserve the old record and add the new reasoning, so someone can understand what changed. Rewriting history to make the latest choice look inevitable would remove useful context.

A learning captures a correction that should affect future work. Suppose an investigation shows that the draft-saving code reused submission checks and rejected incomplete applications. A useful learning explains how those checks were confused and where future changes need to preserve the distinction.

It needs a sensible scope. This application needs incomplete drafts. That doesn’t mean every form in the organization needs the same behavior.

Verification records show what we actually checked. We might have tests covering saving and reopening an incomplete application. We might also have inspected the form on a narrow screen and asked someone to show us how they would leave and return.

Those checks support different kinds of confidence. A reviewer should be able to see the difference and spot what remains untested.

[Give the audience about 15 seconds to read the four evidence types.]

There are other useful files around those four. Standards record conventions that apply across work in this repository. A product requirements document can preserve the input that led to the feature. A plan describes how we intend to implement a particular change.

These have different lifetimes. A plan may be finished and disposable while the feature’s intent remains relevant for years.

This separation helps when documents disagree. If an old plan says to remove drafts, and the current spec says to preserve incomplete applications, we can recognize the old plan as historical execution material. We should still investigate a real contradiction, but we have a basis for deciding where to start.

There’s a cost here. Somebody has to keep current intent current and judge whether a lesson is worth preserving. AW gives that work a place and a procedure. It doesn’t make the cost disappear.

I’d judge whether the cost is worthwhile by looking at the next change. Did these files help us make a decision we would otherwise have had to reconstruct?

## 19:00–22:30 — Renew the evidence while doing the work

[Scroll to “Evidence is renewed through the work.”]

The technical page describes a loop: frame the work, make the change, check it, capture what mattered, and carry that forward.

For the form, framing means reading the current requirement and the reason for saving drafts before deciding how to help more people finish.

We might discover that people successfully save their applications but struggle to find them again. Making the return path clearer would address that problem while preserving the ability to pause.

During implementation, we may find an assumption we hadn’t discussed. Perhaps saved drafts expire before people expect. That should come back into the conversation because it affects what we can promise the applicant.

Afterward, we check the changed behavior against the cases we agreed. If the work changed our understanding, we update the relevant evidence before everyone moves on.

That could mean changing the spec. It could mean recording a decision. Sometimes there’s no new durable knowledge to capture, and a concise account of the work is enough.

Session logs provide a place for that account. They can preserve what was attempted, useful corrections, and unresolved questions without declaring every observation a permanent rule.

AW also has a synthesis step. It processes session material into useful learnings and regenerates a context wiki for orientation. That wiki is a generated briefing. If it’s stale or a claim matters to a decision, we go back to the source artifacts.

The useful habit is to keep the record proportional to what someone will need later. We don’t need a polished essay about a straightforward rename. We may need a careful account of why an apparently straightforward change was unsafe.

[Point to “Test the intended experience before building.”]

The same loop applies when we’re uncertain about the experience.

Suppose we ask for a form that feels less daunting. An agent could interpret that as fewer screens and less text. Design might mean that applicants understand what information they need and feel confident they can stop without losing their work.

It helps to expose that interpretation before building the feature. AW’s brainstorming flow can suggest a small disposable prototype and explain what it would clarify. The team agrees to that scope, or explicitly asks for the prototype in the first place, then reacts to the result.

We might discover that the form looks simpler but someone is still afraid to close it because they can’t tell whether their answers are saved. That observation belongs in the evolving intent.

The prototype can be discarded. The useful conclusion survives.

Clear, routine changes don’t need this extra loop. It earns its place when looking at an example will settle something that words alone haven’t settled.

## 22:30–26:00 — What AW can check, and what people still decide

[Show “What a deterministic layer can establish.”]

Some parts of this workflow can be checked mechanically.

Does a required artifact exist? Is it indexed? Does a reference resolve? Is there a recorded review, and is it still fresh under this repository’s policy?

AW provides an optional helper called `aw-gate.js` for checks of this kind. The exact checks depend on what the team installs and enables.

The page uses the example of asking children to wash their hands before dinner. You can look for observable evidence that the expected activity happened. Evidence helps you decide whether to trust the process, with limits on what you can conclude from it.

For software, those limits deserve attention.

A gate can establish that review evidence is present and current. That doesn’t tell us whether the reviewer noticed that the form’s saving message was misleading.

Traceability can connect an acceptance criterion to a test. We still need to inspect whether the test covers the behavior that matters. A link to a weak test remains a link to a weak test.

For the form, an automated check may show that a test exists for saving an application. We have to examine whether it covers an incomplete draft or only a fully completed submission.

I find this useful because it separates omissions that are cheap to detect from questions that require attention. If a script can tell me a reference is broken, I don’t want to spend review time discovering that manually.

I do want to spend time discussing whether an applicant knows it’s safe to leave and how to return.

[Pause briefly on the “Questions people still answer” column.]

There are limits to the whole approach as well.

If nobody reads or maintains the spec, it can become another misleading document. If every local observation gets promoted to a standard, the repository accumulates rules that conflict or no longer apply.

If an agent writes a plausible decision after implementation and we accept it without checking, we may preserve a reason nobody actually used.

And if the team loses the people who understand a critical area, the remaining files can help the next team investigate, but that investigation still takes work. They may need to speak with users, inspect production behavior, and test explanations against real cases.

So AW attempts to reduce some specific difficulties: finding current intent, recovering the reasons for choices, carrying corrections between sessions, and inspecting what was verified.

Its usefulness depends on people exercising judgment over those records. We need to question them when reality disagrees.

That’s also how I’d introduce AW to a team. Give it a real problem where this information would help, then see whether it makes the next conversation easier.

## 26:00–29:30 — Onboard the repository

[Open the usage guide at “A simple first week.” Keep the repository README available in a second tab.]

Let’s make that concrete. You have an existing repository and want to try this.

I’d choose one meaningful feature that people are actively changing. Pick something small enough to understand together, but substantial enough that its reasons matter.

Our application form would work. We know there’s a behavior to clarify, a decision worth recording, and a change coming soon.

For onboarding, we use the AW command-line tool. With Python 3.11 or later and `pipx` available, install the CLI, then install the shared skills. Move into the repository you want to work on and initialize it.

[Show these examples. Do not execute them during the talk.]

```bash
pipx install git+https://github.com/antonyjclements/aw-cli.git
aw install
cd /path/to/target/repo
aw init
aw doctor
aw status
```

`aw install` installs the skills globally and links supported agent directories. `aw init` sets up the current repository. `aw doctor` checks the global skill installation, and `aw status` reports the repository’s installation state.

Then review `AGENTS.md` and `docs/workflow/config.yml`. The CLI asks before replacing changed existing files. It also installs the gate helper and enables tracking and several verification features by default, so review those settings for your team.

`AGENTS.md` gives the agent its routing and task-triage instructions. The agent uses those to choose an appropriate workflow. The configuration controls how the selected steps run. Check that your agent can discover the skills and load the repository instructions; that’s what makes this usable from an ordinary request.

For the first feature, I’d ask the agent to read the existing implementation and describe the behavior it can establish. Then I’d review that description with someone who knows the feature.

We need to distinguish what the software does today from what we want it to do. If there’s a disagreement, write it down as an open question. We shouldn’t silently turn every existing behavior into a requirement.

Next, capture one decision we can explain honestly. For our example, that might be the decision to let applicants save before they have all the required information. Include the reason and the consequences.

If the original reason is unknown, say so. We can make a new decision based on present evidence. There’s no value in giving an invented history an official-looking filename.

Then use that spec and decision for the next piece of work. Review the result and capture a correction if it would help a future contributor.

That gives us a modest first week: one feature with current intent, one useful decision, and a review that leaves something worth reusing.

[Spend about 20 seconds locating the two configuration files and the feature spec path. If using only the site, point to the first-week checklist instead.]

## 29:30–33:00 — Onboard people and fresh agent sessions

Installing the workflow gives us the files. Onboarding a contributor means helping them use those files to understand actual work.

For a person joining the team, I’d begin with the README, the relevant feature spec, and a few decisions connected to their first task. I’d use the context wiki as an orientation aid if it’s current.

I wouldn’t ask them to absorb the entire documentation tree before doing anything useful.

Take a real example together. An applicant has entered their employment history but needs to find their certificate. Ask the new contributor to explain how that person leaves and returns, where the behavior is described, and what they’d inspect before changing it.

That conversation tells us much more than asking whether they’ve read the documentation. It can also reveal a gap in the documentation that the rest of the team has learned to work around.

For an agent session, AW’s routing should establish that starting point. Reading the repository instructions, finding relevant context, and choosing the workflow are part of the agent’s job. We shouldn’t have to repeat those instructions in every request.

Here’s an example prompt.

```text
People leave the course application halfway through. Help me understand
why we have a save-and-return flow and what would happen if we removed it.
```

The request supplies the problem. The agent should investigate before proposing a change, drawing on the relevant evidence. Its explanation is something we can inspect. If it’s wrong, we can correct it, and preserve a useful correction for future work.

There’s a responsibility question here too. Product needs to review product intent. Design needs to review the interaction requirements. Engineering needs to examine how the proposed change fits the system.

An agent can help prepare all of that material. The people responsible for the result still need to recognize the decisions they’re making.

The CLI has already installed the gate helper and enabled several checks. The team should review and adjust those policies against the omissions it needs to catch, rather than assuming the defaults settle every question.

For example, if reviews keep finding behavior changes with no spec update, a check around that evidence may be useful. If we’re repeatedly losing corrections between sessions, the first improvement may simply be better capture and regular synthesis.

The agent’s triage should reflect the consequences of a mistake and how difficult it would be to undo. A wording correction may need a direct edit and a focused check. A change that could lose data needs a more careful path, even if it only touches a few lines.

We can inspect that choice and correct it. But choosing the path is a responsibility AW gives the agent. People should be able to describe their work without memorizing the skill sequence.

## 33:00–36:00 — Product usage: clarify the outcome

[Go to the usage guide’s “A universal first move,” then “Product: name what must be true.”]

The usage guide offers `aw-help` when you want guidance about the workflow. You can also describe the work directly. Agent routing is a central feature of AW: the agent should recognize what the request needs and follow the repository’s task-triage rules.

Let’s walk the application form through product, design, and engineering. This is an illustrative sequence; the right entry point depends on what’s already clear.

Suppose product brings this request: “Too many applications are unfinished. Can we make the form easier to complete?”

There’s enough there to begin a conversation, but several questions remain open. Where do people stop? Do they return? Are they confused by a question, or waiting for information? We need to understand which difficulty we’re addressing.

The agent should recognize that ambiguity and take the discovery route. Underneath, that may involve `aw-brainstorm`, or preserving an existing requirements document with `aw-prd`. Those names describe the available procedures. Product can begin with the problem it needs to resolve.

[Show the prompt and allow a short reading pause.]

```text
Applicants need to pause while they find information, but some struggle
to return and finish. Help us make that easier. We're keeping the course
eligibility requirements unchanged.
```

Product’s contribution is to decide what must be true for the user and where the boundaries are.

For our example, we might agree that someone can save without their certificate, find the saved application when they return, and see what remains to be completed. We can improve that experience while keeping the same eligibility requirements.

Those choices give design and engineering something specific to examine. They may find a missing case or explain that a distinction is difficult to implement reliably.

When that happens, we return to the requirement. We don’t need to defend the first wording just because it’s in a file.

The spec remains useful when it reflects those decisions. If the team later agrees to change which information is required, the current intent should show that change. The original product request can remain as historical input.

During review, product should also inspect the result against the intended outcome. A feature can satisfy a narrow reading of a ticket and still leave the applicant struggling to finish.

That review gives us another chance to catch a misunderstanding before it becomes somebody else’s inherited behavior.

## 36:00–39:00 — Design usage: make the experience inspectable

[Move to “Design: make the experience concrete.”]

Design now has a more specific problem to work with. Applicants need to feel confident leaving an incomplete form and understand how to continue when they return.

The form itself is only part of that experience. What happens while a draft is saving? What happens if saving fails? What does someone see when they return to an application with information still missing?

We also need to consider someone returning after several days, someone using a keyboard, and someone completing the form on a narrow screen.

Those details often reveal decisions that the original request didn’t contain.

For example, suppose someone saves a draft without their certificate. Should the next screen show what is still needed? Explain how to return? How do we make it clear that saving hasn’t submitted the application?

Design can try different wording and arrangements, make the consequences visible, and explain the choice the team makes. The applicant should be able to tell what just happened.

Here’s a request where the agent should recognize that the experience needs clarification.

```text
We're unsure whether applicants can tell that their draft is saved
and how to return to it. Help us work through that experience using
our design references.
```

The agent can route this into experience discovery and suggest a prototype if it would help. The team agrees to a suggested prototype before work starts. An explicit request to create one already gives permission for its stated scope.

When we inspect it, we should try the uncertain situation. Ask someone to stop midway because they need to find a certificate. Can they tell whether their answers are saved? Can they find where to continue without us explaining it?

That’s a more useful review than simply deciding whether we like the screen.

We preserve the interaction requirement and any consequential reasoning. We can keep a reference to the design material where it helps. We don’t have to keep the prototype forever.

Teams with an established design process can configure discovery and review hooks in the workflow configuration. Those are optional integration points. The ordinary experience discovery loop doesn’t require a separate design setup.

Later, design should inspect the implementation as well. Working controls and passing tests don’t establish that someone understands whether they’ve saved or submitted. A human reaction can expose a problem that the functional checks weren’t designed to answer.

If the result remains confusing, that uncertainty should remain visible. We shouldn’t turn “the tests passed” into a claim that the experience has been accepted.

## 39:00–43:00 — Engineering usage: implement and return evidence

[Move to “Engineering: make change explainable,” then the gate section.]

Engineering begins with the current intent and the relevant history. For our example, that includes how drafts are saved, why incomplete applications are allowed, and the agreed experience when someone returns.

The agent should assess the change before selecting its implementation path. If the service needs to support reopening drafts before the interface can offer a return path, the agent may need a plan to make that dependency explicit.

For a contained change with a clear approach, it can take a shorter path. This is where routing selects the appropriate steps, including the repository’s configured implementation procedure. We can also start from a ticket, provided it doesn’t conflict with current intent.

[Show this example.]

```text
Implement the agreed save-and-return improvements in
docs/features/course-application/spec.md. Leave the change ready for review.
```

The path here is an example of where our hypothetical spec would live. We’ve supplied the intended work and its scope. The agent should handle context gathering, task triage, and the applicable checks without us listing them in the prompt.

For this feature, I’d expect checks around saving without a certificate, reopening the draft with its answers intact, and submitting once the required information is complete. Saving failures need attention too. The exact test level depends on the system and the repository’s policy.

We should also be precise about manual checks. “Saved an incomplete form and found it again on a narrow screen” is more useful than “UI looks good.” It lets another person understand the extent of the inspection.

Then we review. `aw-review` can examine the work, including whether behavior has drifted from the spec. The team still needs to consider the findings and the product result.

If we discover a consequential choice during implementation, capture the decision. If we correct a misunderstanding that would probably recur, capture a learning. A session log can preserve other useful context without promoting all of it into permanent guidance.

When the change is ready and shipping is authorized, `aw-commit-push-pr` handles that delivery step. The configured workflow determines the applicable checks and any post-PR monitoring. We should report checks that couldn’t run so the reviewer can judge the gap.

[Point to the gate commands.]

For repositories that have installed the helper, the usage guide shows two commands worth knowing.

```bash
node .scripts/aw-gate.js validate
node .scripts/aw-gate.js check
```

`validate` checks supported artifact structure and references. `check` evaluates freshness evidence under the configured policy. A team can wire the latter into delivery when it’s ready to enforce that policy.

We run these because missing or stale evidence is worth catching. Their output still needs to be interpreted within the checks that are actually enabled.

[Allow around 20 seconds to trace Validate, Record, Enforce, and Interpret on the page.]

Finally, think about the contributor who picks this up next month. They should be able to find how saving differs from submitting, why applicants need to pause, and what we verified about the change.

They might disagree with the decision. They might discover that user needs have changed. That’s fine. We’ve given them something concrete to examine and revise.

If all they inherit is “simplified application form, tests passing,” they’ll have to repeat much more of our work before making an informed change.

## 43:00–45:00 — Close

[Show the usage guide’s closing section.]

Go back to the part of your system you thought of at the beginning.

Imagine handing someone a change request for it tomorrow. What would help them make a decision you could review with confidence?

Perhaps it’s a clear statement of the behavior that matters. Perhaps it’s the reason for an unusual constraint. Perhaps it’s the record of a failed approach that would otherwise look appealing again.

That’s a useful place to begin with AW.

Choose one feature you’re about to change. Check that its current intent is understandable. Record a decision you expect someone to question later. After the work, leave a clear account of what was verified and preserve any correction worth reusing.

Then see what happens when another person or a fresh agent session picks it up. Ask them to explain the feature and propose a change. Where do they hesitate? What do they misunderstand? Which record actually helps?

Use that experience to decide what to add or improve.

The standard I’d use for this workflow is whether it helps the next contributor reason about the software. That depends on what the records say, why they exist, and whether we update them when the work changes.

We’re building software that people use. Someone leaving our form may be looking for a certificate, not giving up on the course. Conversations help us understand that difference. They let us judge whether an improvement actually helps the person finish what they came to do.

AW gives those conversations somewhere to leave the conclusions that matter. Its routing helps an agent find that context and choose how to approach the next task. We still have to judge whether the result serves the people it’s for.

Thank you.

[Pause, then invite questions.]

## Presenter reference — not part of the spoken script

### Rehearsal and navigation

- Rehearse once with the pages open. Use the section timestamps as checkpoints, allowing natural pauses rather than rushing to read every sentence.
- Be entering onboarding at 26 minutes and usage at 33 minutes. Preserve those sections if the opening runs long.
- To recover roughly two minutes, shorten the additional handover examples at 05:00–08:00 and the documentation-overload example at 11:30–15:00. Keep the Naur account, the evidence distinctions, and the practical prompts.
- If the 45-minute slot must include five minutes of questions, use those cuts and shorten the worked examples in onboarding and design by another three minutes. The main script assumes questions afterward.
- No live installation or implementation is required. Commands are display examples; the course-application spec path is hypothetical.
- The form is the spoken running example. The public usage guide still uses its own notification example; use the role sections to explain the workflow without switching stories.

### Source map

- Opening, continuity, and evidence framing: `gh-pages:index.html`, fetched at `50dbe21`; [overview source at that revision](https://github.com/antonyjclements/agentic-workflow/blob/50dbe21/index.html).
- Evidence lifecycle, experience discovery, agent participation, and limits of deterministic checks: `gh-pages:technical.html`; [technical source at that revision](https://github.com/antonyjclements/agentic-workflow/blob/50dbe21/technical.html).
- Role contributions, `aw-help`, gate commands, and first-week adoption: `gh-pages:usage-guide.html`; [usage guide source at that revision](https://github.com/antonyjclements/agentic-workflow/blob/50dbe21/usage-guide.html).
- Installation, available skills, session synthesis, configuration, and workflow examples: [repository README](../../README.md) and [workflow field guide](../workflow/field-guide.md), checked at `e33ad29`. Operational detail supplements the public pages.
- CLI onboarding commands and defaults: [AW CLI README at a022615](https://github.com/antonyjclements/aw-cli/blob/a022615/README.md), checked against the local checkout and CLI argument definitions. Python 3.11+ and `pipx` are prerequisites. Task triage and step routing: [AGENTS.md](../../AGENTS.md) and [workflow configuration documentation](../workflow/README.md).
- Naur’s background: [ACM award announcement](https://www.naur.com/ACM.html).
- Essay date and keynote provenance: [publisher record](https://doi.org/10.1016/0165-6074(85)90032-8).
- Brief theory-building and compiler handover account: [Programming as Theory Building](https://pages.cs.wisc.edu/~remzi/Naur.pdf). No direct quotations are used.
- The course-application scenario, suggested adoption conversations, and discussion of AI failure modes are illustrative applications for this talk. They are not measured outcomes, historical anecdotes, or claims made by Naur. The example concerns preserving the ability to pause and resume; it does not imply that a one-page form cannot support saving.
