# rudra-sh — terminal portfolio

An interactive CLI-style portfolio for **Rudra Desai** (Applied AI Engineer), inspired by [kuber.studio](https://kuber.studio/). Zero dependencies — plain HTML/CSS/JS, deployable anywhere static files are served.

## Try it

```bash
# any static server works; e.g.
python3 -m http.server 8080
# then open http://localhost:8080
```

Type `help` in the terminal. Highlights: `Tab` completion, `↑`/`↓` history, `Ctrl+L` clear, `theme tokyo|paper|matrix`, `snake`, `matrix`, `sudo hire-me`, and a virtual filesystem (`ls`, `cat projects/policypulse.md`).

## Editing content

Everything on the site lives in **`js/data.js`** — identity, experience, projects, skills, boot trace. Edit that one file to update the portfolio. The static copies for SEO live in `index.html` (`<noscript>` block) and `resume.html`; keep them in sync when making major changes.

A phone number is intentionally left off the public site; add it in `resume.html` (see the HTML comment in the header) if you want it on the printed copy.

## Structure

```
index.html      terminal shell + SEO (meta, JSON-LD, noscript fallback)
resume.html     clean printable resume (print → save as PDF)
404.html        GitHub Pages 404, in character
styles.css      four colorschemes (mint / tokyo / paper / matrix)
js/data.js      ALL content
js/terminal.js  shell engine: input, history, completion, boot, tmux bar
js/commands.js  command registry
js/games.js     snake + matrix rain
```

## Deploying to GitHub Pages

```bash
git remote add origin git@github.com:rdxsai/<repo>.git
git push -u origin main
```

Then in the repo: **Settings → Pages → Source: GitHub Actions**. The included workflow (`.github/workflows/deploy.yml`) deploys on every push to `main`.

- Repo named `portfolio` → site at `https://rdxsai.github.io/portfolio/`
- Repo named `rdxsai.github.io` → site at `https://rdxsai.github.io/`

If the final URL differs from `https://rdxsai.github.io/portfolio/`, update the `canonical` and `og:url` tags in `index.html`.
