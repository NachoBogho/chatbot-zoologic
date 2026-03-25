/**
 * Indicador animado de escritura.
 * Tres puntos con animación de rebote escalonada.
 */
export default function TypingIndicator() {
  const dotStyle = (delay) => ({
    width: '7px',
    height: '7px',
    borderRadius: '50%',
    background: 'var(--zl-blue)',
    opacity: 0.5,
    animation: `zlBounce 1.3s ease-in-out ${delay}s infinite`,
  });

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: '8px',
        marginBottom: '10px',
        animation: 'zlFadeIn 0.22s ease-out',
      }}
    >
      {/* Avatar */}
      <div
        style={{
          width: '30px',
          height: '30px',
          borderRadius: '50%',
          background: 'var(--zl-gradient)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          fontSize: '15px',
          boxShadow: '0 2px 8px rgba(26, 86, 219, 0.25)',
        }}
      >
        🦜
      </div>

      {/* Burbuja con puntos */}
      <div
        style={{
          padding: '12px 18px',
          borderRadius: '4px 18px 18px 18px',
          background: 'var(--zl-surface)',
          border: '1px solid var(--zl-border-soft)',
          boxShadow: 'var(--zl-shadow-sm)',
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
