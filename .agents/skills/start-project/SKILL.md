# start-project

Start all three projects in the correct order: MFEs first, then host. Verifies each is ready before proceeding.

## Prerequisites

- Node.js 18+
- `npm install` run in each project: `mfe1-react/`, `mfe2-angular/`, `host-nextjs/`
- Ports 3001, 3002, 3003 must be free

## Steps

### 1. Start mfe1-react (port 3001)

```bash
cd mfe1-react
npm start
```

Wait for output containing `Project is running at http://localhost:3001/`.

### 2. Start mfe2-angular (port 3002)

```bash
cd mfe2-angular
npm start
```

Wait for output containing `✔ Compiled successfully.` or `Angular Live Development Server is listening on localhost:3002`.

### 3. Start host-nextjs (port 3003)

```bash
cd host-nextjs
npm run dev
```

Wait for output containing `ready - started server on 0.0.0.0:3003`.

### 4. Verify

Open http://localhost:3003 and check:

- React MFE card renders with green-themed content
- Angular MFE card renders with yellow-themed content
- "Send Message" buttons in each MFE card trigger cross-MFE communication
