*AI-generated on 2026-03-11.*

# STG V3

## Tech Stack

- **Backend:** Node.js, Express 5, TypeScript, Mongoose/Typegoose
- **Frontend:** React 19, Vite, TypeScript, React Bootstrap, React Router, TanStack React Query
- **Real-time:** Socket.IO with Redis adapter
- **Auth:** Passport (local + magic links)
- **i18n:** Lingui (English, Finnish, Swedish)
- **Linting:** XO
- **Testing:** Vitest
- **Node.js:** v24+

## Project Structure

npm workspaces monorepo with two packages:

```
├── backend/          # Express API server
│   ├── src/
│   │   ├── api/
│   │   │   ├── controllers/   # Route handlers
│   │   │   ├── schemas/       # JSON Schema definitions
│   │   │   └── client/        # Generated API types, client, and hooks
│   │   ├── models/            # Typegoose models
│   │   ├── services/          # Business logic services
│   │   ├── typegenerator/     # API client code generator
│   │   └── index.ts           # Entry point
│   └── dist/                  # Compiled output
├── frontend/         # React SPA
│   ├── src/
│   │   ├── languages/         # Lingui translation files (en, fi, sv)
│   │   └── ...
│   └── ...
├── docker-compose.yml
└── package.json      # Workspace root
```

## External Services

### Databases & Infrastructure

| Service | Purpose | Production | Local Dev |
|---------|---------|------------|-----------|
| **MongoDB** | Primary database | MongoDB Atlas | Docker (`mongo`) |
| **Redis** | Sessions, Socket.IO adapter, distributed locking (Redlock) | Heroku Redis add-on | Docker (`redis`) |
| **AWS S3** | File storage | AWS S3 | Docker (`s3rver`) |

### Heroku Add-ons

| Add-on | Purpose |
|--------|---------|
| **Heroku Redis** | Session store, Socket.IO adapter, Redlock |
| **Papertrail** | Log management |
| **New Relic** | Application performance monitoring |

### Third-party Services

| Service | Purpose |
|---------|---------|
| **Sidemail** | Transactional email (magic links, password resets, SSO emails) |
| **OpenAI** | AI guidance features |
| **ElevenLabs** | Text-to-speech |

### Self-hosted Services

