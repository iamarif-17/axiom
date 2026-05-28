import React from 'react'

export default function Hero() {
  return (
    <section style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      justifyContent: 'center', alignItems: 'center',
      textAlign: 'center', padding: '120px 48px 80px', position: 'relative', overflow: 'hidden'
    }}>
      {/* Glow */}
      <div style={{
        position: 'absolute', top: '-5%', left: '50%', transform: 'translateX(-50%)',
        width: 800, height: 600,
        background: 'radial-gradient(ellipse, rgba(200,169,110,0.09) 0%, transparent 65%)',
        pointerEvents: 'none'
      }} />

      <div style={{
        fontFamily: "'Space Mono', monospace", fontSize: 9,
        letterSpacing: '0.28em', textTransform: 'uppercase', color: '#C8A96E',
        marginBottom: 28, animation: 'fadeUp .8s .1s ease both'
      }}>
        AI Code Review · GitHub Native
      </div>

      <h1 style={{
        fontFamily: "'Cormorant Garamond', serif", fontWeight: 300,
        fontSize: 'clamp(80px, 14vw, 136px)', letterSpacing: '0.22em',
        lineHeight: 0.9, textTransform: 'uppercase', color: '#F5F1E8',
        marginBottom: 28, animation: 'fadeUp .9s .2s ease both'
      }}>
        AXIOM
      </h1>

      <p style={{
        fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic',
        fontWeight: 300, fontSize: 'clamp(18px, 2.2vw, 24px)',
        color: '#a89b8e', letterSpacing: '0.04em', marginBottom: 52,
        animation: 'fadeUp .9s .35s ease both'
      }}>
        Every line has a verdict.
      </p>

      <div style={{ marginBottom: 52, opacity: 0.4, animation: 'fadeUp .9s .45s ease both' }}>
        <svg width="100" height="72" viewBox="0 0 100 72" fill="none">
          <circle cx="36" cy="36" r="22" stroke="#F5F1E8" strokeWidth="0.8"/>
          <circle cx="64" cy="36" r="22" stroke="#F5F1E8" strokeWidth="0.8"/>
          <circle cx="50" cy="43" r="6" stroke="#F5F1E8" strokeWidth="0.7"/>
          <circle cx="50" cy="28" r="2.5" fill="#C8A96E" opacity="0.7"/>
        </svg>
      </div>

      <div style={{
        position: 'absolute', bottom: 36, left: '50%', transform: 'translateX(-50%)',
        fontFamily: "'Space Mono', monospace", fontSize: 9,
        letterSpacing: '0.18em', textTransform: 'uppercase', color: '#8a7d70',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
        animation: 'fadeUp .9s .7s ease both'
      }}>
        <div style={{
          width: 1, height: 36,
          background: 'linear-gradient(to bottom, #C8A96E, transparent)',
          animation: 'scrollPulse 2s ease-in-out infinite'
        }} />
        <span>Scroll</span>
      </div>

      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
        @keyframes scrollPulse { 0%,100%{opacity:.3;transform:scaleY(.7)} 50%{opacity:1;transform:scaleY(1)} }
      `}</style>
    </section>
  )
}