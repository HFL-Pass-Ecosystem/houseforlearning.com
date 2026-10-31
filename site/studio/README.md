# House for Learning Studio (test build)

Static, browser-only creative tools. Open `index.html` through any web server (for example `python3 -m http.server`).

| Page | What it does | Engine (licence) |
|---|---|---|
| image.html | Layers, crop, resize, adjust, text, export | Fabric.js (MIT) |
| pdf.html | View, merge, reorder, rotate, delete, stamp | pdf.js (Apache-2.0), pdf-lib (MIT) |
| documents.html | Outline to PowerPoint or PDF | PptxGenJS, pdf-lib (MIT) |
| diagrams.html | Flowchart from text, chart from table | Mermaid, Chart.js, Papa Parse (MIT) |
| media.html | Trim video or audio, save WebM | Browser MediaRecorder |
| engines.html | Ingest CSV/Excel/JSON/PDF/text; collate JSON from APIs; export | SheetJS (Apache-2.0), Papa Parse, pdf.js |

Libraries are copied into `vendor/` so pages work with no outside requests.

## Adding to a site menu
Add links to `/studio/index.html` (and the six pages) in the sticky menu of HFL and HFL-Pass. Those sites live in other repositories, so this repo only supplies the folder: copy `creative-tools/` to `/studio/` on each site. Brand: tokens in `studio.css`.

Rules kept: no third-party brand names or logos, no hand-drawn art, no uploads (files stay in the browser).
