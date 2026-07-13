# brocket-landing

Landing page for **Brocket**, the guided product-video workspace from
[PGUP AI](https://github.com/pgup-ai).

[![Brocket — product demos, cut by AI. The Brocket editor turns a 5:12 screen recording into a 0:28 launch video.](og-image.png)](https://brocket.video)

## What's here

The original self-contained animated landing page is deployed without design
changes:

```text
index.html                              # bundled animated landing page (deployed)
source/Brocket Landing.dc.html          # editable landing source (keep in sync with index.html)
source/Brocket UX Audit Review.dc.html  # original UX audit source
source/support.js                        # source runtime
archive/codex-edited-index.html          # previous Codex edit; not deployed
vercel.json                              # static deployment configuration
robots.txt / sitemap.xml / llms.txt      # crawler + AI-engine (GEO) files
og-image.png                             # 1200x630 social preview (og:image), design export
favicon.svg / favicon-16/32/48.png / apple-touch-icon.png  # favicons (brand mark)
icon-192.png / icon-512.png / site.webmanifest  # PWA manifest icons
brand/                                   # brand asset sources (mark + icon SVGs, org avatar,
                                         #   github-social-preview.png for repo Settings)
```

Brand: gold `#F2BB55` (gradient `#F9D274 → #F1BC57 → #E3A231`), canvas `#0A0908`,
ink-on-gold `#141009`, lowercase `brocket` wordmark next to the 45°-grid mark.
Regenerate icons from `brand/` SVGs. `og-image.png` is a design export;
`brand/github-social-preview.png` derives from it (edge-extended to 1280x640).

`index.html` embeds the page as an escaped JS string inside
`<script type="__bundler/template">`; copy changes must be applied both there
(escaped: `"`→`\"`, `</`→`<\u002F`, newline→`\n`) and in the editable source.
The shell of `index.html` also carries SEO/OG meta and static crawler content —
the bundle swaps the whole `<html>` element on boot, so the template head
duplicates the meta for JS-rendering crawlers.

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
