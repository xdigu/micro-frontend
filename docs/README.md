# Micro Frontend POC — Instructions

Webpack Module Federation POC with React 18, Angular 22, and Next.js 15.

## Structure

| Service | Port | Stack | Description |
|---|---|---|---|
| `mfe1-react` | 3001 | React 18 + Webpack 5 MF | MFE green background |
| `mfe2-angular` | 3002 | Angular 22 + `@angular-architects/module-federation` | MFE yellow background |
| `host-nextjs` | 3003 | Next.js 15 (Pages Router) | Shell that renders both MFEs |

## How it works

Each MFE exposes functions `mount(el)` and `unmount(el)` via ModuleFederationPlugin. The host loads each MFE's `main.js` via script injection, waits for the MFE to set `window.mfe1_react` / `window.mfe2_angular`, then calls `mount(el)` on the target container.

Cross-MFE communication is done via `CustomEvent('mfe:message')` dispatched on `window`.

## Running

Open **3 terminals** and run:

```bash
# Terminal 1 — MFE React
cd mfe1-react
npm start

# Terminal 2 — MFE Angular
cd mfe2-angular
npm start

# Terminal 3 — Host (Next.js)
cd host-nextjs
npm run dev
```

Open **http://localhost:3003** in your browser.

## Expected result

- A header bar with "Micro Frontend Host — Module Federation POC"
- Two cards side by side:
  - **Green card** (React): "Hello World from React MFE 1" with a button
  - **Yellow card** (Angular): "Hello World from Angular MFE 2" with a button
- Clicking the button in one card sends a message to the other card

## Cross-MFE Communication

1. Each MFE has a **"Send Message"** button
2. Clicking dispatches `new CustomEvent('mfe:message', { detail: '...' })` on `window`
3. Each MFE listens for `mfe:message` on `window` and displays the received message

This approach is **framework-agnostic** and works between React ↔ Angular.

## Troubleshooting

### Port already in use
```bash
lsof -ti :3001 | xargs kill -9   # Replace 3001 with the port number
```

### Angular build errors
If you see errors related to `@angular-architects/module-federation`, make sure all dependencies are installed:
```bash
cd mfe2-angular
npm install
```

### CORS errors
Both MFE dev servers are configured with CORS headers (`Access-Control-Allow-Origin: *`). If you still see CORS errors, ensure you're not running a browser extension that blocks cross-origin requests.
