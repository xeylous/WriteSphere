# ✍️ WriteSphere — Production-Ready AI-Powered Blogging Platform

WriteSphere is a modern, high-performance publishing and blogging platform designed for creators, developers, and technical writers. It combines a clean, distraction-free writing environment (with block slash command shortcuts) and low-latency contextual AI assists.

---

## ⚡ Key Features

* **🎨 Glassmorphic Aesthetic**: Modern interface built using HSL CSS variables, supporting seamless theme swapping (dark/light modes) and responsive layouts.
* **✍️ Inline Slash Editor**: Distraction-free content composing using Notion/Hashnode style inline autocomplete commands (`/h1`, `/h2`, `/code`, `/quote`, `/list`) to format text on-the-fly.
* **🤖 Context-Aware AI Assist**: Integrations with Llama-3.3-70B on Groq API for near-zero latency text flow continuation, editorial summaries, grammar checks, and SEO tag generation.
* **🔐 Google OAuth & JWTs**: Secure sign-in/sign-up flows utilizing Google Identity Services SDK on the client and token validation middleware on the server.
* **📊 Analytics Dashboard**: Comprehensive dashboard tracking article statistics, view counts (powered by Redis counters), and trending publications.
* **🐳 Dockerized Environment**: Complete containerization linking Next.js, Express, MongoDB, and Redis caching.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | Next.js 15, React 19, TypeScript, React Query (TanStack), Tailwind CSS, Framer Motion |
| **Backend** | Node.js, Express, TypeScript, Zod, Mongoose (MongoDB) |
| **Caching & Queues** | Redis (ioredis) |
| **AI Integration** | Groq Cloud SDK (Llama-3.3-70B) |
| **Infrastructure** | Docker, Docker Compose, Nginx Reverse Proxy |

---

## 📂 Project Structure

```
├── backend/          # Express API server (TypeScript)
│   ├── src/
│   │   ├── config/   # DB, Redis, and Env configurations
│   │   ├── routes/   # Versioned API routes
│   │   └── services/ # AI and caching services
├── frontend/         # Next.js 15 application
│   ├── src/
│   │   ├── app/      # Page routing
│   │   └── component/# Styled modular blocks
└── docker-compose.yml# Container configuration
```