| Service | Hosted on | Purpose |
|---------|-----------|---------|
| **Umami** | Heroku | Web analytics |
| **[stg-video-encoder](https://github.com/PositiveCV/stg-video-encoder)** | AWS Lambda | Video compression and Lottie-to-video rendering |

## Local Development Setup

### Prerequisites

- Node.js v24+
- Docker and Docker Compose

### 1. Start Local Services

```bash
docker compose up -d
```

This starts:
- **MongoDB** — primary database (`localhost:27017`)
- **Redis** — sessions and Socket.IO (`localhost:6379`)
- **S3rver** — local S3 emulator (`localhost:4568`)
- **Mongo Express** — database admin UI (`http://localhost:8081`, credentials: admin/admin)
- **Umami** — analytics dashboard (`http://localhost:3000`)

### 2. Configure Environment Variables

```bash
cp backend/.env.sample backend/.env
cp frontend/.env.sample frontend/.env
```

The sample files have working defaults for local development.

### 3. Install Dependencies

```bash
npm install
```

### 4. Build and Start

```bash
npm run build
npm run dev
```

The backend runs at `http://localhost:4000` and the frontend at `http://localhost:5173`.

### 5. Seed the Database

In development mode, visiting `http://localhost:4000/seed` resets the database and creates test data. A full production MongoDB dump can also be imported locally if needed.

## Scripts

### Root (`package.json`)

| Script | Description |
|--------|-------------|
| `npm run dev` | Start both backend and frontend in dev mode (concurrently) |
| `npm run build` | Build frontend first, then backend |
| `npm run lint` | Lint both frontend and backend (with auto-fix) |
| `npm run lint:nofix` | Lint both frontend and backend (no auto-fix, used in CI) |
| `npm run test` | Run tests for both frontend and backend |
| `npm start` | Start the production server (`node backend/dist/index.js`) |
| `npm run api-client` | Run the API client generator (delegates to backend) |

### Backend (`backend/package.json`)

| Script | Description |
|--------|-------------|
| `npm run dev` | Watch mode: compiles TypeScript, restarts server with nodemon, copies assets |
| `npm run build` | Compile TypeScript and copy `.env` + `src/assets/` to `dist/` |
| `npm start` | Start the compiled server (`node dist/index.js`) |
| `npm test` | Run backend tests with Vitest |
| `npm run test:watch` | Run backend tests in watch mode |
| `npm run typecheck` | Type-check without emitting (`tsc --noEmit`) |
| `npm run lint` | Lint with XO (auto-fix) |
| `npm run lint:nofix` | Lint with XO (no auto-fix) |
| `npm run api-client` | Generate API types, client, and hooks from compiled schemas, then lint the output |
| `npm run copy-files` | Copy `.env` and `src/assets/` to `dist/` |

### Frontend (`frontend/package.json`)

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Vite dev server (with `--host` for network access) |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview the production build locally |
| `npm test` | Run frontend tests with Vitest |
| `npm run typecheck` | Type-check without emitting (`tsc --noEmit`) |
| `npm run lint` | Lint with XO (auto-fix) |
| `npm run lint:nofix` | Lint with XO (no auto-fix) |
| `npm run optimize` | Force Vite dependency pre-bundling |
| `npm run translate` | Extract translation strings and compile catalogs |
| `npm run translate-and-purge` | Extract translations, remove unused strings, and compile |

## API Schemas

JSON Schema is the single source of truth for the API contract. Every schema serves three purposes at once:

1. **Runtime request validation** — incoming request bodies and query parameters are validated with AJV before the controller runs
2. **Runtime response filtering** — outgoing responses are validated and stripped of any extra properties not in the schema (using `removeAdditional: 'all'`), preventing accidental data leaks
3. **Code generation** — the type generator reads the schemas to produce TypeScript types, a typed API client, and React Query hooks for the frontend

### Schema Locations

**Shared definition schemas** live in `backend/src/api/schemas/definitions/` and are registered in the `index.ts` barrel file. These are reusable types referenced via `$ref` (e.g. `{$ref: '#/definitions/Comment'}`).

**Request and query schemas** are defined inline in each controller's route config (`index.ts`):

```ts
// backend/src/api/controllers/comment/index.ts
const commentController: RouteConfigs = {
  '/comments/:id': {
    patch: {
      controller: updateComment,
      access: ['super-admin', 'community-admin', 'comment-owner'],
      request: {                          // ← request body schema (validated by AJV)
        type: 'object',
        properties: {
          content: {type: 'string', maxLength: 5000},
          images: {type: 'array', items: {type: 'string'}, maxItems: 5},
        },
      },
      response: {$ref: '#/definitions/Comment'},  // ← response schema (filters output + generates types)
    },
  },
};
```

### Request/Response Pipeline

For every registered route the `AccessControl` middleware sets up this chain:

1. **Rate limit** — per-route or default (1000 req / 15 min, keyed by user ID or IP)
2. **Roles resolution** — resolves the user's roles from session + database ACL items
3. **Query validation** — validates `request.query` against the `query` schema (if defined)
4. **Access check** — verifies the user has at least one of the roles listed in `access`
5. **Request body validation** — validates `request.body` against the `request` schema for POST/PUT/PATCH
6. **Response filtering** — intercepts `response.json()` and validates/strips the output against the `response` schema
7. **Controller** — the actual route handler runs

### Code Generation

The type generator (`backend/src/typegenerator/`) reads the compiled route configs and definition schemas from `dist/` and uses `json-schema-to-typescript` to produce:

- `backend/src/api/client/ApiTypes.ts` — TypeScript types for all requests, responses, path parameters, query parameters, and Socket.IO events
- `backend/src/api/client/ApiClient.ts` — typed API client with methods for every endpoint
- `backend/src/api/client/ApiHooks.ts` — React Query hooks for each endpoint

These files are auto-generated and should never be edited manually.

**How to regenerate:**

```bash
# 1. Build the backend first (generator reads from compiled dist/ files)
npm run build --prefix backend

# 2. Generate the API client
npm run api-client

# 3. Lint both packages
npm run lint
```

The generator reads from `dist/`, not `src/`. Always build before generating. When adding new schema fields and controllers simultaneously, you may need to use `@ts-expect-error` temporarily until the types are generated.

## Role-Based Access Control

Access control is enforced at the route level via middleware that runs before every controller. The `access` array on the route config is all that's needed — the middleware handles role resolution and the access check automatically. Controllers generally don't need to inspect roles at all. The only exception would be if two different roles share the same route but need different behavior, which should be rare.

### Roles

Each route config declares an `access` array listing which roles are allowed:

```ts
access: ['super-admin', 'community-admin', 'community-owner', 'comment-owner']
```

Available roles:

| Role | Source | Description |
|------|--------|-------------|
| `public` | Always assigned | Every request gets this role |
| `authenticated` | Session | Logged-in user |
| `super-admin` | User model | Global admin role stored on the user document |
| `community-owner` | ACL | Owner of the community (looked up via resource hierarchy) |
| `community-admin` | ACL | Admin of the community |
| `community-member` | ACL | Member of the community |
| `post-owner` | ACL | Creator of the specific post |
| `comment-owner` | ACL | Creator of the specific comment |
| `reaction-owner` | ACL | Creator of the specific reaction |
| `invited-user` | ACL | User invited to a resource |

### How Roles Are Resolved

The `RolesResolver` middleware runs on every API request:

1. Every request starts with the `public` role
2. If the user is logged in, `authenticated` is added along with any roles from the user document (e.g. `super-admin`)
3. If the route has a resource `:id` parameter, the middleware queries the `aclitems` collection using `$graphLookup` to walk the resource hierarchy (resources can have parents, e.g. a post belongs to a community) and collects all roles the user has on that resource and its ancestors

### ACL Tree Plugin

ACL entries are managed automatically through the `AclTreePlugin` Mongoose plugin (`backend/src/models/plugins/acl/aclPlugin.ts`). Models opt into the ACL system by adding the plugin decorator with two options:

- **`parent`** — the model field that points to the parent resource (builds the hierarchy)
- **`roles`** — maps model fields to role names (e.g. `createdBy` -> `post-owner`)

```ts
// A Community is a root resource (no parent, no automatic roles)
@plugin(AclTreePlugin<Community>, {})
export class Community { ... }

// A Group's parent is its community, and the owner gets the group-owner role
@plugin(AclTreePlugin<Group>, {
  parent: 'community',
  roles: [{userPath: 'owner', role: 'group-owner'}],
})
export class Group extends TimeStamps { ... }

// A Post's parent is its community, and the creator gets the post-owner role
@plugin(AclTreePlugin<Moment>, {
  parent: 'community',
  roles: [{userPath: 'createdBy', role: 'post-owner'}],
})
export class Moment extends Post { ... }
```

The plugin is fully automatic — developers never interact with `AclItem` documents directly. The plugin hooks into Mongoose lifecycle events to keep them in sync:

- **On `save` (new document)** — creates an `AclItem` with the document's ID, the parent reference, and initial role assignments
- **On `save` (update)** — recreates the `AclItem` if any watched field (parent or role source) was modified
- **On `deleteOne`** — removes the corresponding `AclItem`

It also adds instance methods `aclSetUserRole(user, role)` and `aclRemoveUser(user)` for dynamically managing role assignments (e.g. when a user is promoted to community admin).

The parent references create a tree structure. When resolving roles, the `RolesResolver` uses MongoDB `$graphLookup` to walk up the tree from the target resource to its ancestors. This means a user with `community-admin` on a community automatically has that role when accessing any child resource (groups, posts, comments, etc.) within it.

## Frontend UI Version Check

The frontend version in `frontend/package.json` drives a live update notification system. When a new version is deployed, the backend reads the version from the frontend's `package.json` and broadcasts it via Socket.IO. Connected clients compare the deployed version against their bundled version. If there's a mismatch, a toast notification prompts the user to reload. The version is also checked via an API endpoint on page visibility changes (e.g., when the user switches back to the tab).

**Bump the minor version** in `frontend/package.json` whenever you make UI changes:

```json
"version": "0.38.0" → "0.39.0"
```

## CI/CD

### Continuous Integration

GitHub Actions runs on all PRs to `main` with these parallel jobs:
- Lint frontend
- Lint backend
- Type-check frontend
- Type-check backend
- Test frontend
- Test backend

### Deployment

- **Production:** Merging to `main` triggers automatic deployment to Heroku.
- **Staging:** Deployed manually from a branch when needed.

## Git Workflow

1. Create a feature branch off `main`
2. Make changes and push
3. Open a PR to `main`
4. CI must pass (lint, typecheck, tests)
5. Merge to `main` triggers production deployment
