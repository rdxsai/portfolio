/* ============================================================
   terminal.js — the shell: input line, history, completion,
   command routing, boot sequence, tmux bar.
   Loads last; expects DATA, VFS, THEMES, COMMANDS, ALIASES.
   ============================================================ */

const Term = {
  t0: Date.now(),
  history: [],
  hIdx: null,
  hDraft: "",
  program: null,

  el: {},

  init() {
    this.el.screen = document.getElementById("screen");
    this.el.output = document.getElementById("output");
    this.el.input = document.getElementById("cmd");
    this.el.before = document.getElementById("typed-before");
    this.el.cursor = document.getElementById("cursor");
    this.el.after = document.getElementById("typed-after");
    this.el.inputLine = document.getElementById("input-line");
    this.el.clock = document.getElementById("tmux-clock");

    try {
      this.history = JSON.parse(sessionStorage.getItem("rsh-hist") || "[]");
    } catch (_) { this.history = []; }

    this.bindEvents();
    this.applyTheme(localStorage.getItem("rsh-theme") || "mint", true);
    this.startClock();
    this.renderInput();
    boot();
  },

  /* ---------- output ---------- */

  esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  },

  print(text, cls) {
    return this.printHTML(this.esc(text), cls);
  },

  printHTML(html, cls) {
    const div = document.createElement("div");
    div.className = "line" + (cls ? " " + cls : "");
    div.innerHTML = html;
    this.el.output.appendChild(div);
    this.scrollEnd();
    return div;
  },

  printPre(text, cls) {
    const pre = document.createElement("pre");
    pre.className = "ascii" + (cls ? " " + cls : "");
    pre.textContent = text;
    this.el.output.appendChild(pre);
    this.scrollEnd();
    return pre;
  },

  blank() {
    this.printHTML("&nbsp;", "blank");
  },

  link(href, label, external = true) {
    const ext = external ? ' target="_blank" rel="noopener noreferrer"' : "";
    return `<a href="${this.esc(href)}"${ext}>${this.esc(label || href)}</a>`;
  },

  secTitle(name) {
    this.printHTML(`<span class="sec-name">${this.esc(name)}</span>`, "sec-title");
  },

  scrollEnd() {
    this.el.screen.scrollTop = this.el.screen.scrollHeight;
  },

  clear() {
    this.el.output.innerHTML = "";
  },

  ps1HTML() {
    const { handle, host } = DATA.identity;
    return `<span class="ps1"><span class="ps1-user">${handle}@${host}</span><span class="ps1-sep">:</span><span class="ps1-path">~</span><span class="ps1-sym">$</span></span>`;
  },

  echoPrompt(cmdtext) {
    this.printHTML(`${this.ps1HTML()} <span class="echoed">${this.esc(cmdtext)}</span>`, "prompt-echo");
  },

  /* ---------- input rendering (block cursor) ---------- */

  renderInput() {
    const v = this.el.input.value;
    const pos = this.el.input.selectionStart ?? v.length;
    this.el.before.textContent = v.slice(0, pos);
    this.el.cursor.textContent = v[pos] || " ";
    this.el.after.textContent = v[pos] ? v.slice(pos + 1) : "";
  },

  focus() {
    this.el.input.focus({ preventScroll: true });
  },

  /* ---------- events ---------- */

  bindEvents() {
    const input = this.el.input;

    input.addEventListener("input", () => this.renderInput());
    input.addEventListener("keyup", () => this.renderInput());
    input.addEventListener("focus", () => {
      this.el.inputLine.classList.add("focused");
      this.renderInput();
    });
    input.addEventListener("blur", () => this.el.inputLine.classList.remove("focused"));
    document.addEventListener("selectionchange", () => {
      if (document.activeElement === input) this.renderInput();
    });

    input.addEventListener("keydown", (e) => this.onKeydown(e));

    // Route keys to a running program (snake / matrix), even without input focus.
    document.addEventListener("keydown", (e) => {
      if (this.program && this.program.onKey) this.program.onKey(e);
    });

    // Click anywhere in the terminal focuses the input — unless the user
    // is selecting text or clicking a link/button.
    this.el.screen.addEventListener("click", (e) => {
      if (e.target.closest("a, button")) return;
      const sel = window.getSelection();
      if (sel && sel.toString().length > 0) return;
      if (this.program) return;
      this.focus();
    });

    // tmux bar buttons
    document.querySelectorAll("[data-cmd]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const cmd = btn.getAttribute("data-cmd");
        if (this.program) this.program.stop();
        this.exec(cmd);
        // Don't yank the keyboard open on touch devices.
        if (!window.matchMedia("(pointer: coarse)").matches) this.focus();
        e.stopPropagation();
      });
    });
  },

  onKeydown(e) {
    if (this.program) return; // program owns the keyboard

    if (e.key === "Enter") {
      e.preventDefault();
      const v = this.el.input.value;
      this.el.input.value = "";
      this.hIdx = null;
      this.renderInput();
      this.exec(v);
      return;
    }

    if (e.key === "Tab") {
      e.preventDefault();
      this.complete();
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      this.histNav(-1);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      this.histNav(1);
      return;
    }

    if (e.ctrlKey && e.key.toLowerCase() === "l") {
      e.preventDefault();
      this.clear();
      return;
    }
    if (e.ctrlKey && e.key.toLowerCase() === "c") {
      e.preventDefault();
      this.printHTML(`${this.ps1HTML()} <span class="echoed">${this.esc(this.el.input.value)}</span><span class="dim">^C</span>`);
      this.el.input.value = "";
      this.hIdx = null;
      this.renderInput();
      return;
    }
    if (e.ctrlKey && e.key.toLowerCase() === "u") {
      e.preventDefault();
      this.el.input.value = "";
      this.renderInput();
      return;
    }
  },

  /* ---------- history ---------- */

  histNav(dir) {
    if (!this.history.length) return;
    if (this.hIdx === null) {
      if (dir === 1) return;
      this.hDraft = this.el.input.value;
      this.hIdx = this.history.length - 1;
    } else {
      this.hIdx += dir;
      if (this.hIdx >= this.history.length) {
        this.hIdx = null;
        this.el.input.value = this.hDraft;
        this.renderInput();
        return;
      }
      if (this.hIdx < 0) this.hIdx = 0;
    }
    this.el.input.value = this.history[this.hIdx];
    this.el.input.setSelectionRange(this.el.input.value.length, this.el.input.value.length);
    this.renderInput();
  },

  pushHistory(line) {
    if (line.trim() && this.history[this.history.length - 1] !== line) {
      this.history.push(line);
      if (this.history.length > 200) this.history.shift();
      try { sessionStorage.setItem("rsh-hist", JSON.stringify(this.history)); } catch (_) {}
    }
  },

  /* ---------- completion ---------- */

  complete() {
    const input = this.el.input;
    const v = input.value;
    const upToCaret = v.slice(0, input.selectionStart ?? v.length);
    const parts = upToCaret.split(/\s+/);
    const word = parts[parts.length - 1];
    const isFirstWord = parts.filter(Boolean).length <= 1 && !/\s$/.test(upToCaret);

    let pool;
    if (isFirstWord) {
      pool = Object.keys(COMMANDS).concat(
        Object.keys(ALIASES).filter((a) => !/^\d$/.test(a)),
      );
    } else {
      pool = this.argPool(parts[0].toLowerCase(), word);
    }

    const matches = [...new Set(pool)].filter((c) => c.startsWith(word)).sort();
    if (!matches.length) return;

    if (matches.length === 1) {
      const m = matches[0];
      const suffix = m.endsWith("/") ? "" : " ";
      input.value = upToCaret.slice(0, upToCaret.length - word.length) + m + suffix + v.slice(upToCaret.length);
      const newPos = upToCaret.length - word.length + m.length + suffix.length;
      input.setSelectionRange(newPos, newPos);
      this.renderInput();
      return;
    }

    // Extend to the longest common prefix, then list options.
    let prefix = matches[0];
    for (const m of matches) {
      while (!m.startsWith(prefix)) prefix = prefix.slice(0, -1);
    }
    if (prefix.length > word.length) {
      input.value = upToCaret.slice(0, upToCaret.length - word.length) + prefix + v.slice(upToCaret.length);
      const newPos = upToCaret.length - word.length + prefix.length;
      input.setSelectionRange(newPos, newPos);
      this.renderInput();
    }
    this.echoPrompt(v);
    this.printHTML(matches.map((m) => `<span class="cmd-name">${this.esc(m)}</span>`).join("  "));
  },

  argPool(cmd, word) {
    cmd = ALIASES[cmd] || cmd;
    if (cmd === "theme") return Object.keys(THEMES).concat(["list"]);
    if (cmd === "projects" || cmd === "project") return DATA.projects.map((p) => p.slug);
    if (cmd === "man" || cmd === "help") return Object.keys(COMMANDS);
    if (cmd === "cat" || cmd === "ls") {
      if (word.startsWith("projects/")) {
        return Object.keys(VFS.projects).map((f) => "projects/" + f);
      }
      return Object.keys(VFS).map((k) => (typeof VFS[k].section === "undefined" ? k + "/" : k));
    }
    if (cmd === "sudo") return ["hire-me"];
    return [];
  },

  /* ---------- execution ---------- */

  exec(line) {
    const trimmed = line.trim();
    this.echoPrompt(line);
    if (!trimmed) return;

    this.pushHistory(trimmed);

    const tokens = trimmed.split(/\s+/);
    let cmd = tokens[0].toLowerCase();
    const args = tokens.slice(1);
    const raw = trimmed.slice(tokens[0].length).trim();

    cmd = ALIASES[cmd] || cmd;
    const entry = COMMANDS[cmd];

    if (!entry) {
      this.printHTML(
        `rudra-sh: command not found: <span class="err">${this.esc(cmd)}</span> — try <span class="kbd">help</span>`,
      );
      return;
    }
    entry.run(args, raw);
    this.scrollEnd();
  },

  /* ---------- programs (snake, matrix) ---------- */

  setProgram(p) {
    this.program = p;
    this.el.inputLine.classList.add("hidden");
  },

  clearProgram() {
    this.program = null;
    this.el.inputLine.classList.remove("hidden");
    this.scrollEnd();
    if (!window.matchMedia("(pointer: coarse)").matches) this.focus();
  },

  /* ---------- theme ---------- */

  applyTheme(name, silent = false) {
    if (!THEMES[name]) return false;
    document.documentElement.setAttribute("data-theme", name);
    try { localStorage.setItem("rsh-theme", name); } catch (_) {}
    if (!silent) this.printHTML(`theme set to <span class="accent">${this.esc(name)}</span>`);
    return true;
  },

  /* ---------- tmux clock ---------- */

  startClock() {
    const tick = () => {
      if (!this.el.clock) return;
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, "0");
      const mm = String(now.getMinutes()).padStart(2, "0");
      this.el.clock.textContent = `${hh}:${mm}`;
    };
    tick();
    setInterval(tick, 15000);
  },
};

