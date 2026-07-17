/* ============================================================
   data.js — every piece of content on the site lives here.
   Edit this file to update the portfolio; nothing else needs
   to change.
   ============================================================ */

const DATA = {
  identity: {
    name: "Rudra Desai",
    handle: "rudra",
    host: "portfolio",
    title: "Applied AI Engineer",
    location: "Washington, DC",
    email: "dxsai@vt.edu",
    github: "https://github.com/rdxsai",
    linkedin: "https://www.linkedin.com/in/rudradesai18/",
    tagline: "I build multi-agent systems that actually ship.",
    summary:
      "Applied AI Engineer specializing in multi-agent systems, retrieval-augmented " +
      "generation, and transformer fine-tuning. I've built and shipped LLM-powered " +
      "platforms serving 200+ users — dual-source hybrid retrieval (HyDE + BM25 with " +
      "RRF), custom MCP tool servers, tiered student modeling, and Docker-orchestrated " +
      "ML infrastructure. I take AI prototypes from design through production " +
      "deployment on Azure and AWS.",
  },

  banner: [
    "██████╗ ██╗   ██╗██████╗ ██████╗  █████╗ ",
    "██╔══██╗██║   ██║██╔══██╗██╔══██╗██╔══██╗",
    "██████╔╝██║   ██║██║  ██║██████╔╝███████║",
    "██╔══██╗██║   ██║██║  ██║██╔══██╗██╔══██║",
    "██║  ██║╚██████╔╝██████╔╝██║  ██║██║  ██║",
    "╚═╝  ╚═╝ ╚═════╝ ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝",
    "██████╗ ███████╗███████╗ █████╗ ██╗",
    "██╔══██╗██╔════╝██╔════╝██╔══██╗██║",
    "██║  ██║█████╗  ███████╗███████║██║",
    "██║  ██║██╔══╝  ╚════██║██╔══██║██║",
    "██████╔╝███████╗███████╗██║  ██║██║",
    "╚═════╝ ╚══════╝╚══════╝╚═╝  ╚═╝╚═╝",
  ],

  education: [
    {
      school: "Virginia Tech",
      degree: "Master of Engineering in Computer Science",
      location: "Alexandria, VA",
      date: "Expected May 2026",
    },
  ],

  experience: [
    {
      company: "TLOS, Virginia Tech",
      companyFull: "Technology-Enhanced Learning & Online Strategies",
      role: "Gen AI Engineer (Graduate Assistant)",
      location: "Blacksburg, VA",
      date: "Aug 2025 – Present",
      bullets: [
        "Shipped a 6-agent Socratic tutoring system (CrewAI) serving 200+ students per semester — HyDE-powered hybrid search (cosine + BM25 with RRF) over 200+ semantically chunked quiz items running in parallel with LLM-driven WCAG MCP tool calls against live W3C docs, with automatic retry routing on empty results.",
        "Built a custom Student Modeling MCP server exposing mastery tracking, progress monitoring, and prerequisite gap analysis via agent tool calling — backed by tiered session memory (short/medium/long-term AI summaries in PostgreSQL) so Socratic responses calibrate to each student without stuffing full history into prompts.",
        "Engineered an incremental embedding pipeline (Ollama nomic-embed-text, 768-dim) with event-driven triggers on every create/edit, metadata tagging (correctness, Bloom's taxonomy, topic), and SSE streaming of per-item progress to the frontend.",
        "Automated Canvas LMS ingestion with a fault-tolerant ETL pipeline — pagination, exponential-backoff rate limiting, HTML→markdown conversion, and idempotent upserts for zero data duplication across deployments.",
        "Migrated SQLite + ChromaDB to PostgreSQL/pgvector and containerized the full stack (FastAPI, PostgreSQL, Ollama) with Docker Compose — one-command deploys with schema-level environment isolation.",
      ],
    },
    {
      company: "Virginia Tech",
      companyFull: "Virginia Tech",
      role: "Software Engineer (Research Assistant)",
      location: "Blacksburg, VA",
      date: "Jun 2025 – Aug 2025",
      bullets: [
        "Delivered an AI-powered researcher matchmaking platform — SentenceTransformer embeddings + pgvector HNSW indexing for sub-second similarity search across 10K+ profiles.",
        "Cut redundant computation with an async ML orchestration pipeline (Celery + Redis) using SHA-256 change detection and model versioning — zero-downtime re-indexing.",
        "Owned full-stack delivery: JWT auth, admin re-indexing dashboard, React frontend, unified PostgreSQL data + vector store.",
      ],
    },
  ],

  projects: [
    {
      slug: "policypulse",
      name: "PolicyPulse",
      tagline: "Multi-agent economic policy simulation engine",
      tech: ["LangGraph", "Gemini", "FastAPI", "Next.js", "Pydantic"],
      link: "https://github.com/rdxsai/hoohacks2026",
      bullets: [
        "4-agent LangGraph StateGraph that ingests any economic policy proposal and produces household-level dollar impact across 48 demographic profiles, with timeline projections and distributional verdicts.",
        "Phase-gated ReAct architecture — 20 phases across 4 agents — enforcing strict analytical sequencing via conditional edges while preserving autonomous tool selection within each phase.",
        "12 real government data APIs (FRED, BLS, Census ACS, BEA, HUD, Semantic Scholar, OpenAlex) behind error-safe tool wrappers: 99 tool calls per run at a 90% pipeline eval score.",
        "Optimized end-to-end runtime 700s → 420s via batch tool calling, conditional early exits, and programmatic phase summarization (7s → 0.1ms per summary), streamed live over SSE.",
      ],
    },
    {
      slug: "mcp-security-scanner",
      name: "MCP Security Scanner",
      tagline: "Autonomous vulnerability exploitation & patch-verification agent",
      tech: ["Python", "FastMCP", "Docker SDK", "React", "OpenAI"],
      link: null,
      bullets: [
        "Open-source MCP server for autonomous vulnerability exploitation and patch verification — 13 tools across 4 groups (environment management, exploit execution, patch verification, filesystem).",
        "Multi-server agent pipeline integrating Semgrep SAST, custom exploit generation, and knowledge-graph memory, routing tool calls across 3 concurrent MCP servers via a unified async session layer.",
        "Exploits run isolated in Docker: memory limits, no-egress network segmentation, automatic cleanup across 50+ attempts per scan. 85%+ exploit success on known vulnerability classes with a 5-phase Recon→Hypothesize→Exploit→Patch→Report loop.",
      ],
    },
    {
      slug: "socratic-tutor",
      name: "Socratic Tutor",
      tagline: "6-agent AI tutoring platform in production at Virginia Tech",
      tech: ["CrewAI", "FastAPI", "pgvector", "Ollama", "MCP", "Docker"],
      link: null,
      bullets: [
        "The TLOS production system: six cooperating agents tutor 200+ students per semester through Socratic questioning instead of answer-giving.",
        "Dual-source retrieval — HyDE hybrid search over course content in parallel with live WCAG documentation via MCP tool calls.",
        "Tiered student-memory model keeps responses calibrated to each learner's mastery level.",
      ],
    },
    {
      slug: "decisionops",
      name: "DecisionOps",
      tagline: "Slack-native AI agent that turns threads into remembered decisions",
      tech: ["TypeScript", "Slack API", "LLM agents"],
      link: "https://github.com/rdxsai/decisionops",
      bullets: [
        "Turns a messy Slack thread into a captured, approved, and remembered decision.",
        "Incremental Slack-native memory: prompt-cached profiles plus bounded, delta-scoped real-time search.",
        "Slack Agent Builder Challenge entry.",
      ],
    },
    {
      slug: "research-matchmaking",
      name: "Research Matchmaking",
      tagline: "Embedding-driven platform for connecting researchers",
      tech: ["FastAPI", "React", "SentenceTransformers", "pgvector"],
      link: "https://github.com/rdxsai/research-matchmaking",
      bullets: [
        "Sentence-embedding model + hybrid filtering algorithm matches researchers on expertise and needs.",
        "pgvector HNSW indexing for sub-second similarity search across 10K+ profiles.",
      ],
    },
    {
      slug: "sre-agent",
      name: "SRE Agent",
      tagline: "Autonomous incident-response agent for OpenTelemetry fixtures",
      tech: ["Python", "OpenTelemetry", "LLM agents"],
      link: "https://github.com/rdxsai/sreagent",
      bullets: [
        "Autonomous SRE agent that diagnoses and responds to incidents from OpenTelemetry incident fixtures.",
      ],
    },
    {
      slug: "accessibility-audit",
      name: "Accessibility Audit",
      tagline: "AI-powered WCAG 2.2 scanner as a Chrome extension",
      tech: ["TypeScript", "Chrome Extensions", "WCAG 2.2"],
      link: "https://github.com/rdxsai/accessibility-audit",
      bullets: [
        "Chrome extension that scans pages against WCAG 2.2 with AI-assisted findings.",
      ],
    },
    {
      slug: "hatexplain",
      name: "HateXplain Enhancement",
      tagline: "Hate-speech detection with contrastive embeddings + DeBERTa",
      tech: ["PyTorch", "HuggingFace", "DeBERTa"],
      link: "https://github.com/rdxsai/nlp_hateXplain",
      bullets: [
        "Accuracy 0.698 → 0.72 and Macro-F1 0.687 → 0.70 by extending HateXplain with triplet-loss contrastive embeddings, hard negative mining, and DeBERTa feature fusion.",
        "Staged fine-tuning with backbone freezing/unfreezing and weighted multi-task loss for joint classification + rationale prediction.",
      ],
    },
  ],

  skills: {
    Languages: ["Python", "JavaScript/TypeScript", "SQL", "Java"],
    "AI / ML": [
      "LLMs (GPT-4, Claude)", "RAG (HyDE, RRF)", "Multi-Agent Systems (CrewAI, LangGraph)",
      "MCP Servers", "Fine-Tuning", "Prompt Engineering", "LangChain", "LlamaIndex",
      "HuggingFace Transformers", "PyTorch", "scikit-learn", "Model Evaluation",
    ],
    "Data & Retrieval": [
      "pgvector (HNSW)", "FAISS", "ChromaDB", "PostgreSQL",
      "Hybrid Retrieval (Dense + BM25)", "Cross-Encoder Reranking", "Embeddings", "pandas",
    ],
    Infrastructure: [
      "Docker", "Docker Compose", "FastAPI", "Celery", "Redis",
      "CI/CD", "Git", "JWT Auth", "SSE Streaming", "pytest",
    ],
    "Cloud & Frontend": ["Azure (OpenAI Service)", "AWS", "React"],
  },

  bootTrace: [
    { t: 0,   text: "rudra-sh v1.0.0 — interactive portfolio shell", cls: "ok" },
    { t: 90,  text: "spawning agents .................... 4/4", cls: "ok" },
    { t: 90,  text: "[agent:whoami]     identity loaded — Rudra Desai · Applied AI Engineer", cls: "dim" },
    { t: 110, text: "[agent:retrieval]  hybrid index warm (HyDE + BM25 · RRF)", cls: "dim" },
    { t: 110, text: "[agent:tutor]      socratic mode ready — 200+ students served", cls: "dim" },
    { t: 110, text: "[agent:eval]       rubrics loaded — 31/35 passing", cls: "dim" },
    { t: 130, text: "[mcp] student-modeling ─ connected", cls: "dim" },
    { t: 90,  text: "[mcp] wcag-docs ─ connected", cls: "dim" },
    { t: 110, text: "[db]  postgres + pgvector ─ 768-dim vectors online", cls: "dim" },
    { t: 150, text: "boot complete in 0.42s", cls: "ok" },
  ],
};

/* Virtual filesystem shown by `ls` / `cat`. Values are either a
   section key rendered by commands.js, or a directory object. */
const VFS = {
  "about.txt": { section: "about" },
  "experience.txt": { section: "experience" },
  "education.txt": { section: "education" },
  "skills.txt": { section: "skills" },
  "contact.txt": { section: "contact" },
  "resume.pdf": { section: "resume" },
  projects: Object.fromEntries(
    DATA.projects.map((p) => [p.slug + ".md", { project: p.slug }])
  ),
};

const THEMES = {
  mint:  { label: "modern dark · mint accent (default)" },
  tokyo: { label: "tokyo night · periwinkle" },
  paper: { label: "light · for the fluorescent-office crowd" },
  matrix:{ label: "monochrome green · you know why" },
};
