# brocket-landing

Landing page for **Brocket**, the guided product-video workspace from
[PGUP AI](https://github.com/pgup-ai).

## What's here

A single, self-contained static page following the same low-dependency shape as
`jbot-review-landing`:

```text
index.html   # page, inline CSS, and minimal vanilla JavaScript
vercel.json  # static deployment configuration; no build step
```

The page is grounded in Brocket's current product contracts: inspectable source
lineage, immutable timeline versions, preview/render honesty, redaction, and a
guided first-cut workflow.

## Develop

Serve the directory to exercise anchors and browser behavior:

```bash
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

## Deploy

The site has no dependencies or build command. Vercel deploys every push to
`main` from [pgup-ai/brocket-landing](https://github.com/pgup-ai/brocket-landing)
to [brocket.video](https://brocket.video). Other branches receive preview
deployments.
