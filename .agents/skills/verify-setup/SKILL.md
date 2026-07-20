# verify-setup

Verify that all projects have dependencies installed and configuration is correct.

## Node Modules

```bash
ls mfe1-react/node_modules/.package-lock.json 2>/dev/null && echo "mfe1-react: OK" || echo "mfe1-react: MISSING - run npm install"
ls mfe2-angular/node_modules/.package-lock.json 2>/dev/null && echo "mfe2-angular: OK" || echo "mfe2-angular: MISSING - run npm install"
ls host-nextjs/node_modules/.package-lock.json 2>/dev/null && echo "host-nextjs: OK" || echo "host-nextjs: MISSING - run npm install"
```

## Ports

```bash
lsof -i :3001 -sTCP:LISTEN 2>/dev/null || echo "Port 3001 is free"
lsof -i :3002 -sTCP:LISTEN 2>/dev/null || echo "Port 3002 is free"
lsof -i :3003 -sTCP:LISTEN 2>/dev/null || echo "Port 3003 is free"
```

## CORS Headers

- `mfe1-react/webpack.config.js` → `devServer.headers` must have `Access-Control-Allow-Origin: *` and `Cross-Origin-Resource-Policy: cross-origin`
- `mfe2-angular/angular.json` → `serve.options.headers` must have the same

## Angular publicPath

`mfe2-angular/webpack.config.js` → `output.publicPath` must be set to `"http://localhost:3002/"` explicitly (not `"auto"`).

## Mount Exports

- `mfe1-react/src/mount.js` must export `mount(el)` and `unmount(el)`
- `mfe2-angular/src/app/mount.ts` must export `mount(el)` and `unmount(el)`

## Host Loading Logic

`host-nextjs/pages/index.js` should:

- Load `http://localhost:3001/main.js` and `http://localhost:3002/main.js` via `<script>` tags
- Poll for `window.mfe1_react` and `window.mfe2_angular` (200ms interval, 15s timeout)
- Call `mfe.mount(el)` on ref containers when globals are available

## Angular Double-Bootstrap Guard

`mfe2-angular/src/bootstrap.ts` should guard with:

```js
if (document.querySelector('app-root')) {
  platformBrowser().bootstrapModule(AppModule)
}
```
