import React from 'react'

const statusStyle = {
  open:   { color: '#4ade80', borderColor: 'rgba(74,222,128,.3)',   background: 'rgba(74,222,128,.06)' },
  closed: { color: '#f87171', borderColor: 'rgba(248,113,113,.25)', background: 'rgba(248,113,113,.05)' },
  merged: { color: '#a78bfa', borderColor: 'rgba(167,139,250,.25)', background: 'rgba(167,139,250,.05)' }
}

const fileStatusColors = {
  added:    { bg: 'rgba(74,222,128,.08)',   color: '#4ade80' },
  modified: { bg: 'rgba(200,169,110,.12)',  color: '#C8A96E' },
  deleted:  { bg: 'rgba(248,113,113,.07)',  color: '#f87171' },
  renamed:  { bg: 'rgba(245,241,232,.07)',  color: '#a89b8e' }
}

export default function PRCard({ pr, files }) {
  if (!pr) return null
  const stateKey = pr.merged_at ? 'merged' : pr.state
  const ss = statusStyle[stateKey] || statusStyle.open

  return (
    <section style={{ paddingBottom: 60, paddingTop: 52 }}>
      <div className="divider-row">
        <div className="divider-line" />
        <div className="divider-label">PR Overview</div>
        <div className="divider-line" />
      </div>
      <div className="page-wrap">
        <div style={{
          border: '1px solid rgba(245,241,232,.12)', padding: 30,
          background: 'rgba(245,241,232,.02)', animation: 'fadeUp .6s ease both'
        }}>
          {/* Top row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 }}>
            <div style={{ flex: 1, marginRight: 16 }}>
              <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: '#C8A96E', letterSpacing: '0.12em', marginBottom: 8 }}>
                PR #{pr.number} · {pr.state.toUpperCase()}
              </div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 400, fontSize: 28, color: '#F5F1E8', lineHeight: 1.22 }}>
                {pr.title}
              </div>
            </div>
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '6px 14px', border: '1px solid', flexShrink: 0, ...ss }}>
              {pr.merged_at ? 'Merged' : pr.state}
            </div>
          </div>

          {/* Meta */}
          <div style={{ display: 'flex', gap: 22, flexWrap: 'wrap', marginBottom: 14 }}>
            {[
              `By ${pr.user.login}`,
              `${pr.head.label} → ${pr.base.label}`,
              new Date(pr.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
            ].map((item, i) => (
              <span key={i} style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: '#8a7d70', letterSpacing: '0.06em' }}>
                {item}
              </span>
            ))}
          </div>

          {/* Stats */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
            {[
              { label: `${pr.changed_files} files`, style: { color: '#a89b8e', background: 'rgba(245,241,232,.04)' } },
              { label: `+${pr.additions}`, style: { color: '#4ade80', borderColor: 'rgba(74,222,128,.2)', background: 'rgba(74,222,128,.05)' } },
              { label: `−${pr.deletions}`, style: { color: '#f87171', borderColor: 'rgba(248,113,113,.18)', background: 'rgba(248,113,113,.04)' } }
            ].map((s, i) => (
              <span key={i} style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, letterSpacing: '0.06em', padding: '4px 12px', border: '1px solid rgba(245,241,232,.12)', ...s.style }}>
                {s.label}
              </span>
            ))}
          </div>

          {/* Files */}
          <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#8a7d70', marginBottom: 10, paddingTop: 16, borderTop: '1px solid rgba(245,241,232,.12)' }}>
            Changed Files
          </div>
          {(files || []).slice(0, 25).map((f, i) => {
            const clr = fileStatusColors[f.status] || fileStatusColors.modified
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 0', borderBottom: i < Math.min(files.length, 25) - 1 ? '1px solid rgba(245,241,232,.05)' : 'none' }}>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, padding: '2px 8px', flexShrink: 0, background: clr.bg, color: clr.color }}>{f.status}</span>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 11, color: '#F5F1E8', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={f.filename}>{f.filename}</span>
                <span style={{ fontFamily: "'Space Mono', monospace", fontSize: 10, color: '#a89b8e', whiteSpace: 'nowrap', flexShrink: 0 }}>
                  <span style={{ color: '#4ade80' }}>+{f.additions}</span>{' '}
                  <span style={{ color: '#f87171' }}>-{f.deletions}</span>
                </span>
              </div>
            )
          })}
          {files?.length > 25 && (
            <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: '#a89b8e', padding: '8px 0', textAlign: 'center' }}>
              +{files.length - 25} more files
            </div>
          )}
        </div>
        <a href={pr.html_url} target="_blank" rel="noreferrer" style={{
          display: 'block', textAlign: 'center', marginTop: 18,
          fontFamily: "'Space Mono', monospace", fontSize: 9, color: '#C8A96E',
          textDecoration: 'none', letterSpacing: '0.1em', borderBottom: '1px solid rgba(200,169,110,.25)',
          width: 'fit-content', marginLeft: 'auto', marginRight: 'auto', paddingBottom: 2
        }}>
          View on GitHub ↗
        </a>
      </div>
    </section>
  )
}