import React, { useEffect, useState } from 'react'
import { toMarkdown } from '../utils/review'
import { postPRReview } from '../utils/github'

const verdictConfig = {
  approved:        { label: 'Approved — Ready to Merge', color: '#4ade80', borderColor: 'rgba(74,222,128,.35)', bg: 'rgba(74,222,128,.06)' },
  needs_work:      { label: 'Needs Work',                color: '#C8A96E', borderColor: '#C8A96E',              bg: 'rgba(200,169,110,.08)' },
  critical_issues: { label: 'Critical Issues Found',     color: '#f87171', borderColor: 'rgba(248,113,113,.35)', bg: 'rgba(248,113,113,.05)' }
}

const sevColors = { high: '#f87171', medium: '#C8A96E', low: '#8a7d70' }
const sevTagColors = { high: '#f87171', medium: '#C8A96E', low: '#8a7d70' }

function ScoreBar({ label, value }) {
  const [width, setWidth] = useState(0)
  const [display, setDisplay] = useState('—')
  useEffect(() => {
    const t = setTimeout(() => { setWidth(value); setDisplay(value); }, 300)
    return () => clearTimeout(t)
  }, [value])
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 13 }}>
      <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#8a7d70', width: 100, flexShrink: 0 }}>
        {label}
      </span>
      <div style={{ flex: 1, height: 1, background: 'rgba(245,241,232,.1)', position: 'relative' }}>
        <div style={{ height: 1, background: '#C8A96E', width: `${width}%`, transition: 'width 1.2s cubic-bezier(.4,0,.2,1)', position: 'absolute', top: 0, left: 0 }} />
      </div>
      <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: '#F5F1E8', width: 24, textAlign: 'right' }}>
        {display}
      </span>
    </div>
  )
}

function IssueCard({ issue }) {
  return (
    <div style={{ padding: '22px 0', borderBottom: '1px solid rgba(245,241,232,.06)' }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 10 }}>
        <div style={{ width: 6, height: 6, borderRadius: '50%', flexShrink: 0, marginTop: 9, background: sevColors[issue.severity] || '#C8A96E' }} />
        <div style={{ flex: 1 }}>
          {issue.file && (
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: '#8a7d70', letterSpacing: '0.08em', marginBottom: 4 }}>
              {issue.file}{issue.line ? ` · line ${issue.line}` : ''}
            </div>
          )}
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 21, color: '#F5F1E8', lineHeight: 1.25 }}>
            {issue.title}
          </div>
        </div>
        <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 4, flexShrink: 0, color: sevTagColors[issue.severity] || '#C8A96E' }}>
          {issue.severity}
        </span>
      </div>
      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: '#a89b8e', lineHeight: 1.72, marginBottom: 10 }}>
        {issue.description}
      </div>
      {issue.suggestion && (
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13.5, color: '#C8A96E', borderLeft: '2px solid #C8A96E', paddingLeft: 14, fontStyle: 'italic', lineHeight: 1.65 }}>
          {issue.suggestion}
        </div>
      )}
    </div>
  )
}

function SimpleCard({ title, description }) {
  return (
    <div style={{ padding: '17px 0', borderBottom: '1px solid rgba(245,241,232,.06)' }}>
      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 21, color: '#F5F1E8', marginBottom: 6 }}>{title}</div>
      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, color: '#a89b8e', lineHeight: 1.72 }}>{description}</div>
    </div>
  )
}

function SectionHead({ children }) {
  return (
    <div style={{
      fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, fontSize: 11,
      letterSpacing: '0.26em', textTransform: 'uppercase', color: '#F5F1E8',
      margin: '44px 0 16px', paddingBottom: 10, borderBottom: '1px solid rgba(245,241,232,.12)'
    }}>
      {children}
    </div>
  )
}

