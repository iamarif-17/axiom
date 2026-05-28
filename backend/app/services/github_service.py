import httpx
from fastapi import HTTPException

GITHUB_API = "https://api.github.com"


async def github_headers(token: str | None) -> dict:
    headers = {"Accept": "application/vnd.github.v3+json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    return headers


async def get_pull_request(owner: str, repo: str, number: int, token: str | None = None) -> dict:
    async with httpx.AsyncClient() as client:
        headers = await github_headers(token)
        res = await client.get(f"{GITHUB_API}/repos/{owner}/{repo}/pulls/{number}", headers=headers)

        if res.status_code == 404:
            raise HTTPException(404, "PR not found. Check the URL or add a GitHub token for private repos.")
        if res.status_code == 403:
            raise HTTPException(403, "GitHub rate limit exceeded or access denied. Add a GitHub token.")
        if res.status_code == 401:
            raise HTTPException(401, "Invalid GitHub token.")
        if not res.is_success:
            err = res.json() if res.content else {}
            raise HTTPException(res.status_code, err.get("message", "GitHub API error"))

        return res.json()


async def get_pull_request_files(owner: str, repo: str, number: int, token: str | None = None) -> list:
    async with httpx.AsyncClient() as client:
        headers = await github_headers(token)
        res = await client.get(
            f"{GITHUB_API}/repos/{owner}/{repo}/pulls/{number}/files",
            headers=headers,
            params={"per_page": 100}
        )

        if not res.is_success:
            err = res.json() if res.content else {}
            raise HTTPException(res.status_code, err.get("message", "Failed to fetch PR files"))

        return res.json()


async def post_pull_request_review(owner: str, repo: str, number: int, body: str, event: str, token: str) -> dict:
    async with httpx.AsyncClient() as client:
        headers = await github_headers(token)
        headers["Content-Type"] = "application/json"
        res = await client.post(
            f"{GITHUB_API}/repos/{owner}/{repo}/pulls/{number}/reviews",
            headers=headers,
            json={"body": body, "event": event}
        )

        if res.status_code == 401:
            raise HTTPException(401, "Invalid GitHub token — cannot post review.")
        if res.status_code == 403:
            raise HTTPException(403, "No permission to post review on this PR.")
        if not res.is_success:
            err = res.json() if res.content else {}
            raise HTTPException(res.status_code, err.get("message", "Failed to post review"))

        return res.json()


def build_diff_content(pr: dict, files: list) -> str:
    out = f"PR #{pr['number']}: {pr['title']}\n"
    if pr.get("body"):
        out += f"\nDescription: {pr['body'][:600]}\n"
    out += f"\nBranch: {pr['head']['label']} → {pr['base']['label']}"
    out += f"\nAuthor: {pr['user']['login']}"
    out += f"\nStats: +{pr['additions']} -{pr['deletions']} | {pr['changed_files']} files\n\n"
    out += "═══ DIFF ═══\n\n"

    total_chars = len(out)
    MAX_CHARS = 20000

    for f in files:
        if total_chars >= MAX_CHARS:
            out += "[...remaining files truncated due to size]\n"
            break
        out += f"── {f['filename']} [{f['status']}] +{f['additions']} -{f['deletions']}\n"
        if f.get("patch"):
            patch = f["patch"]
            if len(patch) > 4000:
                patch = patch[:4000] + "\n[...truncated]"
            out += patch + "\n\n"
        else:
            out += "[Binary or large file]\n\n"
        total_chars = len(out)

    return out