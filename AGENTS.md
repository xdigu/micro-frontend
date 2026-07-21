# AGENTS.md — Micro Frontend POC

Four independent projects. Each has its own `package.json`, `node_modules`, and dev server.

```
mfe1-react/       React 18, webpack 5 + ModuleFederationPlugin, port 3001
mfe2-angular/     Angular 22, @angular-architects/module-federation (webpack stack), port 3002
host-nextjs/      Next.js 15 Pages Router, port 3003
vtex.faststore/ VTEX FastStore (Next.js 13 + @faststore/cli), port 3000
```

## Runtime architecture

Hosts cannot use ModuleFederationPlugin directly (`@module-federation/nextjs-mf` is incompatible with Next.js 15, and FastStore does not support MF plugin). Instead they inject `<script>` tags to load each MFE's `main.js` bundle:

1. Host loads `http://localhost:3001/main.js` — sets `window.mfe1_react = { mount, unmount }`
2. Host loads `http://localhost:3002/styles.js` then `http://localhost:3002/main.js` — sets `window.mfe2_angular`
3. Host polls for globals (200ms, 15s timeout), then calls `mfe.mount(el)` on ref containers

## Commands

```bash
# Start MFEs first, then host
mfe1-react:   npm start                   # webpack serve --mode development --port 3001
mfe2-angular: npm start                   # ng serve (ngx-build-plus:dev-server, port 3002)
host-nextjs:  npm run dev                 # next dev -p 3003
vtex.faststore: npm run dev             # faststore dev on port 3000
```

No test, lint, or typecheck commands exist in any project.

## vtex.faststore (FastStore) — MFE page

The MFE integration uses the `MfeHost` section component, placed on any CMS-managed page via VTEX Admin.

| File | Purpose |
|------|---------|
| `src/components/sections/MfeHost/MfeHost.tsx` | Section component for CMS use (client-only, `dynamic` import) |
| `src/components/index.tsx` | Section registry (maps `MfeHost` key → component) |
| `cms/faststore/components/cms_component__MfeHost.jsonc` | CMS component definition |

### Workflow

```bash
# Terminal 1: start MFEs
(cd ../../mfe1-react && npm start)
(cd ../../mfe2-angular && npm start)

# Terminal 2: start FastStore
npm run dev

# Terminal 3: VTEX Admin CMS
# Create a page and add the MfeHost section to it
```

### How it works

1. `npm run dev` starts `faststore dev` normally.
2. A CMS page (created via VTEX Admin → CMS → Pages) uses the `MfeHost` section.
3. The section renders client-side, loading `<script>` tags for each MFE and mounting them into `div` refs.
4. On unmount, each MFE's `unmount(el)` is called.

### Gotchas (FastStore-specific)

- **Route is CMS-managed** — the MFE page route is created and managed through VTEX Admin CMS, not via filesystem pages.
- **Port 3000** — FastStore defaults to port 3000, different from the other hosts.

## Cross-MFE communication

`window.dispatchEvent(new CustomEvent('mfe:message', { detail }))` — React listens via `useEffect` + `addEventListener`, Angular via `@HostListener('window:mfe:message')`.

## Gotchas

- **Startup order:** MFEs must be running before the host (host loads them at runtime)
- **CORS:** webpack-dev-server v5 defaults to `Cross-Origin-Resource-Policy: same-origin`. Both MFEs explicitly set `cross-origin` + `Access-Control-Allow-Origin: *`
- **Angular publicPath:** Must be explicit (`http://localhost:3002/`). The default `'auto'` generates `import.meta.url` which fails in classic `<script>` tags
- **Angular mount:** Creates `<app-root>` inside the container element before calling `bootstrapModule`, because Angular's root component selector (`app-root`) must exist in the DOM
- **Angular bootstrap:** `bootstrap.ts` guards against double-bootstrap with `if (document.querySelector('app-root'))` — only bootstraps when running standalone (not when loaded by host)
- **Host uses Pages Router** (not App Router) for simplicity with client-side MFE mounting
- **`crossOriginLoading: 'anonymous'`** is set in the React MFE's webpack output so async chunk errors are not sanitized to "Script error"
