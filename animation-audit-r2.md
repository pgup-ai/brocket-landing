# Landing animation audit — round 2 (2026-07-17)

**Mode:** audit only — no code changes. Supersedes nothing in `animation-audit.md`; that file
remains the round-1 record. Product state re-verified against `../brocket` HEAD `dbe6adc`
(2026-07-17), `DESIGN.md`, `docs/IMPLEMENTATION_STATUS.md`.

---

## 0. Three framing corrections before the audit

1. **The brief's architecture map is stale — the edit procedure is the same, the file names
   are not.** There is no `source/landing.js`. The driver (one rAF loop, `apply(p, ST)` at
   line 642, `A`/`SEG`/`PA`/`PSEG` anchors, `H`/`W` band arrays) is the inline
   `<script type="text/x-dc">` inside `source/Brocket Landing.dc.html` (lines 553–913).
   `index.html` remains the self-extracting bundle (one ~112 KB escaped string at line 319;
   712 KB total with the gzipped fonts blob). So the rule stands: **every change = plain edit
   to `source/Brocket Landing.dc.html` + the same string escaped into `index.html`**
   (`"`→`\"`, `</`→`<\u002F`, newline→`\n`), count-verified once per file. `source/support.js`
   is the generated dc-runtime — never edit.
2. **The brief's premise "NONE of the new features appear on the landing" is stale.** Round 1
   (this morning, PR #4, commit `89bfc77`, merged to `main`) already shipped into the
   animation: manual punch-in zoom beat (region + "Zoom · 1.5× · slow" chip + auto-ring
   handoff), bounded speed beat (2× pill on a striped idle band, 0:31→0:29→0:28), Transcript
   tab, `Shorten · Zoom · Speed · Remove` buttons, v1→v2→v3 version chain, render-feedback
   fill → emerald ready, multi-recording line in 01, format-variant deck (1:1 / 9:16) in 06.
   This audit is therefore a **gap + fidelity pass on the current state**, not a first blend-in.
3. **Tier-policy conflict needs your ruling.** Round 1 you decided the page may blend
   shipped / planned / aspirational ("Remove" stays). This brief says animate **only real,
   shipped, bounded** operations and names scene delete as an explicit do-not. Three live
   items sit in the non-shipped tier (§2). My recommendation: follow the new brief — it
   postdates and narrows the earlier decision.

## 1. Stage-by-stage: today vs. product

Stage windows (`H`/`W`): 01 `0.10–0.26` · 02 `0.26–0.42` · 03 `0.42–0.58` · 04 `0.58–0.71` ·
05 `0.71–0.88` · 06 `0.88–1.00`. `#how` = 820 vh.

| Stage | Shows today | Shipped feature(s) that belong here | Proposed micro-beat | Effort | Perf/parity risk |
|---|---|---|---|---|---|
| 01 UPLOAD | Dropzone, `walkthrough.mp4` bar → ✓, `5:12 · 1920×1080`, line "+ demo-2.mov · retake.mov — one combined cut" | Multi-recording combined cut (≤3, ordered) | Keep the line; add order badges `1·2·3` to the three filenames | XS | Low |
| 02 UNDERSTAND | Scanline, ticks 0:00–5:12, 2 silence blocks, chips Visual change / Idle trimmed / Click | Evidence classes already well represented | None | — | — |
| 03 SCRIPT | `launch-notes.md`, 3 typed lines, gold provenance curves, "Launch template" label | Templates/brand kit exist; provenance visual is the page's best idea | None | — | — |
| 04 FIRST CUT | Segments→slots, T/O caps, 5:12→0:31, title face w/ **static** gold rule (110×5), caption pill, auto focus ring | Title card ships a **120×6 px rule entering over ~400 ms** | Rule scales in (scaleX 0→1) right after the face lands; bump to 120×6 | XS–S | Low |
| 05 EDIT | Rail (Scenes·Transcript·Privacy·1·Versions), Scene 2 card, 4 buttons, transport w/ gold segment + 2× pill, cursor: Shorten→Zoom-drag→Speed, redaction flash, v1→v2→v3, 0:31→0:29→0:28 | **Caption appearance (Small/Std/Large × Preset/Dark/Light/Minimal)** — the subhead already claims "restyle"; workspace **zooms lane** (auto=dashed, manual=gold) | **Caption restyle beat**: as v3 lands, the caption pill crossfades Dark→Light + size step, a "Captions · Light · L" chip pops, `Captions` button shows a press state (no new cursor leg). Optional: hairline zooms lane on the transport, dashed auto marker → gold as the manual zoom lands | S (+S opt) | Low–Med (05 is dense: 0.71–0.88 already holds ~8 beats; restyle rides the existing v3 window, no re-band) |
| 06 SHIP | Glow, "Rendering" + bounded gold fill → share row (`/s/x7Kq2` + Copy, emerald MP4 chip, Send for review →), 1:1/9:16 ghost deck, outro stats, CTA | Discrete render states (queued → running → ready); aspect presets already shown | Optional: fill starts as "Queued…" → "Rendering…" → emerald swap (one gated text swap) | XS | Low |

**Rejected (cost ≫ story):** a 7th REVIEW stage (re-banding every anchor array + section
height — same call as round 1); real aspect morph of the hero card (would re-anchor the whole
card system — the ghost deck already tells it); version-diff panel / amber staleness pill
(conflicts with the happy-path flow); guided checklist strip; click-highlight style picker;
"Smooth" scroll-speed suggestion marker (shipped today in `dbe6adc`, but 05 has no air left).

## 2. Stale / inaccurate on the page *today* (fix regardless of scope)

| # | Item | Where (dc.html) | Status |
|---|---|---|---|
| 1 | Transport reads `0:07 / 0:31` even after the speed beat lands 0:28 | :255, :421 | **Wrong** — should tick to `/ 0:28` with the duration counter (gated text swap, `lastDur` pattern) |
| 2 | **"Remove" scene button** | :291, :474 (+index.html) | Product explicitly excludes scene remove/reorder/split; new brief names it a do-not. **Decision needed** — recommend swap to `Captions` (shipped; feeds the restyle beat) |
| 3 | "Send for review →" chip | :308, :494 | Shipped product has revocable 7-day share links; "send for review" is planned-tier. **Decision needed** — recommend keep (harmless adjacent) or drop per shipped-only policy |
| 4 | "Launch template" label on script panel | :131, :439 | Template status unconfirmed this pass (brand kit + layout families shipped; script templates not verified). Keep was round-1's call; flag for your ruling |
| 5 | Title-card rule static + 110×5 px | :201, :382 | Shipped card animates a 120×6 rule in over ~400 ms — fold into scope item 04 |
| 6 | 05 subhead "…restyle…" with no on-stage caption beat | :118, :351 | Resolved by scope item 05 |

## 3. Recommended scope (most story-per-byte)

**P1 — proposed for sign-off (~½–1 day incl. verification):**
1. Transport total fix `0:31 → 0:28` (XS, must-fix).
2. Caption restyle beat in 05: Dark→Light crossfade + size step on the existing pill,
   "Captions · Light · L" chip, press-state var on the button; synced to the v3 window
   0.862–0.885 — no cursor leg, no re-band (S).
3. `Remove` → `Captions` button swap in both rails (XS; resolves the do-not conflict).
4. Title-card rule entrance in 04 + 120×6 px correction (XS–S).
5. Optional inside P1 (say the word if any feel like clutter): zooms-lane dashed→gold marker
   on the transport (S); "Queued…" label before the render fill (XS); order badges `1·2·3`
   in the 01 multi-recording line (XS).

**P2 — later:** caption drag within the safe area (cursor leg, M); "Smooth" suggestion
marker on the speed lane (M).

**Guardrails for implementation (unchanged architecture):** new beats = new CSS vars +
p-anchored windows inside `apply()`; every node gets a portrait twin; text swaps gated
(`lastDur` pattern); zero per-frame layout reads; all beats pure functions of `p` so calm
mode (`k=1`) and backward scrubbing work by construction; ~+2 KB escaped budget.

## 4. Verification plan (post-implementation)

In-pane: hide `#how` / rail jump buttons to land on 01, 04, 05, 06 states; forward+backward
scrub passes at 1280×800 and 390×844; confirm all new vars return to 0 on backward scrub and
calm mode shows every chip/rect at rest. **Only you can confirm on the live/local site:**
real trackpad scroll feel through 05's denser stack, and the 04 rule entrance timing.

No commit, no push — `main` auto-deploys to brocket.video.

---

## 5. Implementation record (2026-07-17, branch `feat/animation-round2`)

**Sign-off:** tier policy per Jingbo — the page deliberately blends current + roadmap +
great-to-have; "Remove" stays (planned), "Send for review →" / "Launch template" stay.
Implemented: all of P1 including the three optional items, minus the `Remove`→`Captions`
swap (superseded by the tier ruling). Applied via a count-verified dual-file patch
(19 pairs, each asserted exactly once in `source/Brocket Landing.dc.html` AND in
`index.html`'s escaped string; all-or-nothing). No new JS dependency; single rAF loop;
+6 vars/frame; +3.7 KB source / +3.8 KB bundle.

**Shipped-feature beats**
- **Caption appearance (05):** the caption pill restyles Dark→Minimal — background thins
  from 88% to 26% translucent as a gold hairline border fades in — steps ~12% up in
  size, and nudges upward (draggable hint) at p 0.858–0.874 (`--cap-l`); a
  "Captions · Minimal · L" chip pops at 0.864–0.878 (`--capc-o`). Rides the v3 window —
  no new cursor leg, no re-band. Portrait: same vars, chip stacked above the pill.
  (Direction flipped from an earlier Dark→Light pass per Jingbo: Minimal keeps the beat
  inside the page's warm-black + gold palette.)
- **Zooms lane (05):** hairline lane under the transport strip with a dashed slate auto
  marker from 0.725 (`--zl-a`) that crossfades into a gold manual marker at 0.848–0.860
  (`--zl-m`) — the timeline-lane version of "manual replaces auto", synced with the
  on-card region landing.
- **Title-card rule (04):** 120×6 px (was 110×5), scaleX entrance at p 0.598–0.618
  (`--trule`), matching the shipped card's ~400 ms rule reveal. Portrait twin 66×3.
- **Render states (06):** the render pill reads "Queued…" then "Rendering…" at p 0.912
  (gated `lastRnd` text swap), then crossfades to the emerald ready row as before.
- **Multi-recording (01):** gold order badges `2` / `3` on the secondary recordings line.
- **Share links (06):** muted "· 7d" expiry hint on the share chip (revocable 7-day links).

**Fixes**
- **Transport total** now follows the duration counter: `/ 0:31` → `/ 0:29` → `/ 0:28`
  (`bk-tptot` / `bk-ptptot`, piggybacked on the `lastDur` gate).

**Bundle-format note (procedural):** the escaped document in `index.html` is NOT
byte-identical to `source/Brocket Landing.dc.html` — the bundler rewrote parts of it
(e.g. the runtime `<script src>`). Whole-document identity is not a valid sync check;
per-string exact-count verification in both files is, and was used here.

**Verified in-repo (node harness, 4001 `apply()` calls, forward 0→1 and backward 1→0):**
script parses; no NaN/undefined var values; every new var is exactly 0 at p=0; sampled
states read as designed (rule entering 0.936 @0.61; auto→manual marker crossfade
0.852–0.86; caption Light + chip @0.875; total `/ 0:29` post-shorten, `/ 0:28` post-speed;
render label flips between 0.905 and 0.93). Calm mode: all beats are pure functions of p,
so `k=1` snaps to the same end states with every chip/rect visible at rest.

**Not verified here (needs a real browser):** visual feel of the caption crossfade and
rule entrance, forward/backward trackpad scrubs, portrait/landscape spot checks, and the
prefers-reduced-motion pass. Serve with `python3 -m http.server 8000` and scrub 04–06.

Commit and push left to Jingbo (working tree on `feat/animation-round2`, uncommitted).

**Post-PR follow-ups (committed to the same branch, PR #7):**
- Caption restyle flipped Dark→Light → **Dark→Minimal** (gold hairline) per Jingbo.
- Script panel lines (03) switched to **Geist Mono** — landscape 14px sans → 12.5px mono,
  portrait 12.5px sans → 11.5px mono — so `launch-notes.md` reads as a raw markdown file.
