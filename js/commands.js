/* ============================================================
   commands.js — every command the shell understands.
   Each entry: { desc, usage?, run(args, raw) }.
   ============================================================ */

const ALIASES = {
  // tmux window numbers (the bar at the bottom)
  0: "help",
  1: "whoami",
  2: "projects",
  3: "experience",
  4: "skills",
  5: "contact",
  6: "resume",
  7: "snake",
  exp: "experience",
  proj: "projects",
  project: "projects",
  edu: "education",
  cls: "clear",
  "?": "help",
  h: "help",
  socials: "contact",
  email: "contact",
  cv: "resume",
  gh: "github",
  li: "linkedin",
  quit: "exit",
  ":q": "exit",
  ":q!": "exit",
  hi: "welcome",
  hello: "welcome",
};

/* ---------- shared renderers ---------- */

function renderProjectList() {
  Term.secTitle("projects");
  const cards = DATA.projects.map((p) => {
    const gh = p.link && p.link.match(/github\.com\/([^/]+\/[^/]+)/);
    const media = gh
      ? `<img class="card-img" loading="lazy" alt="${Term.esc(p.name)} repository preview" src="https://opengraph.githubassets.com/rsh/${gh[1]}" />`
      : `<div class="card-img card-ph" aria-hidden="true"><span>${Term.esc(
          p.name.split(/\s+/).map((w) => w[0]).join("").slice(0, 3).toUpperCase(),
        )}</span></div>`;
    const chips = p.tech.slice(0, 4).map((t) => `<span class="chip">${Term.esc(t)}</span>`).join("");
    const more = p.tech.length > 4 ? `<span class="chip">+${p.tech.length - 4}</span>` : "";
    const code = p.link ? `<a href="${Term.esc(p.link)}" target="_blank" rel="noopener noreferrer">code ↗</a>` : "";
    return (
      `<div class="card" data-run="projects ${p.slug}" role="button" tabindex="0" aria-label="${Term.esc(p.name)} — details">` +
      media +
      `<div class="card-body">` +
      `<div class="card-title">${Term.esc(p.name)}</div>` +
      `<div class="card-tag">${Term.esc(p.tagline)}</div>` +
      `<div class="card-tech">${chips}${more}</div>` +
      `<div class="card-links">${code}<span class="card-more">details ›</span></div>` +
      `</div></div>`
    );
  });
  Term.printHTML(`<div class="projects-grid">${cards.join("")}</div>`);
  Term.printHTML(
    `<span class="dim">click a card, or:</span> <span class="kbd">projects &lt;name&gt;</span> <span class="dim">— e.g.</span> <span class="kbd">projects policypulse</span>`,
  );
}

function renderProject(p) {
  Term.secTitle(p.slug);
  Term.printHTML(
    `<span class="bright">${Term.esc(p.name)}</span> <span class="dim">—</span> ${Term.esc(p.tagline)}`,
  );
  Term.printHTML(
    p.tech.map((t) => `<span class="chip">${Term.esc(t)}</span>`).join(" "),
    "chips",
  );
  for (const b of p.bullets) {
    Term.printHTML(`<span class="bullet">▪</span>${Term.esc(b)}`, "bullet-line");
  }
  if (p.link) {
    Term.printHTML(`<span class="dim">code:</span> ${Term.link(p.link)}`);
  }
}

