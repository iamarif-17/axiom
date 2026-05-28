# Axiom — AI Code Review Tool

> Every line has a verdict.

Axiom is a GitHub-native AI code review assistant. Paste a PR URL, get a deep structured review powered by Claude, and post it directly back to the PR.

---

## Stack

| Layer | Tech |
|-------|------|
| Frontend | React + Vite |
| Backend | FastAPI (Python) |
| AI | Anthropic Claude API |
| Auth | GitHub OAuth |
| Database | SQLite (dev) / PostgreSQL (prod) |
| Deploy | Vercel (frontend) + Railway (backend) |

---

## Project Structure

```
axiom/
├── frontend/          # React + Vite
│   ├── src/
│   │   ├── components/
│   │   ├── utils/
│   │   ├── hooks/
│   │   └── styles/
│   └── package.json
├── backend/           # FastAPI
│   ├── app/
│   │   ├── routers/
│   │   ├── services/
│   │   ├── models/
│   │   └── main.py
│   └── requirements.txt
└── README.md
```

---

## Setup

### Frontend
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload
```

---

## Environment Variables

### Frontend `.env`
```
VITE_API_URL=http://localhost:8000
VITE_GITHUB_CLIENT_ID=your_github_oauth_app_client_id
```

### Backend `.env`
```
ANTHROPIC_API_KEY=sk-ant-...
GITHUB_CLIENT_ID=your_github_oauth_app_client_id
GITHUB_CLIENT_SECRET=your_github_oauth_app_client_secret
SECRET_KEY=your_random_secret_key
DATABASE_URL=sqlite:///./axiom.db
```

---

## Features

- Fetch any public or private GitHub PR (with token)
- AI review: issues, edge cases, optimizations, security
- Score breakdown: correctness, readability, performance, security
- Post review back to GitHub as an official PR review
- Copy review as formatted Markdown
- Review history per user (with OAuth)

---

## Roadmap

- [ ] GitHub OAuth login
- [ ] Review history dashboard
- [ ] Webhook auto-review on PR open
- [ ] Inline line-level comments
- [ ] Team custom rules
- [ ] PostgreSQL + Redis for production

---

Built by Arif Ali
