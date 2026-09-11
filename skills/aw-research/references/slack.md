# Research in Slack

Read this reference only after Slack has been selected as a source.

## Resolve Access

Read `docs/workflow/config.yml` when present. If `workflow.auxiliary.research_slack.skill` names an enterprise skill, invoke it with the question, relevant artifact context, channel/date scope, and the findings contract below. It replaces direct Slack access for this investigation. If the value is `aw-research`, continue here rather than recursively invoking this skill.

If a configured skill is unavailable, report the blocked Slack route; do not bypass it with direct tools. Continue any independent research in other selected sources. If the custom skill cannot fulfill part of the contract, identify that gap in the returned findings.

When the override is blank, missing, or `aw-research`, discover the Slack search and thread-reading tools provided by the environment, including MCP. Inspect their schemas and supported filters before use; do not assume server names, search syntax, or workspace access. If no usable Slack tools are available, say Slack was not searched and continue with other selected sources.

## Search and Read Context

- Honor the user's workspace, channel, and date scope. Start with distinctive feature names, error text, project aliases, or linked threads. Use supported filters to keep results relevant; widen or vary queries only when the question remains unresolved and within the authorized scope.
- Follow result and thread pagination while more context is needed to answer the question. If stopping before all relevant pages are read, report the partial coverage; do not treat the first page as the complete search or conversation.
- Use search hits to locate conversations, then read the parent message and relevant replies before drawing conclusions. If thread retrieval is unavailable, label findings as based on partial context.
- Look for later corrections, reversals, linked specs, tickets, or decision records. Compare dates and context before treating a discussion as the current position.
- Distinguish a proposal, individual opinion, reported behavior, and explicit decision. Reactions and repeated mentions alone do not establish agreement. Do not infer someone's role or decision authority from their name.
- Deduplicate findings from the same conversation. Follow linked sources only when accessible and needed to substantiate the answer.

## Findings Contract

Return the answer with supporting thread/message permalinks, channel and date when available, the relevant context, and any conflicting or superseding evidence. Obtain links from tool results or supported permalink tools; never invent them. If a link cannot be obtained, identify the available message reference and the citation limitation.

Summarize only the content needed to answer the question. Avoid copying entire threads or unrelated personal details into repository artifacts. State which channels/date ranges were searched and whether access, pagination, or partial thread retrieval limits the conclusions. No results means no evidence was found within that search, not that a discussion or decision never happened.

Slack research is read-only. Posting, reacting, joining channels, or contacting people requires a separate user request. Suggested follow-up questions can be returned to the user without sending them.
