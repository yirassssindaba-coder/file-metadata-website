# FileShore — No White Blank V3
- Root contains deploy-ready static files.
- The UI analyses metadata locally if the server endpoint is unavailable.
- `_worker.js` provides `/api/fileanalyse` when deployed using a Cloudflare workflow that supports Pages advanced-mode Workers.
- The page never depends on Next.js hydration, so a missing server cannot produce a plain white screen.
