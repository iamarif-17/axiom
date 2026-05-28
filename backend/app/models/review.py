from pydantic import BaseModel
from typing import Optional

class ReviewRequest(BaseModel):
    owner: str
    repo: str
    number: int
    focus: Optional[str] = None

class PostReviewRequest(BaseModel):
    body: str
    event: str = "COMMENT"

class ReviewIssue(BaseModel):
    severity: str
    file: str = ""
    line: str = ""
    title: str
    description: str
    suggestion: str = ""

class ReviewItem(BaseModel):
    title: str
    description: str

class ReviewScores(BaseModel):
    correctness: int
    readability: int
    performance: int
    security: int

class ReviewResponse(BaseModel):
    summary: str
    verdict: str
    scores: ReviewScores
    issues: list[ReviewIssue] = []
    edge_cases: list[ReviewItem] = []
    optimizations: list[ReviewItem] = []
    security: list[ReviewItem] = []
    closing: str
