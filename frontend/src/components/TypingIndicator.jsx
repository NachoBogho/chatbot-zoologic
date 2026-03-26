export default function TypingIndicator() {
  const dotStyle = (delay) => ({
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    background: 'var(--pt-orange)',
    opacity: 0.4,
    animation: `ptBounce 1.3s ease-in-out ${delay}s infinite`,
  });

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: '8px',
        marginBottom: '12px',
        animation: 'ptFadeIn 0.22s ease-out',
      }}
    >
      {/* Avatar */}
      <div
        style={{
          width: '28px',
          height: '28px',
          borderRadius: '9px',
          background: 'var(--pt-gradient)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          boxShadow: '0 2px 8px rgba(124, 58, 237, 0.30)',
        }}
      >
        <span style={{ color: '#fff', fontWeight: 800, fontSize: '12px', letterSpacing: '-0.03em', lineHeight: 1 }}>
          P
        </span>
      </div>

      {/* Burbuja con puntos */}
      <div
        style={{
          padding: '12px 16px',
          borderRadius: '4px 16px 16px 16px',
          background: 'var(--pt-surface)',
          border: '1px solid var(--pt-border-soft)',
          boxShadow: 'var(--pt-shadow-sm)',
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
        }}
      >
        <span style={dotStyle(0)} />
        <span style={dotStyle(0.18)} />
        <span style={dotStyle(0.36)} />
      </div>
    </div>
  );
}
