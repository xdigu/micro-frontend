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

## Docker

All three projects can run together with a single command.

### Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/)

### Quick start

```bash
make build   # build images (first time only)
make up      # start all containers in background
```

Or without Make:

```bash
docker compose up --build -d
```

Open **http://localhost:3003** in your browser.

### Commands

| `make` | `docker compose` | Description |
|---|---|---|
| `make up` | `docker compose up -d` | Start containers |
| `make down` | `docker compose down` | Stop and remove containers |
| `make logs` | `docker compose logs -f` | Follow logs |
| `make build` | `docker compose build` | Build images |
| `make rebuild` | `docker compose up --build -d` | Rebuild and start |
| `make restart` | `docker compose restart` | Restart containers |
| `make ps` | `docker compose ps` | List containers |
| `make clean` | `docker compose down -v` | Remove containers + volumes |

### Architecture

| Service | Container port | Host port |
|---|---|---|
| `mfe1-react` | 3001 | 3001 |
| `mfe2-angular` | 3002 | 3002 |
| `host-nextjs` | 3003 | 3003 |

- Source code is mounted as a bind volume for live hot-reload
- `node_modules` is kept inside the container (anonymous volume) to avoid host/OS conflicts
- File watchers use polling (`WATCHPACK_POLLING`, `CHOKIDAR_USEPOLLING`) for reliable change detection in Docker

### Manual setup (without Docker)

Open **3 terminals**:

```bash
cd mfe1-react && npm start          # Terminal 1
cd mfe2-angular && npm start        # Terminal 2
cd host-nextjs && npm run dev       # Terminal 3
```

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
