# troubleshoot

Common issues and solutions when running this micro frontend POC.

## Angular MFE not loading in host

**Cause:** CORS - webpack-dev-server v5 defaults to `Cross-Origin-Resource-Policy: same-origin`.

**Fix:** Ensure `angular.json` `serve.options.headers` has:
```json
{
  "Access-Control-Allow-Origin": "*",
  "Cross-Origin-Resource-Policy": "cross-origin"
}
```
Restart `ng serve`.

## React MFE not loading in host

**Cause:** CORS or wrong `publicPath`.

**Fix:** Check `webpack.config.js` `devServer.headers` has CORS headers. Verify `output.publicPath` is `"http://localhost:3001/"`.

## Angular MFE mounts but blank / "Cannot find module"

**Cause:** `publicPath` defaulting to `"auto"` → uses `import.meta.url` which fails in classic `<script>` tags.

**Fix:** Set explicit `output.publicPath: "http://localhost:3002/"` in `webpack.config.js` after `withModuleFederationPlugin()`.

## Angular bootstraps twice (duplicate content)

**Cause:** `mount.ts` creates `<app-root>` and bootstraps, but `bootstrap.ts` also bootstraps independently.

**Fix:** Verify `bootstrap.ts` guards with:
```js
if (document.querySelector('app-root')) {
  platformBrowser().bootstrapModule(AppModule)
}
```
This ensures it only runs in standalone mode, not when hosted.

## "Script error." for async chunks

**Cause:** Browsers sanitize cross-origin script errors.

**Fix:** Set `output.crossOriginLoading: 'anonymous'` in React MFE webpack config, and use `crossOrigin: 'anonymous'` in host's `loadScript()`.

## MFE loads but renders blank

**Cause:** Container ref element not attached to DOM yet, or `mount()` called before ref is ready.

**Fix:** Ensure `mount()` is called inside `useEffect` (runs after DOM paint). Use `useRef` + `useEffect` correctly.

## Cross-MFE messages not received

**Cause:** Event name mismatch or listener timing.

**Fix:** Verify sender dispatches `new CustomEvent('mfe:message', { detail: ... })`. Check listener event name matches exactly. Angular `@HostListener` event name must match the CustomEvent name.

## `npm start` fails for mfe2-angular

**Cause:** Port 3002 in use, or `@angular-architects/module-federation` version mismatch.

**Fix:**
```bash
lsof -i :3002
kill -9 <PID>
```
Check package.json for correct `@angular-architects/module-federation` version (must match Angular version).

## `npm run dev` fails for host-nextjs

**Cause:** Node.js version mismatch or missing dependencies.

**Fix:** Run `npm install` in `host-nextjs/`. Requires Node.js 18+ for Next.js 15. Check with `node --version`.
