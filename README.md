<div align="center">

# 📄 File Metadata Inspector

**Private, Fast & Browser-Based File Analysis**

Select • Inspect • Verify • Export

</div>

---

## Overview

**File Metadata Inspector** is a project blueprint for a privacy-aware web application that reads and presents technical metadata from files selected by the user.

The target repository is:

```text
https://github.com/yirassssindaba-coder/file-metadata-website
```

The repository was empty when this README was prepared. The sections below therefore describe a recommended production-ready implementation and must be updated after the final source code is added.

The application can be implemented in two modes:

```text
Client-only mode
→ Metadata is inspected inside the browser
→ Files do not need to leave the user's device

Server-assisted mode
→ A Cloudflare Pages Function or Worker validates uploaded files
→ Useful for deeper inspection, centralized logging, or controlled processing
```

For privacy-sensitive usage, client-only inspection should be the default whenever possible.

---

## Recommended Core Features

```text
✅ Drag-and-drop file selection
✅ Standard file-picker support
✅ Multiple-file analysis
✅ File name and extension
✅ MIME type
✅ File size
✅ Last-modified timestamp
✅ Human-readable size formatting
✅ Image width and height
✅ Audio and video duration where supported
✅ Optional SHA-256 checksum
✅ File-category detection
✅ Metadata table
✅ Copy individual values
✅ Copy all metadata
✅ Export results as JSON
✅ Export results as CSV
✅ Clear selected files
✅ Responsive desktop and mobile interface
✅ Light and dark themes
✅ Privacy-focused local processing
✅ PWA-ready structure
✅ Cloudflare Pages deployment
```

---

## Metadata Fields

### Basic File Information

```text
File name
Base name
Extension
MIME type
File size in bytes
Human-readable file size
Last-modified date
File category
Browser-readable status
```

### Image Information

Where supported:

```text
Width
Height
Aspect ratio
Pixel count
Image orientation
Preview
```

### Audio and Video Information

Where supported:

```text
Duration
Media type
Video width and height
Aspect ratio
Playback capability
Preview
```

### Integrity Information

Optional browser-side digest:

```text
SHA-256 checksum
Checksum generation time
Verification status
```

### Document Information

Basic browser metadata can be shown without parsing the full document:

```text
File name
Extension
MIME type
File size
Last-modified timestamp
```

Deeper PDF, Office, archive, EXIF, IPTC, XMP, or embedded-document inspection may require specialized libraries or secure server-side processing.

---

## User Workflow

```text
Open the application
→ Select or drag files
→ Validate file count and size
→ Read browser-accessible metadata
→ Generate optional preview
→ Calculate optional SHA-256 checksum
→ Display structured results
→ Copy or export metadata
→ Clear the session
```

---

## Privacy Model

Recommended default:

```text
Files remain in the browser
No automatic upload
No permanent storage
No analytics containing file names
No hidden tracking
No third-party processing
```

The interface should clearly state whether files are processed:

```text
Locally in the browser
or
Temporarily by a server function
```

Never claim that a file stays local when the application actually uploads it.

---

## Security Requirements

```text
✅ Validate file count
✅ Apply a maximum file-size limit
✅ Validate declared MIME type
✅ Inspect file signatures when server processing is used
✅ Reject executable or unsupported content where appropriate
✅ Sanitize displayed file names
✅ Escape user-controlled values
✅ Avoid rendering untrusted HTML
✅ Revoke generated object URLs
✅ Clear temporary data after processing
✅ Add rate limiting to public server endpoints
✅ Return generic server errors
✅ Keep secrets outside frontend code
```

Never commit:

```text
API keys
Cloudflare tokens
Private signing keys
Session secrets
Uploaded user files
Temporary metadata exports
Production credentials
```

---

## Recommended Limits

These values should be configurable:

```text
Maximum files per batch: 20
Maximum client-side file size: 100 MB per file
Maximum server-side file size: based on platform and security requirements
Allowed file categories: configurable
Checksum algorithm: SHA-256
```

Large files can consume significant browser memory when checksums or previews are generated. Process them sequentially and provide visible progress.

