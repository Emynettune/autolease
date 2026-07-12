# What was actually broken

Your project had **11 separate bugs**, all left over from an automated
TypeScript → JavaScript conversion. The error in your screenshot
(`Cannot find module '../controllers/authcontroller'`) was just the
first one Node happened to hit — fixing it alone would have just
revealed the next one, then the next, etc. Here's everything that was
wrong and what was changed:

1. **`routes/authRoutes.js`** — required a file that never existed
   (`controllers/authcontroller`). All your other route files (and the
   real code) live in a single `controllers/index.js`. Fixed to
   `require("../controllers").auth` and added the missing
   `setTwoFactor` wiring.

2. **`config/env.js`** — called `__importDefault(...)`, a helper the
   TypeScript compiler normally injects automatically. It was never
   defined, so this threw `ReferenceError` on the very first
   `require`. Replaced with a plain `require("dotenv")`.

3. **`database/data-source.js`** — passed `schemas.entities` to
   TypeORM, but `models/schemas.js` doesn't export a key called
   `entities`. This silently registered **zero** database entities.
   Fixed to `Object.values(schemas)`, and corrected the migrations
   glob path.

4. **`repositories/index.js`** — exported the repo-accessor object
   directly, but four other files (`sessionService`, `tokenService`,
   `auditService`, `subscribers/index.js`) all expected it wrapped as
   `{ repositories }`. Fixed the export to match every consumer.

5. **`services/websocketService.js`** — called
   `eventBus.eventBus.subscribe(...)`, but `utils/eventBus.js` exports
   the event bus instance directly (no `.eventBus` wrapper). Fixed.

6. **`utils/cloudinary.js`** — two bugs: `const cloudinary =
   ("../config/cloudinary")` was missing the `require(...)` call
   entirely (it was just a string), and a local variable named
   `stream` shadowed the Node `stream` module, breaking every image
   upload. Both fixed.

7. **`config/cloudinary.js`** — used `require("cloudinary")` directly;
   the installed `cloudinary` v2 package needs `.v2` for the
   config/upload API. Fixed.

8. **`middlewares/security.js`** — the nastiest one. A stray bare
   `return` on its own line (a classic JS "automatic semicolon
   insertion" trap) made `sanitizeValue()` return `undefined` for
   **any** object. Since this runs globally on every request, it was
   silently wiping out `req.body` on every single POST/PATCH request
   (register, login, bookings, everything). Verified fixed with a
   direct unit test.

9. **`models/paymentModel.js`** — read `env.platformCommissionRate`
   instead of `env.env.platformCommissionRate` (every other file in
   the project correctly nests config under `.env`). Fixed.

10. **`models/withdrawalModel.js`** — the admin "reject withdrawal"
    route called a `.reject()` method that didn't exist on the model
    (only `.approve()` was implemented). Added it, including the
    wallet refund step.

11. **`controllers/index.js`** — missing handlers that the route files
    already referenced: `user.getSessions`, `user.revokeSession`,
    `auth.setTwoFactor`. Added all three, wired to the model methods
    that already existed. Also fixed `login` to actually pass through
    the two-factor code and device context instead of silently
    dropping them.

## Other cleanup (per your request to remove all TypeScript traces)

- Removed every `//# sourceMappingURL=...` comment (pointless without
  the `.map` files, and a dead giveaway of the TS origin).
- Rewrote `types/enums.js` from the compiled TS-enum IIFE pattern into
  plain JS objects — identical values, much cleaner.
- Converted `migrations/*.js` from ESM (`export const`) to CommonJS
  (`module.exports`) so it matches `"type": "commonjs"` in
  `package.json` — it would have thrown a `SyntaxError` if loaded.
- Renamed `src/migrations.js/` → `src/migrations/` (the `.js` on a
  folder name was a leftover artifact and confusing).
- Rewrote the **Dockerfile** — it had a multi-stage build that ran
  `npm run build` then copied `/app/dist`, but nothing in this project
  ever produces a `dist` folder anymore. Simplified to a single stage
  that runs directly from `src/`.
- Added the missing **`swagger-jsdoc`** dependency to `package.json`
  (used in `config/swagger.js` but never installed — would have
  crashed on the very first request path that touches Swagger).
- Fixed `migration:run` / `migration:generate` scripts in
  `package.json` — they pointed at a `scripts/run-migrations.js` file
  that doesn't exist anywhere in the project. Now they call the
  `node-pg-migrate` CLI directly against `src/migrations`.

## Verified, not just eyeballed

I stubbed out every npm dependency and actually ran:
- `node --check` on all ~45 source files (no syntax errors)
- a full `require("./src/app")` (every route/controller/model/service
  wires up with no missing-module or undefined-property errors)
- a full `require("./src/server")` boot sequence (DB "connects",
  HTTP server starts, WebSocket attaches, scheduler starts)
- the seed script end-to-end
- a direct unit test proving `req.body` survives the security
  middleware intact (bug #8 above)

## What you still need to do

1. Run `npm install` (not `npm ci` — the lockfile doesn't know about
   the new `swagger-jsdoc` dependency yet; `npm install` will update
   it).
2. Fill in your real `.env` from `.env.example` (a real Postgres
   database, JWT secrets, etc. — none of that was broken, it just
   needs real values).
3. `npm run dev` should now get past the module-loading stage and
   actually try to connect to Postgres. If Postgres itself isn't
   running/reachable, that's a separate, unrelated setup step (not a
   code bug).
