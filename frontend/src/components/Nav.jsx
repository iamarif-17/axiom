import React from 'react'

const styles = {
  nav: {
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '20px 52px',
    background: 'rgba(15,14,13,0.93)',
    backdropFilter: 'blur(14px)',
    borderBottom: '1px solid rgba(245,241,232,0.08)'
  },
  logo: {
    fontFamily: "'Cormorant Garamond', serif",
    fontWeight: 300, fontSize: 20,
    letterSpacing: '0.3em', textTransform: 'uppercase', color: '#F5F1E8'
  },
  links: { display: 'flex', alignItems: 'center', gap: 32 },
  link: {
    fontFamily: "'Space Mono', monospace", fontSize: 9,
    letterSpacing: '0.16em', textTransform: 'uppercase',
    color: '#8a7d70', textDecoration: 'none', transition: 'color .2s'
  },
  btn: {
    fontFamily: "'Space Mono', monospace", fontSize: 9,
    letterSpacing: '0.14em', textTransform: 'uppercase',
    padding: '9px 20px', border: '1px solid rgba(245,241,232,0.2)',
    background: 'transparent', color: '#F5F1E8', cursor: 'pointer',
    transition: 'all .2s'
  }
}

export default function Nav() {
  return (
    <nav style={styles.nav}>
      <div style={styles.logo}>Axiom</div>
      <div style={styles.links}>
        <a href="https://docs.github.com/en/rest" target="_blank" rel="noreferrer" style={styles.link}>Docs</a>
        <a href="https://github.com" target="_blank" rel="noreferrer" style={styles.link}>GitHub</a>
        <button style={styles.btn}>Sign in with GitHub</button>
      </div>
    </nav>
  )
}