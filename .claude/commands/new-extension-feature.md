Add a new feature to the Chrome Manifest V3 extension.

## Instructions

The feature to implement: $ARGUMENTS

1. Check whether `extension/` exists. If not, scaffold the full extension structure first:
   - `extension/manifest.json` (MV3)
   - `extension/background/service-worker.ts`
   - `extension/content/inject.ts`
   - `extension/popup/popup.html` and `popup.ts`

2. Identify which extension layer(s) this feature touches:
   - **Background service worker** — API calls, auth token management, message handling
   - **Content script** — DOM injection, reading page context
   - **Popup** — user settings, login/logout, channel selection

3. Implement the feature following these rules:
   - All Hub API calls go through the background service worker via `chrome.runtime.sendMessage`
   - Never call `fetch` to external APIs from content scripts directly
   - Store all persistent state (token, channelId, settings) in `chrome.storage.local`
   - Use `chrome.action` (not `chrome.browserAction`)
   - Declare any new permissions in `manifest.json`

4. Update `manifest.json` if new permissions, host permissions, or web-accessible resources are needed.

5. Report what was added, which files changed, and any new permissions required.