---

## Suggested Application Routes

| Route | Module |
|---|---|
| `/` | Main metadata inspector |
| `/history/` | Optional local analysis history |
| `/verify/` | Optional checksum verification |
| `/about/` | Application information |
| `/privacy.html` | Privacy Policy |
| `/terms.html` | Terms of Use |
| `/offline.html` | Offline fallback |
| `/404.html` | Not-found page |

---

## Recommended Technology Stack

### Lightweight Static Version

```text
HTML5
CSS3
Vanilla JavaScript
File API
Blob API
Web Crypto API
LocalStorage or IndexedDB
Web App Manifest
Service Worker
```

### React/Vite Version

```text
React
Vite
TypeScript or JavaScript
Web Crypto API
File API
Vitest
Testing Library
Cloudflare Pages
```

### Optional Server Layer

```text
Cloudflare Pages Functions
Cloudflare Workers
R2 for temporary controlled storage
D1 for non-sensitive audit summaries
Turnstile for abuse prevention
```

Avoid storing uploaded files unless the product explicitly requires it and the retention policy is clearly documented.

---

## Suggested Static Project Structure

```text
file-metadata-website/
├── README.md
├── index.html
├── 404.html
├── offline.html
├── privacy.html
├── terms.html
├── manifest.webmanifest
├── service-worker.js
├── _headers
├── _redirects
├── assets/
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   ├── app.js
│   │   ├── metadata.js
│   │   ├── checksum.js
│   │   └── export.js
│   └── images/
└── icons/
    ├── icon-192.png
    ├── icon-512.png
    └── icon-maskable-512.png
```

---

## Suggested React/Vite Structure

```text
file-metadata-website/
├── README.md
├── package.json
├── vite.config.ts
├── index.html
├── public/
│   ├── manifest.webmanifest
│   ├── offline.html
│   └── icons/
├── src/
│   ├── components/
│   │   ├── DropZone.tsx
│   │   ├── FileList.tsx
│   │   ├── MetadataTable.tsx
│   │   ├── PreviewPanel.tsx
│   │   └── ExportActions.tsx
│   ├── lib/
│   │   ├── metadata.ts
│   │   ├── checksum.ts
│   │   ├── format.ts
│   │   └── validators.ts
│   ├── pages/
│   ├── styles/
│   ├── App.tsx
│   └── main.tsx
└── tests/
```

---

## Optional Pages Function

When deeper server-side analysis is required, place Functions in the root-level `functions/` directory:

```text
functions/
└── api/
    └── inspect.ts
```

Example responsibilities:

```text
Receive multipart form data
Validate file size and type
Reject unsupported content
Extract approved metadata
Return JSON
Delete temporary data
Avoid persistent storage by default
```

Do not place the `functions/` directory inside the generated `dist/` folder.

---

## Client-Side Metadata Example

```js
export function getBasicMetadata(file) {
  return {
    name: file.name,
    type: file.type || "unknown",
    sizeBytes: file.size,
    lastModified: new Date(file.lastModified).toISOString(),
  };
}
```

---

## SHA-256 Example

```js
export async function createSha256(file) {
  const buffer = await file.arrayBuffer();
  const digest = await crypto.subtle.digest("SHA-256", buffer);

  return [...new Uint8Array(digest)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}
```

For large files, display progress where possible and avoid hashing many files concurrently.

---

## Export Format

### JSON

```json
{
  "name": "example.pdf",
  "extension": "pdf",
  "mimeType": "application/pdf",
  "sizeBytes": 245760,
  "sizeFormatted": "240 KB",
  "lastModified": "2026-06-27T00:00:00.000Z",
  "sha256": "OPTIONAL_CHECKSUM"
}
```

### CSV

```csv
name,extension,mimeType,sizeBytes,lastModified,sha256
example.pdf,pdf,application/pdf,245760,2026-06-27T00:00:00.000Z,OPTIONAL_CHECKSUM
```

Spreadsheet-formula injection should be prevented when exporting user-controlled file names to CSV.

---

## Local Development

### Static Version

