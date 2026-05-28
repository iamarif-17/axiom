const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

// ─── Parse GitHub PR URL ───
export function parsePrUrl(url) {
  const m = url.match(/github\.com\/([^/]+)\/([^/]+)\/pull\/(\d+)/)
  return m ? { owner: m[1], repo: m[2], number: parseInt(m[3]) } : null
}

// ─── Fetch PR data via backend ───
export async function fetchPR(owner, repo, number, token) {
  const res = await fetch(`${API_URL}/api/pr/${owner}/${repo}/${number}`, {
    headers: token ? { 'x-github-token': token } : {}
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.detail || `Failed to fetch PR: ${res.status}`)
  }
  return res.json()
}

// ─── Fetch PR files via backend ───
export async function fetchPRFiles(owner, repo, number, token) {
  const res = await fetch(`${API_URL}/api/pr/${owner}/${repo}/${number}/files`, {
    headers: token ? { 'x-github-token': token } : {}
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.detail || `Failed to fetch PR files: ${res.status}`)
  }
  return res.json()
}

// ─── Post review to GitHub via backend ───
export async function postPRReview(owner, repo, number, token, markdown) {
  const res = await fetch(`${API_URL}/api/pr/${owner}/${repo}/${number}/review`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'x-github-token': token } : {})
    },
    body: JSON.stringify({ body: markdown, event: 'COMMENT' })
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.detail || `Failed to post review: ${res.status}`)
  }
  return res.json()
}
