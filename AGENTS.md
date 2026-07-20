# AGENTS.md — Micro Frontend POC

Three independent projects (not a monorepo). Each has its own `package.json`, `node_modules`, and dev server.

```
mfe1-react/       React 18, webpack 5 + ModuleFederationPlugin, port 3001
mfe2-angular/     Angular 22, @angular-architects/module-federation (webpack stack), port 3002
host-nextjs/      Next.js 15 Pages Router, port 3003
```

## Runtime architecture

The host cannot use ModuleFederationPlugin directly (`@module-federation/nextjs-mf` is incompatible with Next.js 15). Instead it injects `<script>` tags to load each MFE's `main.js` bundle:

1. Host loads `http://localhost:3001/main.js` — sets `window.mfe1_react = { mount, unmount }`
2. Host loads `http://localhost:3002/styles.js` then `http://localhost:3002/main.js` — sets `window.mfe2_angular`
3. Host polls for globals (200ms, 15s timeout), then calls `mfe.mount(el)` on ref containers

## Commands

```bash
# Start MFEs first, then host
mfe1-react:   npm start                   # webpack serve --mode development --port 3001
mfe2-angular: npm start                   # ng serve (ngx-build-plus:dev-server, port 3002)
host-nextjs:  npm run dev                 # next dev -p 3003
```

No test, lint, or typecheck commands exist in any project.

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
