/**
 * Burbuja de mensaje individual.
 * Bot (izquierda): fondo azul-lavanda suave, avatar con emoji de guacamayo.
 * Usuario (derecha): gradiente azul Zoologic, texto blanco.
 */
export default function ChatMessage({ message }) {
  const isUser = message.role === 'user';

  const time = message.timestamp
    ? new Date(message.timestamp).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
    : '';

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: '8px',
        marginBottom: '10px',
        flexDirection: isUser ? 'row-reverse' : 'row',
        animation: 'zlFadeIn 0.22s ease-out',
      }}
    >
      {/* Avatar del bot */}
      {!isUser && (
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
      )}

      {/* Burbuja + timestamp */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: isUser ? 'flex-end' : 'flex-start',
          maxWidth: '72%',
          gap: '4px',
        }}
      >
        <div
          style={{
            padding: '10px 14px',
            borderRadius: isUser
              ? '18px 4px 18px 18px'
              : '4px 18px 18px 18px',
            background: isUser
              ? 'var(--zl-gradient)'
              : 'var(--zl-surface)',
            color: isUser ? '#ffffff' : 'var(--zl-ink)',
            fontSize: '14px',
            lineHeight: '1.55',
            fontWeight: 400,
            wordBreak: 'break-word',
            boxShadow: isUser
              ? '0 2px 12px rgba(26, 86, 219, 0.28)'
              : 'var(--zl-shadow-sm)',
            border: isUser ? 'none' : '1px solid var(--zl-border-soft)',
            letterSpacing: '-0.005em',
          }}
        >
          {message.content}
        </div>

        {/* Timestamp */}
        <span
          style={{
            fontSize: '11px',
            color: 'var(--zl-ink-4)',
            paddingInline: '4px',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {time}
        </span>
      </div>
    </div>
  );
}
