from fastapi import APIRouter, Header, HTTPException
from typing import Optional
from app.services.github_service import get_pull_request, get_pull_request_files, post_pull_request_review
from app.models.review import PostReviewRequest

router = APIRouter(prefix="/api/pr", tags=["github"])


@router.get("/{owner}/{repo}/{number}")
async def fetch_pr(
    owner: str,
    repo: str,
    number: int,
    x_github_token: Optional[str] = Header(default=None)
):
    """Fetch pull request metadata from GitHub."""
    return await get_pull_request(owner, repo, number, x_github_token)


@router.get("/{owner}/{repo}/{number}/files")
async def fetch_pr_files(
    owner: str,
    repo: str,
    number: int,
    x_github_token: Optional[str] = Header(default=None)
):
    """Fetch files changed in a pull request."""
    return await get_pull_request_files(owner, repo, number, x_github_token)


@router.post("/{owner}/{repo}/{number}/review")
async def post_review(
    owner: str,
    repo: str,
    number: int,
    body: PostReviewRequest,
    x_github_token: Optional[str] = Header(default=None)
):
    """Post a review comment back to the GitHub PR."""
    if not x_github_token:
        raise HTTPException(401, "GitHub token required to post reviews.")

    result = await post_pull_request_review(
        owner, repo, number,
        body.body, body.event,
        x_github_token
    )
    return {"html_url": result.get("html_url"), "id": result.get("id")}
