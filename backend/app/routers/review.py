from fastapi import APIRouter, Header
from typing import Optional
from app.models.review import ReviewRequest, ReviewResponse
from app.services.github_service import get_pull_request, get_pull_request_files, build_diff_content
from app.services.claude_service import generate_review

router = APIRouter(prefix="/api", tags=["review"])


@router.post("/review", response_model=ReviewResponse)
async def create_review(
    request: ReviewRequest,
    x_github_token: Optional[str] = Header(default=None)
):
    """
    Full review pipeline:
    1. Fetch PR data + files from GitHub
    2. Build diff content
    3. Send to Claude for analysis
    4. Return structured review
    """
    # 1. Fetch PR and files in parallel
    pr, files = await _fetch_pr_data(request, x_github_token)

    # 2. Build diff
    diff = build_diff_content(pr, files)

    # 3. Generate AI review
    review = await generate_review(diff, request.focus)

    return review


async def _fetch_pr_data(request: ReviewRequest, token: Optional[str]):
    """Helper to fetch PR data and files."""
    import asyncio
    pr, files = await asyncio.gather(
        get_pull_request(request.owner, request.repo, request.number, token),
        get_pull_request_files(request.owner, request.repo, request.number, token)
    )
    return pr, files
