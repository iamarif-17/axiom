import React from 'react'

export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--border)',
      padding: '28px 52px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      background: 'rgba(28,25,23,.02)'
    }}>
      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 300, fontSize: 17, letterSpacing: '0.28em', textTransform: 'uppercase', color: '#a89b8e' }}>
        Axiom
      </div>
      <div style={{ fontFamily: "'Space Mono', monospace", fontSize: 9, color: '#c0b4aa', letterSpacing: '0.1em' }}>
        © 2026 Axiom
      </div>
    </footer>
  )
}