function renderSection(section) {
  const fn = {
    about() {
      Term.secTitle("about");
      Term.printHTML(
        `<span class="bright">${Term.esc(DATA.identity.name)}</span> <span class="dim">—</span> ${Term.esc(DATA.identity.title)}, ${Term.esc(DATA.identity.location)}`,
      );
      Term.blank();
      Term.print(DATA.identity.summary, "para");
      Term.blank();
      const edu = DATA.education[0];
      Term.printHTML(
        `<span class="dim">currently:</span> ${Term.esc(DATA.experience[0].role)} @ ${Term.esc(DATA.experience[0].company)}`,
      );
      Term.printHTML(
        `<span class="dim">studying:</span> ${Term.esc(edu.degree)}, ${Term.esc(edu.school)} <span class="amber">(${Term.esc(edu.date)})</span>`,
      );
    },
    experience() {
      Term.secTitle("experience");
      DATA.experience.forEach((job, i) => {
        if (i > 0) Term.blank();
        Term.printHTML(
          `<span class="bright">${Term.esc(job.role)}</span><span class="date amber">${Term.esc(job.date)}</span>`,
          "job-head",
        );
        Term.printHTML(
          `<span class="dim">${Term.esc(job.company)} · ${Term.esc(job.location)}</span>`,
        );
        for (const b of job.bullets) {
          Term.printHTML(`<span class="bullet">▪</span>${Term.esc(b)}`, "bullet-line");
        }
      });
    },
    education() {
      Term.secTitle("education");
      for (const e of DATA.education) {
        Term.printHTML(
          `<span class="bright">${Term.esc(e.school)}</span><span class="date amber">${Term.esc(e.date)}</span>`,
          "job-head",
        );
        Term.printHTML(`${Term.esc(e.degree)}`);
        Term.printHTML(`<span class="dim">${Term.esc(e.location)}</span>`);
      }
    },
    skills() {
      Term.secTitle("skills");
      for (const [cat, list] of Object.entries(DATA.skills)) {
        Term.printHTML(`<span class="cmd-name">${Term.esc(cat)}</span>`, "skill-cat");
        Term.printHTML(
          list.map((s) => `<span class="chip">${Term.esc(s)}</span>`).join(" "),
          "chips",
        );
      }
    },
    contact() {
      const id = DATA.identity;
      Term.secTitle("contact");
      Term.printHTML(
        `<span class="cmd-name pad-key">email</span>${Term.link("mailto:" + id.email, id.email, false)}`,
        "row",
      );
      Term.printHTML(
        `<span class="cmd-name pad-key">github</span>${Term.link(id.github, "github.com/rdxsai")}`,
        "row",
      );
      Term.printHTML(
        `<span class="cmd-name pad-key">linkedin</span>${Term.link(id.linkedin, "linkedin.com/in/rudradesai18")}`,
        "row",
      );
      Term.printHTML(
        `<span class="cmd-name pad-key">location</span>${Term.esc(id.location)}`,
        "row",
      );
      Term.blank();
      Term.printHTML(`<span class="dim">fastest path to a reply: email. try</span> <span class="kbd">sudo hire-me</span>`);
    },
    resume() {
      Term.printHTML(`opening printable resume — ${Term.link("resume.html", "resume.html")}`);
      Term.printHTML(`<span class="dim">tip: print it to PDF from your browser (⌘P / Ctrl+P).</span>`);
      window.open("resume.html", "_blank", "noopener");
    },
  }[section];
  if (fn) fn();
}

/* ---------- the registry ---------- */

