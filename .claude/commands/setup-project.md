Replace template placeholders and set up the project for active development.

## Instructions

1. Read `package.json`, `stencil.config.ts`, and `src/index.html`.

2. Replace all occurrences of `REPLACE_PROJECT_NAME` with `prototype-discussion-forums` in:
   - `package.json` — `name` field and `repository.url`
   - `stencil.config.ts` — `namespace`
   - `src/index.html` — script `src` attributes and `<title>`

3. Update `src/index.html` to mount `<discussion-panel>` instead of the generic `<prototype>` component.

4. Create the `src/data/` directory and add a `mock-posts.json` fixture with 5 realistic-looking sample HubPost objects (use fake IDs, fake usernames, plausible body text about GIS topics).

5. Run `npm install` to ensure dependencies are installed.

6. Report what changed and confirm the project is ready for first component development.
