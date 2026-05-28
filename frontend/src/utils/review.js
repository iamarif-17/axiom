const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

// ─── Request AI Review via backend ───
export async function requestReview({ owner, repo, number, token, focus }) {
  const res = await fetch(`${API_URL}/api/review`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'x-github-token': token } : {})
    },
    body: JSON.stringify({ owner, repo, number, focus: focus || null })
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.detail || `Review failed: ${res.status}`)
  }
  return res.json()
}

// ─── Format review as Markdown ───
export function toMarkdown(review, pr) {
  const vMap = {
    approved: '✅ Approved',
    needs_work: '⚠️ Needs Work',
    critical_issues: '🚨 Critical Issues'
  }

  let md = `## Axiom Code Review — PR #${pr?.number || ''}: ${pr?.title || ''}\n\n`
  md += `**Verdict:** ${vMap[review.verdict] || review.verdict}\n\n`
  md += `**Scores:** Correctness ${review.scores?.correctness} · Readability ${review.scores?.readability} · Performance ${review.scores?.performance} · Security ${review.scores?.security}\n\n`
  md += `### Summary\n${review.summary}\n\n`

  if (review.issues?.length) {
    md += `### Issues\n`
    review.issues.forEach(i => {
      md += `\n**[${(i.severity || '').toUpperCase()}]** ${i.title}`
      if (i.file) md += ` · \`${i.file}\`${i.line ? ` line ${i.line}` : ''}`
      md += `\n${i.description}\n`
      if (i.suggestion) md += `> 💡 ${i.suggestion}\n`
    })
    md += '\n'
  }

  const sections = [
    ['edge_cases', 'Edge Cases'],
    ['optimizations', 'Optimizations'],
    ['security', 'Security']
  ]
  sections.forEach(([key, label]) => {
    if (!review[key]?.length) return
    md += `### ${label}\n`
    review[key].forEach(item => md += `\n**${item.title}**\n${item.description}\n`)
    md += '\n'
  })

  md += `---\n*${review.closing}*\n\n*Reviewed by [Axiom](https://github.com)*`
  return md
}