```bash
python -m http.server 8000
```

Open:

```text
http://localhost:8000
```

Alternative:

```bash
npx serve .
```

### React/Vite Version

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
npm run preview
```

---

## Cloudflare Pages Deployment

### Static Version

```text
Framework preset: None
Build command: Leave empty
Build output directory: /
Root directory: /
Production branch: main
```

### React/Vite Version

```text
Framework preset: React (Vite)
Build command: npm run build
Build output directory: dist
Root directory: /
Production branch: main
```

### Project with Pages Functions

Deploy through Git integration or Wrangler so the root-level `functions/` directory is processed correctly.

---

## PWA Support

Recommended files:

```text
manifest.webmanifest
service-worker.js
offline.html
icons/icon-192.png
icons/icon-512.png
icons/icon-maskable-512.png
```

Recommended application shortcuts:

```text
Inspect Files
Verify Checksum
Privacy
```

Cache only static application assets. Uploaded user files should not be cached by the service worker unless the user explicitly requests local persistence.

---

## Accessibility

- Keyboard-accessible file picker
- Keyboard-accessible drop zone
- Visible focus indicators
- Clear validation messages
- Screen-reader status announcements
- Proper table headings
- High-contrast text
- Touch-friendly controls
- Reduced-motion support
- Progress indicator for long operations
- File-size and file-type descriptions in text

---

## Performance

```text
Process files sequentially when they are large
Create previews only when requested
Revoke object URLs after use
Avoid reading an entire file unless required
Lazy-load specialized parsers
Limit concurrent checksum calculations
Do not render huge binary content
Use virtualized lists for very large batches
```

Recommended cleanup:

```js
URL.revokeObjectURL(previewUrl);
```

---

## Testing Checklist

```text
[ ] Drag and drop works
[ ] File picker works
[ ] Multiple files work
[ ] Empty selection is handled
[ ] Unsupported files show a clear message
[ ] File size is formatted correctly
[ ] Last-modified date is correct
[ ] Image dimensions are detected
[ ] Media duration is detected where supported
[ ] SHA-256 generation works
[ ] JSON export works
[ ] CSV export works
[ ] CSV values are safely escaped
[ ] Object URLs are revoked
[ ] Mobile layout remains usable
[ ] Keyboard navigation works
[ ] Screen-reader announcements work
[ ] Offline shell loads when enabled
[ ] No selected file is uploaded unexpectedly
```

---

## Important Limitations

- This README is a professional starter specification because the repository was empty when inspected.
- Browser metadata is limited to information exposed by browser APIs and the file contents the application explicitly parses.
- MIME types supplied by browsers or operating systems can be missing or inaccurate.
- Deeper EXIF, IPTC, XMP, PDF, Office, archive, and media-container inspection requires specialized parsers.
- Client-side processing can use substantial memory for large files.
- Browser-based controls cannot guarantee that a malicious file is safe.
- Server-side inspection requires stricter validation, rate limiting, and retention controls.

---

## Roadmap

### Phase 1

```text
File picker
Drag and drop
Basic metadata
Responsive table
Clear action
```

### Phase 2

```text
Image dimensions
Media duration
SHA-256 checksum
JSON and CSV export
Dark mode
```

### Phase 3

```text
PDF and EXIF parsers
Batch progress
Checksum verification
PWA and offline shell
Automated tests
```

### Phase 4

```text
Optional Pages Function
Rate limiting
Turnstile
Controlled temporary processing
Audit metrics without private file names
Security review
```

---

## Suggested Repository Description

```text
📄 Privacy-first file metadata inspector with drag-and-drop analysis, MIME/size details, previews, SHA-256 checksums, JSON/CSV export, PWA & Cloudflare Pages readiness.
```

---

## Repository

```text
https://github.com/yirassssindaba-coder/file-metadata-website
```

---

## Author

**Roberto Ocaviantyo Tahta Laksmana**  
GitHub: [@yirassssindaba-coder](https://github.com/yirassssindaba-coder)

---

<div align="center">

**File Metadata Inspector — understand files clearly without sacrificing privacy.**

</div>
