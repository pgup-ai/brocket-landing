# Landing animation audit — blending in shipped brocket features

**Date:** 2026-07-17 · **Mode:** audit (§0–§6, written on the since-deleted `codex/optimize-pagespeed`) + implementation record (§7, on `feat/animation-roadmap`)
**Landing sources:** `source/landing.js` (driver), `source/Brocket Landing.dc.html` (readable markup), `index.html` + `landing.min.js` (deployed derivatives)
**Product sources:** `../brocket/DESIGN.md` (2026-07-17), `../brocket/docs/IMPLEMENTATION_STATUS.md`, `../brocket/README.md`, `../brocket/plan/*`, git log through `eea61f1` (#17)

---

## 0. Two findings that change the brief

1. **The edit procedure changed on this branch.** `index.html` is no longer the self-extracting
   dc-export bundle — commit `d41f920` replaced it with plain static HTML that loads
   `landing.min.js` (terser output of `source/landing.js`; command in README). Copy/markup
   changes are now plain-text dual edits (`index.html` + `source/Brocket Landing.dc.html`);
   driver changes are `source/landing.js` → regenerate `landing.min.js`. No escaped-string
   patching. (Still true on `main` until this branch merges.)
   > **Superseded 2026-07-17:** `codex/optimize-pagespeed` was deleted before merging
   > (commits `d41f920`/`c51d4d2`/`1e48ef9` remain recoverable via reflog). The
   > self-extracting bundle on `main` is canonical again: every change is a plain edit to
   > `source/Brocket Landing.dc.html` plus the same string escaped into `index.html`
   > (`"`→`\"`, `</`→`</`, newline→`\n`).
2. **One thing on the page is wrong *today*, independent of any new feature.** The Scene 2
   card in the edit rail shows a **"Remove"** button (`source/Brocket Landing.dc.html:283`).
   Brocket explicitly does **not** support scene remove/reorder/split
   (`IMPLEMENTATION_STATUS.md` non-goals). Fixing this pairs naturally with the feature
   blend-in: the freed button slot can name a real new operation (Speed / Zoom).
   > **Decision 2026-07-17 (Jingbo):** the landing page is *not* held to 1:1 product parity —
   > it may show roadmap and aspirational features. "Remove" stays (it's planned), and the
   > page now deliberately blends three tiers: shipped, planned, and great-to-have.

## 1. How the animation works (for calibrating effort/risk)

One `requestAnimationFrame` loop scrubs a normalized progress `p∈[0,1]` across the ~8-viewport
`#how` section and writes ~100 CSS custom properties per frame (`source/landing.js`,
`apply()` at line 96). Stage windows live in two parallel band arrays — headlines `H`
(landing.js:124) and rail fills `W` (landing.js:258):

| # | Stage | p window | Headline |
|---|-------|----------|----------|
| 01 | UPLOAD | 0.10–0.26 | "Drop in a recording." |
| 02 | UNDERSTAND | 0.26–0.42 | "Brocket reads every frame." |
| 03 | SCRIPT | 0.42–0.58 | "Add your launch notes." |
| 04 | FIRST CUT | 0.58–0.74 | "Your first cut, assembled." |
| 05 | EDIT | 0.74–0.88 | "Correct with one click." |
| 06 | SHIP | 0.88–1.00 | "Export. Share. Ship." |

Geometry comes from lerped anchor arrays (card `A` landing.js:133, segments `SEG` :189,
portrait `PA`/`PSEG` :272/:284). Reduced motion / `calmMotion` sets `data-motion="calm"`
and snaps smoothing to instant. Landscape (`#bk-canvas`) and portrait (`#bk-pcv`) canvases
share every opacity/timing var; **every new element needs both geometries**. Text mutations
are gated behind change checks (`lastPct`/`lastDur`/`lastStage`) — new text beats must
follow that pattern to stay at 60fps.

## 2. Stage-by-stage: today vs. product

Summary (detail sections below):

| Stage | Shows today | Shipped features that belong here | Proposed micro-beat | Effort | Risk |
|---|---|---|---|---|---|
| 01 UPLOAD | Dropzone, `walkthrough.mp4` progress → ✓, "5:12 · 1920×1080" | Multi-recording combined cut (≤3, ordered) | Two slim secondary clip chips stack under the upload row | S | Low |
| 02 UNDERSTAND | Scanline, tick strip 0:00–5:12, 2 silence blocks, chips: Visual change / Idle trimmed / Click | Evidence classes already well represented; stable-idle ✓ | None needed (copy already honest) | — | — |
| 03 SCRIPT | `launch-notes.md`, 3 lines type in, gold provenance curves script→strip | Templates, brand kit, CTA input, target-length-as-max | Nothing (P3: tiny "0:30 max" chip); protect the provenance visual — it's the page's best idea | XS | Low |
| 04 FIRST CUT | Segments fly to cut slots, T/O caps, 5:12→0:31 counter, title face w/ gold rule, caption pill, auto focus ring | Auto captions ✓, auto-zoom ✓ (as ring), AI attribution ✓ (chip in rail), callout | None structural; optional "AI ·" chip on a slot | XS | Low |
| **05 EDIT** | Rail (Scenes·Privacy·Versions tabs, Scene 2 + Shorten/Edit text/**Remove**), transport w/ gold segment, cursor click → Scene 2 shrinks, 0:31→0:28, v1→v2 chip, redaction flash | **Manual punch-in zoom (#16)** · **bounded speed ramps (#17)** · caption appearance (#15) · Transcript tab · zooms/speed lanes | **Primary target** — see §3: zoom beat + speed beat + button relabel + Transcript tab | M+M | Med (timing re-band) |
| 06 SHIP | Glow, outro face (V2 · stats grid · mini-timeline), play line, share pill `brocket.video/s/x7Kq2`, green MP4 chip, CTA | **Render feedback (#14)** (queued→running→ready), aspect presets 16:9/1:1/9:16, revocable 7-day share | "Rendering…" gold bounded fill → emerald ready swap; export copy gains aspects | S | Low |

### 05 EDIT — the thin beat where the new features live (primary)

**Today** (dc.html:245–294, landing.js:231–249): the rail slides in, the cursor clicks
**Shorten** on Scene 2, the segment shrinks, duration ticks 0:31→0:28, the version chip flips
to "v2 · Scene 2 shortened", a redaction box flashes. One correction, one mask. Meanwhile the
product's three richest new surfaces are exactly here:

- **Manual focus / punch-in zoom (#16)** — draggable focus region over the source, scale
  presets 1.25×/1.5×/2×/2.5×, Slow/Standard/Fast motion, ≤8 moments/scene; manual zoom
  *replaces* the muted/dashed auto zoom (`DESIGN.md:274–282`).
- **Bounded speed ramps (#17)** — presets 0.5×–3×, smoothstep transitions, snap 100ms,
  **restricted to silent/no-transcript ranges** (`DESIGN.md:284–294`).
- **Caption appearance (#15)** — Small/Standard/Large × Preset/Dark/Light/Minimal, draggable
  within the safe area (`DESIGN.md:296–304`).

**Proposed beats** (see §3 for the recommended subset):

- **Zoom beat (M, med risk):** cursor drags a small gold focus rectangle over the mock
  product UI → "Zoom · 1.5×" chip → the UI content scales ~6% from the rect's origin →
  the existing pulsing *auto* focus ring hides as the manual rect lands (literally animating
  "manual replaces auto"). Reuses the cursor, one new rect + chip node per canvas, one
  transform var on the existing product-UI div.
- **Speed beat (M, med risk):** a gold "2×" marker drops onto the transport's *idle* stretch
  (ties back to stage 02's "Idle trimmed" chip — same dark-block visual language), that
  segment compresses, duration re-sequences **0:31 →(shorten) 0:29 →(speed) 0:28**. Final
  0:28 is load-bearing (hero OUT line, outro stats, ship chip) — the resequencing keeps it.
- **Caption restyle beat (S, low risk, P2):** the caption pill toggles surface Dark→Light
  and bumps a size step as the cursor passes.
- **Rail honesty (XS):** tabs become `Scenes · Transcript · Privacy·1 · Versions` (adds the
  missing Transcript tab); Scene 2 buttons become **Shorten · Zoom · Speed** (kills the
  false "Remove", names the new ops; "Edit text" may stay if width allows).

**Risk that makes this Med, not Low:** stage 05's window (0.74–0.88 ≈ one viewport of travel)
already holds seven sub-beats. Adding two ops needs breathing room: either shift the 04/05
boundary to ~0.71 (04's counter settles by ~0.70; requires touching `H`, `W`, anchors `A`
index 5, and the 05 sub-beat constants — mechanical but wide) or raise the `#how` section
height (adds absolute travel; changes page-length feel). Recommend the boundary shift.

### 06 SHIP — render feedback (secondary)

Today the outro face simply fades in "rendered just now" — the render *process* (#14's
bounded gold progress with neutral status copy, discrete queued→running→ready states) is
invisible, and it's one of brocket's most characteristic honest-UI details. Proposed: in
0.88–0.93, a thin gold bounded bar with "Rendering…" fills, then swaps to the existing
emerald "MP4 · 1080p · 0:28" chip as the outro face lands. Existing nodes cover most of it;
one new bar + status text per canvas. Optionally: export stat line `1080p · 16:9` →
`1080p · 16:9 · 1:1 · 9:16` (copy-only).

### 01 UPLOAD — multi-recording (optional)

"Drop in a recording." + single `walkthrough.mp4` predates the multi-recording combined cut
(≤3 ordered recordings, `plan/feature-multi-recording-combined-cut-1.md`). A cheap honest
version: after the primary bar completes, two slim ghost chips (`+ demo-2.mov · 1:04`,
`+ retake.mp4 · 0:42`) stack beneath with order badges. Defer if the alpha's core story
should stay single-file simple — the current copy ("a recording") isn't *wrong*.

### 02 / 03 / 04 — already honest, leave mostly alone

- 02's evidence chips (Visual change / Idle trimmed / Click) map cleanly onto the real
  evidence classes (perceptual change, stable-idle, coarse action). No change needed.
- 03's script→strip provenance curves are the page's strongest idea and match the product's
  core promise ("every line is matched to a real moment"). Don't crowd this stage with
  template/brand-kit chips (P3 at most).
- 04 already shows auto-captions, the title card with the gold rule, and the auto focus
  ring; the rail's "AI · matched your script" chip matches the product's `AI · …`
  attribution pattern.

## 3. Recommended scope (most story-per-byte)

**P1 — recommend for sign-off (~1–1.5 days incl. verification):**
1. Rail honesty fixes: drop "Remove", buttons → `Shorten · Zoom · Speed`; add Transcript tab. (XS)
2. Manual punch-in zoom beat in 05 (manual-replaces-auto moment included). (M)
3. Speed-ramp beat in 05 on the idle stretch, duration resequenced 0:31→0:29→0:28. (M)
4. 04/05 boundary shift to ~0.71 to give 05 room (prereq for 2–3). (S, mechanical)
5. Render-feedback beat entering 06 (gold bounded fill → emerald ready). (S)
6. Version-chip chain updated to match: e.g. `v2 · Scene 2 shortened` → final
   `v3 · 2× over idle` (exact copy at impl time). (XS)

**P2 — nice, after P1 lands:** caption appearance toggle beat; aspect copy
`16:9 · 1:1 · 9:16`; multi-recording ghost chips in 01.

**P3 / rejected:**
- **A 7th "REVIEW" stage** — rejected. Every band array, the rail (6 buttons), portrait
  anchors, and the section height would re-band for a story the existing rail+transport
  already half-tell. Cost ≫ marginal story.
- Version-diff panel, amber staleness pill, transition picker, template/brand chips —
  real features, but demo-scale noise at this fidelity.

## 4. Stale/inaccurate today (fix regardless of scope)

| Item | Where | Status |
|---|---|---|
| "Remove" scene button | dc.html:283 (+ portrait twin, + index.html) | **Wrong** — product has no scene removal. Replace. |
| Tab set missing Transcript | dc.html:275 | Incomplete — workspace ships 4 tabs. |
| `EXPORT · MP4 · 1080p · 16:9` | dc.html:214 | Incomplete — 1:1 and 9:16 presets exist. |
| "Correct with one click." subhead | dc.html:118 | Undersells: guided revision + bounded manual ops now exist. Optional copy touch ("…or take the controls."). |
| "No timeline required." | dc.html:303 | Still defensible (auto first cut; timeline optional) — keep, revisit if positioning shifts. |
| `v2` / "V2 · RENDERED JUST NOW" | dc.html:203,232–233 | Fine; product's pill format is "v3 · Current" — cosmetic, optional. |

## 5. Implementation guardrails (for the follow-up session)

- **Files:** copy/markup → BOTH `source/Brocket Landing.dc.html` and `index.html` (plain
  text now, on this branch). Driver → `source/landing.js`, then
  `npx --yes terser@5.49.0 source/landing.js --compress passes=2 --mangle --comments false --output landing.min.js`.
- **Architecture:** no new animation system or library; new beats = new CSS vars + anchor
  constants inside `apply()`; gate any text swaps like `lastDur`; zero per-frame layout reads.
- **Parity:** every new node gets a portrait twin (`#bk-pcv`, dc.html:312+) and must read
  under `data-motion="calm"` (no meaning carried only by motion — preset chips/rects are
  visible at rest).
- **Truths to preserve:** shrink-never-pad (target length is a max; source moments used at
  most once), edits-as-versions, masks enforced in export, final duration 0:28 everywhere.
- **Verify:** `python3 -m http.server 8000`; the embedded browser pane suspends this page's
  rAF and can't scroll the stage — use the rail's jump buttons / `data-bk-jump` to land on
  each stage, and do real scroll passes (forward AND backward) in a normal browser.
  **Do not commit or push** — `main` auto-deploys to brocket.video.

## 6. Acceptance criteria (unchanged from the brief)

- New beats read correctly scrubbing forward and backward, portrait and landscape, and
  collapse gracefully under reduced motion.
- No new JS dependency; single rAF loop preserved; no measurable frame-time regression.
- `source/Brocket Landing.dc.html` and `index.html` stay in sync; `landing.min.js`
  regenerated from `source/landing.js`.
- Every animated capability maps to a real, shipped, bounded brocket feature.

---

## 7. Implementation record (2026-07-17, branch `feat/animation-roadmap` off `main`)

Implemented per the parity decision above (three tiers, "Remove" kept). All edits are dual
plain/escaped edits to `source/Brocket Landing.dc.html` + `index.html` (bundle format), applied
by verified-count replacement scripts; no new JS, single rAF loop preserved.

**Shipped-feature beats**
- 04/05 boundary moved to 0.71 (`H`, `W`, card/portrait anchors, strip fade, jump target).
- Zoom beat (~0.815–0.855): cursor presses **Zoom**, drags a gold focus region with corner
  handles over the mock UI, "Zoom · 1.5× · slow" preset chip pops, the UI punches in ~5%
  (`--ui-z`), and the pulsing *auto* focus ring hides as the manual region lands.
- Speed beat (~0.845–0.888): cursor presses **Speed**, drops a gold **2×** pill onto a striped
  idle band on the transport strip; duration re-sequenced **0:31 → 0:29 (shorten) → 0:28 (2×)**.
- Version chain now **v1 → v2 · Scene 2 shortened → v3 · Zoom + 2× speed**; outro kicker and
  VERSIONS stat updated to V3.
- Rail tabs gain **Transcript**; scene buttons are **Shorten · Zoom · Speed · Remove** with
  press-state vars (`--zb-*`, `--pb-*`) on Zoom/Speed.
- Render feedback (~0.895–0.958): "Rendering" pill with bounded gold fill (`--rnd-o/w`),
  crossfading into the share row + emerald ready chip.
- Multi-recording line under the upload row: "+ demo-2.mov · retake.mov — one combined cut"
  (`--up2-o`); EXPORT stat now "16:9 · 1:1 · 9:16".
**Planned/aspirational beats**
- Format-variant deck (`--var-t`, ~0.955+): two ghost cards labelled 1:1 and 9:16 fan out
  behind the hero card in SHIP.
- "Send for review →" chip in the share row; "Launch template" hint on the script panel;
  05 subhead now "Punch in, speed up, restyle — grounded and reversible."

**Fixes discovered during verification (Playwright, real rAF)**
- Cursor legs are resolved against the **live card geometry** each frame
  (`cardX/cardY`, portrait `pCardX/pCardY`) instead of static coordinates — the card drifts
  and scales through stage 05, and static targets missed by ~100px.
- Added a hold anchor (`[0.86, …]` in `A`/`PA`): the card keeps its edit-stage size through
  the zoom/speed beats, then grows to ship size. Without it the card's opaque background
  plowed into the edit rail by p≈0.88.

**Verified** (Playwright, 1280×800 + 390×844): beats at p = 0.24, 0.80, 0.838, 0.86, 0.878,
0.912, 0.975 in landscape; 0.84, 0.878, 0.975 in portrait; backward scrub to 0.5 leaves no
residue (all new vars return to 0). Reduced-motion path structurally unchanged (all beats are
pure functions of p). Not verified: real trackpad scroll feel on device — eyeball on the
Vercel preview deployment before merging.
