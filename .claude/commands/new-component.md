Create a new Stencil Web Component for the Hub discussion UI.

## Instructions

1. Run `npm run generate` via Bash to scaffold the component files, using the component name provided in the arguments (e.g., `$ARGUMENTS`). If no name is given, ask the user for the component name and what it should do.

2. Read the generated `.tsx` and `.scss` files.

3. Implement the component following these rules:
   - Use the `discussion-` prefix for the tag name (e.g., `discussion-post`)
   - Import `h` and any needed decorators from `@stencil/core`
   - Accept a minimal, focused set of `@Prop`s — only what's needed
   - Emit `@Event`s for user actions instead of calling parent code directly
   - Show `<calcite-loader>` during async operations
   - Show `<calcite-notice kind="danger">` on errors
   - Use Calcite components for all UI elements where available
   - Apply BEM-style class names scoped to the component

4. Implement the `.scss` with `:host { display: block; }` as the root rule and Calcite CSS tokens for spacing and color.

5. Write a `.spec.ts` unit test covering at minimum:
   - Renders without crashing with minimal props
   - Displays expected content from props
   - Emits the correct events on user interaction
   - Mock all API/fetch calls — never hit live endpoints

6. Report what was created and any props/events the component exposes.