const COMMANDS = {
  help: {
    desc: "list available commands",
    run() {
      const group = (title, names) => {
        Term.printHTML(`<span class="dim">${Term.esc(title)}</span>`, "help-group");
        for (const n of names) {
          Term.printHTML(
            `<span class="cmd-name pad-cmd">${Term.esc(n)}</span><span class="dim">${Term.esc(COMMANDS[n].desc)}</span>`,
            "row",
          );
        }
      };
      group("core", ["whoami", "about", "experience", "projects", "skills", "education", "contact", "resume"]);
      group("links", ["github", "linkedin"]);
      group("terminal", ["ls", "cat", "echo", "date", "history", "theme", "banner", "neofetch", "clear"]);
      group("fun", ["snake", "matrix", "coffee", "sudo"]);
      Term.blank();
      Term.printHTML(
        `<span class="dim">aliases work too (exp, proj, edu, cv, gh, li) · <span class="kbd">Tab</span> completes · <span class="kbd">Ctrl+L</span> clears</span>`,
      );
    },
  },

  whoami: {
    desc: "who is rudra?",
    run() {
      const id = DATA.identity;
      Term.printHTML(`<span class="bright">${Term.esc(id.name)}</span> <span class="dim">—</span> ${Term.esc(id.title)}`);
      Term.printHTML(Term.esc(id.tagline));
      Term.printHTML(
        `<span class="dim">${Term.esc(id.location)} · M.Eng. CS @ Virginia Tech · type</span> <span class="kbd">about</span> <span class="dim">for the longer story</span>`,
      );
    },
  },

  about: { desc: "the longer story", run: () => renderSection("about") },
  experience: { desc: "work history", run: () => renderSection("experience") },
  education: { desc: "degrees", run: () => renderSection("education") },
  skills: { desc: "tech i use", run: () => renderSection("skills") },
  contact: { desc: "reach me", run: () => renderSection("contact") },
  resume: { desc: "printable resume (pdf-ready)", run: () => renderSection("resume") },

  projects: {
    desc: "things i've built",
    usage: "projects [name]",
    run(args) {
      if (!args.length) return renderProjectList();
      const q = args[0].toLowerCase();
      const p = DATA.projects.find((x) => x.slug === q || x.slug.startsWith(q));
      if (!p) {
        Term.printHTML(`no project named <span class="err">${Term.esc(args[0])}</span> — run <span class="kbd">projects</span> to list them`);
        return;
      }
      renderProject(p);
    },
  },

  github: {
    desc: "open my github",
    run() {
      Term.printHTML(`opening ${Term.link(DATA.identity.github, "github.com/rdxsai")}`);
      window.open(DATA.identity.github, "_blank", "noopener");
    },
  },

  linkedin: {
    desc: "open my linkedin",
    run() {
      Term.printHTML(`opening ${Term.link(DATA.identity.linkedin, "linkedin.com/in/rudradesai18")}`);
      window.open(DATA.identity.linkedin, "_blank", "noopener");
    },
  },

  /* ---------- terminal-isms ---------- */

  ls: {
    desc: "list files",
    usage: "ls [dir]",
    run(args) {
      const dir = (args[0] || "").replace(/\/$/, "");
      if (dir && dir !== "~" && dir !== ".") {
        if (dir === "projects") {
          Term.printHTML(
            Object.keys(VFS.projects).map((f) => `<span class="file">${Term.esc(f)}</span>`).join("  "),
          );
        } else {
          Term.printHTML(`ls: cannot access '<span class="err">${Term.esc(args[0])}</span>': no such directory`);
        }
        return;
      }
      const names = Object.keys(VFS).map((k) =>
        typeof VFS[k].section === "undefined"
          ? `<span class="cmd-name">${Term.esc(k)}/</span>`
          : `<span class="file">${Term.esc(k)}</span>`,
      );
      Term.printHTML(names.join("  "));
    },
  },

  cat: {
    desc: "read a file",
    usage: "cat <file>",
    run(args) {
      if (!args.length) {
        Term.printHTML(`usage: <span class="kbd">cat &lt;file&gt;</span> — try <span class="kbd">ls</span> first`);
        return;
      }
      const path = args[0];
      if (path.startsWith("projects/")) {
        const f = VFS.projects[path.slice("projects/".length)];
        if (f) {
          const p = DATA.projects.find((x) => x.slug === f.project);
          if (p) return renderProject(p);
        }
      } else if (VFS[path] && VFS[path].section) {
        return renderSection(VFS[path].section);
      } else if (VFS[path]) {
        Term.printHTML(`cat: <span class="err">${Term.esc(path)}</span>: is a directory`);
        return;
      }
      Term.printHTML(`cat: <span class="err">${Term.esc(path)}</span>: no such file`);
    },
  },

  pwd: { desc: "print working directory", run: () => Term.print("/home/rudra") },

  echo: {
    desc: "echo a message",
    usage: "echo <text>",
    run(args, raw) { Term.print(raw || ""); },
  },

  date: { desc: "current date & time", run: () => Term.print(new Date().toString()) },

  history: {
    desc: "command history",
    run() {
      Term.history.slice(-25).forEach((h, i) => {
        Term.printHTML(`<span class="dim pad-num">${i + 1}</span>${Term.esc(h)}`, "row");
      });
    },
  },

  theme: {
    desc: "switch colorscheme",
    usage: "theme [name]",
    run(args) {
      if (!args.length || args[0] === "list") {
        const current = document.documentElement.getAttribute("data-theme");
        Term.secTitle("themes");
        for (const [name, t] of Object.entries(THEMES)) {
          const mark = name === current ? `<span class="accent">●</span>` : `<span class="dim">○</span>`;
          Term.printHTML(
            `${mark} <span class="cmd-name pad-key">${Term.esc(name)}</span><span class="dim">${Term.esc(t.label)}</span>`,
            "row",
          );
        }
        Term.blank();
        Term.printHTML(`<span class="dim">switch:</span> <span class="kbd">theme &lt;name&gt;</span>`);
        return;
      }
      if (!Term.applyTheme(args[0].toLowerCase())) {
        Term.printHTML(`no theme named <span class="err">${Term.esc(args[0])}</span> — run <span class="kbd">theme list</span>`);
      }
    },
  },

  banner: {
    desc: "reprint the banner",
    run() { Term.printPre(DATA.banner.join("\n"), "banner accent"); },
  },

  neofetch: {
    desc: "system info, terminal style",
    run() {
      const up = Math.floor((Date.now() - Term.t0) / 1000);
      const mins = Math.floor(up / 60), secs = up % 60;
      const art = [
        "██████╗ ██████╗ ",
        "██╔══██╗██╔══██╗",
        "██████╔╝██║  ██║",
        "██╔══██╗██║  ██║",
        "██║  ██║██████╔╝",
        "╚═╝  ╚═╝╚═════╝ ",
      ].join("\n");
      const rows = [
        ["user", "rudra@portfolio"],
        ["role", DATA.identity.title],
        ["location", DATA.identity.location],
        ["education", "M.Eng. CS, Virginia Tech (2026)"],
        ["shell", "rudra-sh 1.0.0"],
        ["stack", "Python · TypeScript · PyTorch · LangGraph · MCP"],
        ["uptime", `${mins}m ${secs}s`],
        ["theme", document.documentElement.getAttribute("data-theme")],
      ];
      const info = rows
        .map(([k, v]) => `<div class="row"><span class="cmd-name pad-key">${Term.esc(k)}</span>${Term.esc(v)}</div>`)
        .join("");
      Term.printHTML(
        `<div class="neofetch"><pre class="ascii accent">${art}</pre><div class="neo-info">${info}</div></div>`,
      );
    },
  },

  clear: { desc: "clear the screen", run: () => Term.clear() },

  man: {
    desc: "manual for a command",
    usage: "man <command>",
    run(args) {
      const name = ALIASES[args[0]] || args[0];
      if (name === "rudra") {
        Term.printHTML(`RUDRA(1) — Applied AI Engineer. See <span class="kbd">about</span>. Known bugs: cannot stop talking about multi-agent systems.`);
        return;
      }
      const c = COMMANDS[name];
      if (!c) {
        Term.printHTML(`no manual entry for <span class="err">${Term.esc(args[0] || "")}</span>`);
        return;
      }
      Term.printHTML(`<span class="cmd-name">${Term.esc(name)}</span> — ${Term.esc(c.desc)}`);
      if (c.usage) Term.printHTML(`<span class="dim">usage:</span> <span class="kbd">${Term.esc(c.usage)}</span>`);
    },
  },

  /* ---------- fun ---------- */

  sudo: {
    desc: "try `sudo hire-me`",
    usage: "sudo hire-me",
    run(args) {
      if (args[0] === "hire-me") {
        Term.printHTML(`<span class="ok">[ok]</span> permission granted.`);
        Term.printHTML(`drafting email to <span class="accent">${Term.esc(DATA.identity.email)}</span>…`);
        window.open(
          `mailto:${DATA.identity.email}?subject=${encodeURIComponent("Let's talk — saw your terminal portfolio")}`,
          "_self",
        );
        return;
      }
      Term.printHTML(`rudra is not in the sudoers file. this incident will be reported <span class="dim">(to no one)</span>.`);
    },
  },

  coffee: {
    desc: "brew one",
    run() {
      Term.printPre(
        [
          "      ( (",
          "       ) )",
          "    ........",
          "    |      |]",
          "    \\      /",
          "     `----'",
        ].join("\n"),
        "amber",
      );
      Term.printHTML(`<span class="dim">brewing… fuel for the next training run.</span>`);
    },
  },

  exit: {
    desc: "you can check out any time you like",
    run() {
      Term.printHTML(`there is no escape. <span class="dim">this is a browser tab — try</span> <span class="kbd">coffee</span> <span class="dim">instead.</span>`);
    },
  },

  vim: {
    desc: "the editor wars, settled",
    run() {
      Term.printHTML(`already in the best editor: this terminal. <span class="dim">(:q! works here though — try it.)</span>`);
    },
  },

  welcome: {
    desc: "reprint the intro",
    run: () => greet(),
  },

  matrix: {
    desc: "follow the white rabbit",
    run: () => startMatrix(),
  },

  snake: {
    desc: "the classic — arrows/wasd, q to quit",
    run: () => startSnake(),
  },
};
