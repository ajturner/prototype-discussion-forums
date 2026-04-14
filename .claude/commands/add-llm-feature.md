Implement an LLM-powered discussion feature using the Claude API.

## Instructions

The feature to implement: $ARGUMENTS

Valid feature types: post moderation, thread summarization, topic clustering, automated data-driven response.

1. Confirm the feature will run **only** in the extension background service worker or a server-side proxy — never in a content script or web component directly. State this explicitly before proceeding.

2. Install `@anthropic-ai/sdk` if not already in `package.json`.

3. Implement the feature in `extension/background/` (or a new `server/` directory for proxy use cases):
   - Use `claude-sonnet-4-6` as the default model
   - Use `claude-opus-4-6` for complex multi-document analysis (clustering, long summaries)
   - Always request structured JSON output for machine-consumed results
   - Include a focused system prompt explaining the task and output format
   - Wrap in try/catch and return a safe fallback on failure

4. Wire the feature into the messaging layer:
   - Add a new `msg.type` constant in the background service worker
   - Expose it to content scripts / popup via `chrome.runtime.sendMessage`

5. If the feature needs to surface results in the UI, identify which Web Component prop or event should carry the data and note the integration point without implementing the UI change (unless asked).

6. Report: which model is used, what the input/output shapes are, where in the codebase it lives, and how to trigger it.
