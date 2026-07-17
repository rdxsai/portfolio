/* ============================================================
   games.js — the fun commands: matrix rain and snake.
   Both register as Term programs: they own the keyboard until
   stopped, then hand control back to the prompt.
   ============================================================ */

/* ---------- matrix ---------- */

function startMatrix() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    Term.printHTML(`<span class="dim">matrix respects prefers-reduced-motion — imagine green rain here.</span>`);
    return;
  }

  const canvas = document.createElement("canvas");
  canvas.className = "matrix-canvas";
  canvas.setAttribute("aria-hidden", "true");
  document.body.appendChild(canvas);
  const ctx = canvas.getContext("2d");

  const accent = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() || "#22d3ae";
  const bg = getComputedStyle(document.documentElement).getPropertyValue("--bg").trim() || "#0a0e14";

  const size = 16;
  let cols, drops, raf, last = 0;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    cols = Math.floor(canvas.width / size);
    drops = Array.from({ length: cols }, () => Math.floor(Math.random() * -40));
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  resize();
  window.addEventListener("resize", resize);

  const glyphs = "アカサタナハマヤラワ0123456789ABCDEFRUDRA<>[]{}$#*+=";

  function frame(ts) {
    raf = requestAnimationFrame(frame);
    if (ts - last < 50) return;
    last = ts;
    ctx.fillStyle = bg + "26"; // ~15% alpha fade trail
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = `${size}px "JetBrains Mono", monospace`;
    for (let i = 0; i < cols; i++) {
      const ch = glyphs[Math.floor(Math.random() * glyphs.length)];
      ctx.fillStyle = Math.random() > 0.975 ? "#ffffff" : accent;
      ctx.fillText(ch, i * size, drops[i] * size);
      if (drops[i] * size > canvas.height && Math.random() > 0.975) drops[i] = 0;
      drops[i]++;
    }
  }
  raf = requestAnimationFrame(frame);

  const stop = () => {
    cancelAnimationFrame(raf);
    window.removeEventListener("resize", resize);
    document.removeEventListener("pointerdown", stop);
    canvas.remove();
    Term.clearProgram();
    Term.printHTML(`<span class="dim">back to reality.</span>`);
  };

  document.addEventListener("pointerdown", stop);
  Term.setProgram({
    stop,
    onKey(e) {
      e.preventDefault();
      stop();
    },
  });
  Term.printHTML(`<span class="dim">any key (or tap) to wake up…</span>`);
}

/* ---------- snake ---------- */

function startSnake() {
  const W = 26, H = 14;
  const isCoarse = window.matchMedia("(pointer: coarse)").matches;

  const board = document.createElement("pre");
  board.className = "ascii snake-board";
  Term.el.output.appendChild(board);
  const status = document.createElement("div");
  status.className = "line dim";
  Term.el.output.appendChild(status);
  Term.scrollEnd();

  let snake = [{ x: 6, y: 7 }, { x: 5, y: 7 }, { x: 4, y: 7 }];
  let dir = { x: 1, y: 0 };
  let pendingDir = dir;
  let food = null;
  let score = 0;
  let dead = false;
  let timer;

  function placeFood() {
    do {
      food = { x: Math.floor(Math.random() * W), y: Math.floor(Math.random() * H) };
    } while (snake.some((s) => s.x === food.x && s.y === food.y));
  }
  placeFood();

  function draw() {
    const grid = Array.from({ length: H }, () => Array(W).fill(" "));
    grid[food.y][food.x] = "●";
    snake.forEach((s, i) => { grid[s.y][s.x] = i === 0 ? "█" : "▓"; });
    const top = "┌" + "─".repeat(W) + "┐";
    const bottom = "└" + "─".repeat(W) + "┘";
    board.textContent =
      top + "\n" + grid.map((row) => "│" + row.join("") + "│").join("\n") + "\n" + bottom;
    status.textContent = dead
      ? `game over — score ${score}. press q to return, r to retry.`
      : `score ${score}  ·  ${isCoarse ? "swipe to steer" : "arrows/wasd steer"}  ·  q quits`;
  }

  function tick() {
    dir = pendingDir;
    const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
    if (
      head.x < 0 || head.x >= W || head.y < 0 || head.y >= H ||
      snake.some((s) => s.x === head.x && s.y === head.y)
    ) {
      dead = true;
      clearInterval(timer);
      draw();
      return;
    }
    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
      score += 10;
      placeFood();
    } else {
      snake.pop();
    }
    draw();
  }

  function steer(nx, ny) {
    if (nx === -dir.x && ny === -dir.y) return; // no 180s
    pendingDir = { x: nx, y: ny };
  }

  function cleanup(msg) {
    clearInterval(timer);
    document.removeEventListener("touchstart", onTouchStart);
    document.removeEventListener("touchmove", onTouchMove);
    Term.clearProgram();
    if (msg) Term.printHTML(msg);
  }

  function restart() {
    snake = [{ x: 6, y: 7 }, { x: 5, y: 7 }, { x: 4, y: 7 }];
    dir = { x: 1, y: 0 };
    pendingDir = dir;
    score = 0;
    dead = false;
    placeFood();
    clearInterval(timer);
    timer = setInterval(tick, 120);
    draw();
  }

  // touch controls
  let touchStart = null;
  const onTouchStart = (e) => { touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY }; };
  const onTouchMove = (e) => {
    if (!touchStart) return;
    const dx = e.touches[0].clientX - touchStart.x;
    const dy = e.touches[0].clientY - touchStart.y;
    if (Math.abs(dx) + Math.abs(dy) < 24) return;
    if (Math.abs(dx) > Math.abs(dy)) steer(Math.sign(dx), 0);
    else steer(0, Math.sign(dy));
    touchStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    e.preventDefault();
  };
  document.addEventListener("touchstart", onTouchStart, { passive: true });
  document.addEventListener("touchmove", onTouchMove, { passive: false });

  Term.setProgram({
    stop: () => cleanup(),
    onKey(e) {
      const k = e.key.toLowerCase();
      if (["arrowup", "arrowdown", "arrowleft", "arrowright", " "].includes(e.key.toLowerCase()) || ["w", "a", "s", "d"].includes(k)) {
        e.preventDefault();
      }
      if (k === "q" || e.key === "Escape") {
        cleanup(`<span class="dim">final score: ${score}. the real snake was the tech debt we refactored along the way.</span>`);
        return;
      }
      if (dead && k === "r") { restart(); return; }
      if (k === "arrowup" || k === "w") steer(0, -1);
      else if (k === "arrowdown" || k === "s") steer(0, 1);
      else if (k === "arrowleft" || k === "a") steer(-1, 0);
      else if (k === "arrowright" || k === "d") steer(1, 0);
    },
  });

  timer = setInterval(tick, 120);
  draw();
}
