import React from 'react'

export default function LoadingSection({ message }) {
  return (
    <section style={{ padding: '56px 0', textAlign: 'center' }}>
      <div style={{
        width: 22, height: 22,
        border: '1px solid rgba(28,25,23,.14)',
        borderTopColor: '#C8A96E',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        margin: '0 auto 20px'
      }} />
      <div style={{
        fontFamily: "'Cormorant Garamond', serif",
        fontStyle: 'italic',
        fontSize: 20,
        color: '#8a7d70',
        letterSpacing: '0.04em'
      }}>
        {message}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </section>
  )
}
