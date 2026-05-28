from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routers import github, review

app = FastAPI(
    title="Axiom API",
    description="AI Code Review — GitHub Native",
    version="1.0.0"
)

# ─── CORS ───
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins.split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── ROUTERS ───
app.include_router(github.router)
app.include_router(review.router)


@app.get("/")
async def root():
    return {"name": "Axiom API", "version": "1.0.0", "status": "running"}


@app.get("/health")
async def health():
    return {"status": "ok"}
