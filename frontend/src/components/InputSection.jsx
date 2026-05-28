import React, { useState } from 'react'

export default function InputSection({ onAnalyze, loading, error }) {
  const [prUrl, setPrUrl] = useState('')
  const [ghToken, setGhToken] = useState(() => localStorage.getItem('axiom_gh_token') || '')
  const [focus, setFocus] = useState('')
  const [showAdvanced, setShowAdvanced] = useState(false)

  const handleSubmit = () => {
    if (ghToken) localStorage.setItem('axiom_gh_token', ghToken)
    onAnalyze({ prUrl, ghToken, focus })
  }

  return (
    <section style={{ paddingBottom: 80 }}>
      <div className="divider-row reveal">
        <div className="divider-line" />
        <div className="divider-label">Pull Request</div>
        <div className="divider-line" />
      </div>

      <div className="page-wrap">
        <div style={{
          border: '1px solid var(--border)', padding: 36,
          background: 'var(--fill)', position: 'relative'
        }}>
          {/* Gold top accent */}
          <div style={{
            position: 'absolute', top: -1, left: 60, right: 60,
            height: 1, background: 'var(--gold)', opacity: 0.32
          }} />

          {/* PR URL */}
          <div style={{ marginBottom: 20 }}>
            <label className="field-label">Pull Request URL</label>
            <input
              className="f-input"
              type="text"
              value={prUrl}
              onChange={e => setPrUrl(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              placeholder="https://github.com/owner/repo/pull/42"
            />
          </div>

          {/* Two col */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 20 }}>
            <div>
              <label className="field-label">
                GitHub Token{' '}
                <span style={{ textTransform: 'none', letterSpacing: 0, fontSize: 9, color: '#b0a396' }}>
                  (private repos)
                </span>
              </label>
              <input
                className="f-input"
                type="password"
                value={ghToken}
                onChange={e => setGhToken(e.target.value)}
                placeholder="ghp_••••••••••"
              />
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: '#b0a396', marginTop: 7 }}>
                <a href="https://github.com/settings/tokens" target="_blank" rel="noreferrer" style={{ color: 'var(--gold)' }}>
                  Generate token ↗
                </a>
              </div>
            </div>
            <div>
              <label className="field-label">Focus Area <span style={{ textTransform: 'none', letterSpacing: 0, fontSize: 9, color: '#b0a396' }}>(optional)</span></label>
              <input
                className="f-input"
                type="text"
                value={focus}
                onChange={e => setFocus(e.target.value)}
                placeholder="e.g. security, performance"
              />
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: '#b0a396', marginTop: 7 }}>
                Leave blank for a full review
              </div>
            </div>
          </div>

          {/* Advanced toggle */}
          <button
            onClick={() => setShowAdvanced(v => !v)}
            style={{
              fontFamily: "'Space Mono', monospace", fontSize: 9, letterSpacing: '0.14em',
              textTransform: 'uppercase', color: 'var(--muted)', background: 'none',
              border: 'none', cursor: 'pointer', paddingBottom: 16,
              display: 'flex', alignItems: 'center', gap: 8
            }}
          >
            <span style={{ display: 'inline-block', transition: 'transform .2s', transform: showAdvanced ? 'rotate(180deg)' : 'none' }}>▼</span>
            Advanced Settings
          </button>

          {showAdvanced && (
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 20, marginBottom: 20 }}>
              <label className="field-label">Anthropic API Key</label>
              <input
                className="f-input"
                type="password"
                defaultValue={localStorage.getItem('axiom_anthropic_key') || ''}
                onChange={e => localStorage.setItem('axiom_anthropic_key', e.target.value)}
                placeholder="sk-ant-••••••••••"
              />
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: '#b0a396', marginTop: 7 }}>
                <a href="https://console.anthropic.com" target="_blank" rel="noreferrer" style={{ color: 'var(--gold)' }}>console.anthropic.com ↗</a>
              </div>
            </div>
          )}

          <button className="btn-primary" onClick={handleSubmit} disabled={loading} style={{ width: '100%' }}>
            {loading ? 'Analyzing...' : 'Analyze Pull Request →'}
          </button>

          {error && (
            <div style={{
              fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic',
              fontSize: 16, color: '#8b2424', marginTop: 12
            }}>
              {error}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
