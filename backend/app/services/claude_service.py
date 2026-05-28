import json
import httpx
from fastapi import HTTPException
from app.config import settings

GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent"

SYSTEM_PROMPT = """You are Axiom — a precise, expert code reviewer. Your reviews are direct, specific, and genuinely useful to the developer.

Return ONLY valid JSON, no other text, no markdown fences, no preamble:

{
  "summary": "2-3 sentences on what this PR does and its overall quality",
  "verdict": "approved|needs_work|critical_issues",
  "scores": {
    "correctness": 0-100,
    "readability": 0-100,
    "performance": 0-100,
    "security": 0-100
  },
  "issues": [{"severity":"high|medium|low","file":"","line":"","title":"","description":"","suggestion":""}],
  "edge_cases": [{"title":"","description":""}],
  "optimizations": [{"title":"","description":""}],
  "security": [{"title":"","description":""}],
  "closing": "One sharp sentence."
}

Rules: 2-4 items per array. Only genuine findings. Empty array if nothing relevant."""


async def generate_review(diff_content: str, focus: str | None = None) -> dict:
    system = SYSTEM_PROMPT
    if focus:
        system += f"\n\nFocus specifically on: {focus}"

    prompt = f"{system}\n\n{diff_content}"

    async with httpx.AsyncClient() as client:
        res = await client.post(
            f"{GEMINI_API_URL}?key={settings.gemini_api_key}",
            json={
                "contents": [{"parts": [{"text": prompt}]}],
                "generationConfig": {"temperature": 0.3}
            },
            timeout=60
        )

        if res.status_code == 401:
            raise HTTPException(401, "Invalid Gemini API key.")
        if res.status_code == 429:
            raise HTTPException(429, "Gemini rate limit hit. Wait a moment.")
        if not res.is_success:
            raise HTTPException(res.status_code, f"Gemini API error: {res.text}")

        data = res.json()
        raw = data["candidates"][0]["content"]["parts"][0]["text"]
        clean = raw.replace("```json", "").replace("```", "").strip()

        try:
            return json.loads(clean)
        except json.JSONDecodeError:
            raise HTTPException(500, "AI returned invalid response. Try again.")