export default function ReviewSection({ review, pr, files, owner, repo, number, ghToken, onReset }) {
  const [posting, setPosting] = useState(false)
  const [posted, setPosted] = useState(null)
  const [copyLabel, setCopyLabel] = useState('Copy as Markdown')

  if (!review) return null

  const vc = verdictConfig[review.verdict] || verdictConfig.needs_work

  const handleCopy = () => {
    navigator.clipboard.writeText(toMarkdown(review, pr)).then(() => {
      setCopyLabel('Copied ✓')
      setTimeout(() => setCopyLabel('Copy as Markdown'), 2000)
    })
  }

  const handlePost = async () => {
    if (!ghToken) { alert('Add a GitHub token to post reviews.'); return }
    setPosting(true)
    try {
      const result = await postPRReview(owner, repo, number, ghToken, toMarkdown(review, pr))
      setPosted(result.html_url)
    } catch (err) {
      alert('Failed to post: ' + err.message)
    }
    setPosting(false)
  }

  return (
    <section style={{ paddingBottom: 80, paddingTop: 52 }}>
      <div className="divider-row">
        <div className="divider-line" />
        <div className="divider-label">Code Review</div>
        <div className="divider-line" />
      </div>
      <div className="page-wrap">

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 32 }}>
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', padding: '11px 32px', border: '1px solid', color: vc.color, borderColor: vc.borderColor, background: vc.bg }}>
            {vc.label}
          </div>
        </div>

        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: 'clamp(18px, 2.2vw, 22px)', lineHeight: 1.85, color: '#F5F1E8', textAlign: 'center', maxWidth: 580, margin: '0 auto 44px', letterSpacing: '0.01em' }}>
          {review.summary}
        </p>

        <div style={{ border: '1px solid rgba(245,241,232,.12)', padding: '28px 32px', background: 'rgba(245,241,232,.03)', marginBottom: 44 }}>
          <ScoreBar label="Correctness" value={review.scores?.correctness || 0} />
          <ScoreBar label="Readability" value={review.scores?.readability || 0} />
          <ScoreBar label="Performance" value={review.scores?.performance || 0} />
          <ScoreBar label="Security"    value={review.scores?.security    || 0} />
        </div>

        {review.issues?.length > 0 && (
          <>
            <SectionHead>Issues</SectionHead>
            {review.issues.map((iss, i) => <IssueCard key={i} issue={iss} />)}
          </>
        )}

        {review.edge_cases?.length > 0 && (
          <>
            <SectionHead>Edge Cases</SectionHead>
            {review.edge_cases.map((item, i) => <SimpleCard key={i} {...item} />)}
          </>
        )}

        {review.optimizations?.length > 0 && (
          <>
            <SectionHead>Optimizations</SectionHead>
            {review.optimizations.map((item, i) => <SimpleCard key={i} {...item} />)}
          </>
        )}

        {review.security?.length > 0 && (
          <>
            <SectionHead>Security</SectionHead>
            {review.security.map((item, i) => <SimpleCard key={i} {...item} />)}
          </>
        )}

        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: 'clamp(19px, 2.4vw, 25px)', color: '#F5F1E8', textAlign: 'center', padding: '44px 0 40px', borderTop: '1px solid rgba(245,241,232,.12)', marginTop: 40, lineHeight: 1.6 }}>
          {review.closing}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
          <button className="btn-secondary" onClick={handleCopy}>{copyLabel}</button>
          <button className="btn-secondary" onClick={onReset}>New PR</button>
          <button
            className="btn-secondary"
            onClick={handlePost}
            disabled={posting || !!posted}
            style={posted ? { background: '#2d6a3f', borderColor: '#2d6a3f', color: '#F5F1E8' } : {}}
          >
            {posting ? 'Posting...' : posted ? 'Posted ✓' : 'Post to GitHub PR →'}
          </button>
        </div>

        {posted && (
          <div style={{ textAlign: 'center', marginTop: 14 }}>
            <a href={posted} target="_blank" rel="noreferrer" style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: '#C8A96E', textDecoration: 'none', letterSpacing: '0.1em', borderBottom: '1px solid rgba(200,169,110,.3)', paddingBottom: 2 }}>
              View posted review on GitHub ↗
            </a>
          </div>
        )}
      </div>
    </section>
  )
}