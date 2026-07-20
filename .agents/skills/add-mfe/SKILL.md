# add-mfe

Guide for adding a new micro frontend to the system.

## Steps

### 1. Create MFE project

Scaffold your new project (e.g., `mfe3-vue/`) with your framework of choice.

### 2. Configure Module Federation

```js
// webpack.config.js
new ModuleFederationPlugin({
  name: 'mfe3_vue',
  filename: 'remoteEntry.js',
  exposes: {
    './mount': './src/mount',
  },
  shared: {
    // framework singletons
  },
})
```

Set these in webpack config:

- `output.publicPath: 'http://localhost:3004/'` (explicit, not `"auto"`)
- `output.crossOriginLoading: 'anonymous'`
- `devServer.headers`: `Access-Control-Allow-Origin: *` + `Cross-Origin-Resource-Policy: cross-origin`

### 3. Implement mount contract

```js
// src/mount.js
let app
export function mount(el) {
  // render framework app into el
}
export function unmount(el) {
  // cleanup
}
```

### 4. Wire entry point

```js
// src/index.js
import('./mount').then(({ mount, unmount }) => {
  window.mfe3_vue = { mount, unmount }
})
```

If running standalone, also bootstrap on `#root`.

### 5. Register in host

Add to `host-nextjs/pages/index.js`:

```js
const mfe3Ref = useRef(null)

// In useEffect:
await loadScript('http://localhost:3004/main.js')
const mfe3 = await waitForGlobal('mfe3_vue')
mfe3.mount(mfe3Ref.current)

// Cleanup:
// mfe3.unmount(mfe3Ref.current)
```

Add `<div ref={mfe3Ref} className={styles.mfeCard} />` in the JSX.

### 6. Angular-specific

- Create `<app-root>` inside the container in `mount()` before calling `bootstrapModule`
- Guard `bootstrap.ts` with `if (document.querySelector('app-root'))`
- Set `commonChunk: false` in `angular.json`
- Use `ngx-build-plus` builder for webpack extension
- Share all Angular deps with `shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' })`

### 7. Cross-MFE communication

```js
// Dispatch
window.dispatchEvent(new CustomEvent('mfe:message', { detail: data }))

// React listen
useEffect(() => {
  const h = (e) => console.log(e.detail)
  window.addEventListener('mfe:message', h)
  return () => window.removeEventListener('mfe:message', h)
}, [])

// Angular listen
@HostListener('window:mfe:message', ['$event'])
onMessage(event) {
  console.log(event.detail)
}
```
