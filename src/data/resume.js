export const personal = {
  name: "Rudra Desai",
  title: "Applied AI Engineer",
  degree: "M.Eng. Computer Science, Virginia Tech (May 2026)",
  phone: "571-245-7570",
  email: "dxsai@vt.edu",
  linkedin: "linkedin.com/in/rudradesai18",
  github: "github.com/rdxsai",
  summary:
    "Applied AI Engineer specializing in multi-agent systems, retrieval-augmented generation, and transformer fine-tuning. Built and shipped LLM-powered platforms serving 200+ users with dual-source hybrid retrieval (HyDE + BM25 with RRF), custom MCP tool servers, tiered student modeling, and Docker-orchestrated ML infrastructure. Proven ability to take AI prototypes from design through production deployment on Azure and AWS.",
};

export const education = [
  {
    school: "Virginia Tech",
    degree: "Master of Engineering in Computer Science",
    location: "Alexandria, VA",
    date: "Expected May 2026",
  },
];

export const experience = [
  {
    company: "Technology-Enhanced Learning & Online Strategies (TLOS), Virginia Tech",
    role: "Gen AI Engineer (Graduate Assistant)",
    location: "Blacksburg, VA",
    date: "Aug 2025 - Present",
    details: [
      "Shipped a 6-agent Socratic tutoring system (CrewAI) serving 200+ students/semester with dual-source retrieval: HyDE-powered hybrid search (cosine + BM25 with RRF) over 200+ semantically chunked quiz items runs in parallel with LLM-driven WCAG MCP tool calls against live W3C documentation, with automatic retry routing on empty results.",
      "Built a custom Student Modeling MCP server exposing mastery tracking, progress monitoring, and prerequisite gap analysis tools via LLM agent tool calling. Backed by tiered session memory (short/medium/long-term AI-generated summaries in PostgreSQL), enabling personalized Socratic responses calibrated to each student's level without injecting full history into prompts.",
      "Engineered an incremental embedding pipeline (Ollama nomic-embed-text) with event-driven triggers on every create/edit and metadata tagging (correctness, Bloom's taxonomy, topic) across 768-dim vectors, with SSE streaming delivering per-item progress updates to the frontend in real time.",
      "Automated Canvas LMS data ingestion via a fault-tolerant ETL pipeline with pagination, exponential-backoff rate limiting, and HTML-to-markdown conversion, achieving zero data duplication through idempotent upsert logic across independent deployments.",
      "Migrated from SQLite + ChromaDB to PostgreSQL/pgvector and containerized the full stack (FastAPI, PostgreSQL, Ollama) with Docker Compose, enabling one-command deployment with schema-level environment isolation and portable JSON export/import.",
    ],
  },
  {
    company: "Virginia Tech",
    role: "Software Engineer (Research Assistant)",
    location: "Blacksburg, VA",
    date: "Jun 2025 - Aug 2025",
    details: [
      "Delivered an AI-powered researcher matchmaking platform using SentenceTransformer embeddings + pgvector HNSW indexing, enabling sub-second similarity search across 10K+ profiles.",
      "Reduced redundant computation by building an async ML orchestration pipeline (Celery + Redis) with SHA-256 change detection and model versioning, achieving zero-downtime re-indexing.",
      "Owned the full-stack delivery: JWT authentication, admin re-indexing dashboard, React frontend, and unified PostgreSQL data + vector store.",
    ],
  },
];

export const projects = [
  {
    title: "MCP Security Scanner: Autonomous Vulnerability Exploitation Agent",
    tech: ["Python", "FastMCP", "Docker SDK", "React", "OpenAI"],
    details: [
      "Architected an open-source MCP server for autonomous vulnerability exploitation and patch verification, implementing 13 tools across 4 tool groups (environment management, exploit execution, patch verification, filesystem access).",
      "Orchestrated a multi-server AI agent pipeline integrating Semgrep SAST, custom exploit generation, and knowledge graph memory, routing LLM tool calls across 3 concurrent MCP servers via a unified async session layer (AsyncExitStack).",
      "Isolated exploit execution in Docker containers with memory limits (256MB target, 100MB exploit), network segmentation preventing internet egress, and automatic cleanup across 50+ exploit attempts per scan.",
      "Achieved 85%+ exploit success rate on known vulnerability classes using a 5-phase pipeline (Recon\u2192Hypothesize\u2192Exploit\u2192Patch\u2192Report) with OpenAI function calling and a reflection loop pattern, streamed in real-time to a React UI via SSE.",
    ],
  },
  {
    title: "Hate Speech Detection: HateXplain Enhancement",
    tech: ["PyTorch", "HuggingFace", "DeBERTa"],
    details: [
      "Improved accuracy from 0.698 to 0.72 and Macro-F1 from 0.687 to 0.70 by extending HateXplain with contrastive embeddings (triplet-loss + hard negative mining) and DeBERTa feature fusion, validated through structured evaluation workflows.",
      "Designed a staged fine-tuning pipeline with backbone freezing/unfreezing and weighted multi-task loss for joint classification + rationale prediction, improving model interpretability.",
    ],
  },
];

export const skills = {
  Languages: ["Python", "JavaScript/TypeScript", "SQL", "Java"],
  "AI / ML": [
    "LLMs (GPT-4, Claude)",
    "Prompt Engineering",
    "RAG (HyDE, RRF)",
    "Fine-Tuning",
    "Multi-Agent Systems (CrewAI, LangGraph)",
    "MCP Servers",
    "LangChain",
    "LlamaIndex",
    "HuggingFace Transformers",
    "PyTorch",
    "scikit-learn",
    "Model Evaluation",
  ],
  "Data & Retrieval": [
    "pgvector (HNSW)",
    "FAISS",
    "ChromaDB",
    "PostgreSQL",
    "Hybrid Retrieval (Dense + BM25)",
    "Cross-Encoder Reranking",
    "Embeddings",
    "Vector Search",
    "pandas",
  ],
  Infrastructure: [
    "Docker",
    "Docker Compose",
    "FastAPI",
    "Celery",
    "Redis",
    "CI/CD",
    "Git",
    "JWT Auth",
    "SSE Streaming",
    "pytest",
  ],
  "Cloud & Frontend": ["Azure (OpenAI Service)", "AWS", "React"],
};
