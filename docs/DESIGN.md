# Design — terminal portfolio (2026-07-16)

## Decisions (user-approved)

- **Stack**: vanilla HTML/CSS/JS, no build step. Deploy: GitHub Pages.
- **Aesthetic**: modern dark terminal — bg `#0a0e14`, text `#e6e6e6`, mint accent `#22d3ae`.
- **Extras**: boot sequence, fun commands/easter eggs, clickable navigation + mobile UX, SEO static fallback.

## Direction

The reference (kuber.studio) is a terminal portfolio; the risk is genericity. Choices made to ground it in *this* subject (an applied AI engineer who ships multi-agent systems):

1. **Signature — agent-trace boot.** The boot sequence reads like one of Rudra's own systems spinning up: agents spawning, MCP servers connecting, pgvector coming online. Skippable with any key; instant on repeat visits (sessionStorage) and under `prefers-reduced-motion`.
2. **tmux status bar as navigation.** Instead of generic "command chips", the clickable shortcuts are numbered tmux windows in a bottom status bar with session name and clock — authentic terminal vernacular that doubles as recruiter-friendly nav.
3. **A curated colorscheme, not monochrome.** Mint anchor plus periwinkle (commands/keys), amber (dates/metrics), red (errors) — the way a real engineer's terminal is themed. `theme` command switches between mint / tokyo / paper (light) / matrix, persisted in localStorage.
4. **Instant output.** No typewriter effect on content — real terminals are instant, and recruiters shouldn't wait. Motion budget is spent once, on the boot.

## Architecture

- `js/data.js` — single source of truth for content (+ virtual filesystem map, themes).
- `js/terminal.js` — shell engine: rendered block cursor over a hidden input (mobile-keyboard-safe), history (sessionStorage), tab completion with arg-awareness, program mode (games own the keyboard), boot, clock.
- `js/commands.js` — command registry `{desc, usage, run}`; aliases table.
- `js/games.js` — snake (canvas-free, renders in `<pre>`, swipe support) and matrix rain (canvas overlay).
- SEO: JSON-LD Person, OG/Twitter tags, full `<noscript>` resume, printable `resume.html`, custom 404.

## Quality floor

Responsive to mobile (dvh, safe-area, coarse-pointer handling, no iOS focus zoom), visible keyboard focus, `prefers-reduced-motion` respected (boot instant, no cursor blink, matrix declines politely), `aria-live` output, semantic nav/main.
