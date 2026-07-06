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

---

## 🚀 Quick Start

### 1. Configure Environments
Create a `.env` file in the root directory:
```env
# Server
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000

# Databases
MONGODB_URI=your-mongodb-atlas-connection-string
REDIS_HOST=your-redis-host
REDIS_PORT=your-redis-port
REDIS_PASSWORD=your-redis-password

# JWT Secrets
JWT_SECRET=your-secure-jwt-key

# API Integrations
GOOGLE_CLIENT_ID=your-google-oauth-client-id
GOOGLE_CLIENT_SECRET=your-google-oauth-client-secret
GROQ_API_KEY=your-groq-cloud-token
```

### 2. Launch Local Environment (Natively)
Start your local databases using Docker:
```bash
docker compose up -d mongodb redis
```

Launch the development servers:
```bash
# Start backend API (Port 5000)
cd backend
npm install
npm run dev

# Start frontend application (Port 3000)
cd ../frontend
npm install
npm run dev
```
Visit `http://localhost:3000` to start creating!
