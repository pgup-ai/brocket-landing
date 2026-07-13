# brocket-landing

Landing page for **Brocket**, the guided product-video workspace from
[PGUP AI](https://github.com/pgup-ai).

## What's here

The original self-contained animated landing page is deployed without design
changes:

```text
index.html                              # original bundled animated landing page
source/Brocket Landing.dc.html          # original editable landing source
source/Brocket UX Audit Review.dc.html  # original UX audit source
source/support.js                        # source runtime
archive/codex-edited-index.html          # previous Codex edit; not deployed
vercel.json                              # static deployment configuration
```

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