/* ---------- boot sequence ---------- */

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

async function boot() {
  const instant =
    prefersReducedMotion() || sessionStorage.getItem("rsh-booted") === "1";
  let skipped = instant;

  const skip = () => { skipped = true; };
  document.addEventListener("keydown", skip, { once: true });
  document.addEventListener("pointerdown", skip, { once: true });

  if (!instant) {
    Term.printHTML(`<span class="dim">press any key to skip</span>`, "boot-skip-hint");
  }

  for (const step of DATA.bootTrace) {
    if (!skipped) {
      await new Promise((r) => setTimeout(r, step.t));
    }
    const mark = step.cls === "ok" ? `<span class="ok">[ok]</span> ` : `<span class="dim">[..]</span> `;
    Term.printHTML(mark + `<span class="${step.cls === "ok" ? "" : "dim"}">${Term.esc(step.text)}</span>`, "boot-line");
  }

  document.removeEventListener("keydown", skip);
  document.removeEventListener("pointerdown", skip);
  const hint = document.querySelector(".boot-skip-hint");
  if (hint) hint.remove();
  try { sessionStorage.setItem("rsh-booted", "1"); } catch (_) {}

  Term.blank();
  greet();

  if (!window.matchMedia("(pointer: coarse)").matches) Term.focus();
}

function greet() {
  Term.printPre(DATA.banner.join("\n"), "banner accent");
  Term.blank();
  Term.printHTML(
    `<span class="bright">${Term.esc(DATA.identity.title)}</span> <span class="dim">·</span> <span class="amber">${Term.esc(DATA.identity.location)}</span>`,
  );
  Term.printHTML(`<span class="dim">${Term.esc(DATA.identity.tagline)}</span>`);
  Term.blank();
  Term.printHTML(
    `Type <span class="kbd">help</span> to see what this shell can do, ` +
    `<span class="kbd">Tab</span> to autocomplete, <span class="kbd">↑</span> for history.`,
  );
  Term.printHTML(
    `<span class="dim">Not a terminal person? The bar below works like tmux windows — just click.</span>`,
  );
  Term.blank();
}

document.addEventListener("DOMContentLoaded", () => Term.init());
