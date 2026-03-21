# Codex Memo

These are quick reminders for future tasks in this repo:

- **Backend workflow:** Define the request/response schemas and add a stub Express handler first, then run `npm run api-client`. This gives us the generated ApiTypes/ApiClient/hooks before we write real logic.
- **Generated clients:** `npm run api-client` produces the API types, ApiClient, and frontend hooks. Always rerun it after any change to JSON schemas (definitions or controller route specs). Never edit generated ApiTypes/ApiClient/hooks manually. After generation, run lint with fix for both backend and frontend.
- **Schema Locations:** Schemas are primarily in `backend/src/api/schemas/definitions` but can also be defined inline in the controller's route config (e.g., `index.ts`). Check both!
- **Running Specific Tests:** To run specific backend tests, use: `npm run test --prefix backend -- relative/path/to/test.ts` (note the `--` separator).
- **Frontend version bump:** Bump the minor version in `frontend/package.json` whenever you make UI changes. This triggers a reload prompt for users running an older cached version.
- **Memo scope:** This memo is for long-lived coding-agent reminders (patterns, pitfalls). Don't log one-off tasks or migrations here.
- **Linting:**
  - npm run lint fixes most issues automatically
  - Boolean props must be prefixed with `is`/`has`. e.g. use `isLoadingGroups` instead of `loadingGroups`.
  - Constants follow strict camel/pascal case (`minimumCommunitySearchLength`, not `MINIMUM_FOO` unless it’s an enum).
  - Avoid `null` in types; use `undefined` or unions with `undefined`.
  - When interacting with refs from third-party components, guard the instance type before calling methods (`if (instance?.clear) instance.clear()`).
- **Lightbox DOM target (problem/solution):** Portalized UI (overlays, prompts, tooltips, dialogs, etc.) must mount inside the Lightbox’s own DOM (prefer `.yarl__portal`, or the current fullscreen element’s portal/root) instead of `document.body`. In fullscreen, `document.body` children aren’t visible/clickable. Generic recipe:
  1) Resolve target by checking `document.fullscreenElement` (and its `shadowRoot`) for `.yarl__portal`; fall back to the latest `.yarl__portal`, then `.yarl__root`.
  2) Refresh the target on `fullscreenchange` (and vendor variants) because Lightbox moves containers in fullscreen; also re-resolve when showing the overlay to avoid stale targets.
  3) Use that target for your portals so everything stays visible/interactive in windowed and fullscreen modes.
- **Overlay state reset:** If a Lightbox parent toggles `isOpen` false, don’t auto-reset overlay/prompt state while the overlay is active; otherwise prompts vanish right as they should appear.
- **Overlay scaling:** When scaling overlays to slide dimensions, guard for zero dimensions (e.g., default scale to 1 if `slideWidth/slideHeight` are 0) to avoid collapsing the overlay in windowed mode.
- **Delete endpoints:** Prefer empty responses (`sendStatus(204)`) so generated hooks treat deletes as void mutations and remove cache entries instead of trying to merge returned data.

- **Mongoose References & Population:**
  - **Strictness**: Relations (e.g., `user`, `group`) in documents are not optional if the schema defines them as required. Assume they exist.
  - **Type Checking**: Always use `isDocument(doc.relation)` to verify a field is populated before accessing its properties.
  - **Error Handling**: If `isDocument` fails for a required field, throw a hard error (e.g., `throw new Error('User not populated')`) rather than returning a fallback/dummy object. Failing fast is preferred over partial data.
  - **ID Serialization**: Use `.toJSON()` to convert ObjectIds to strings (e.g., `doc._id.toJSON()`).
