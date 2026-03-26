/**
 * Burbuja de mensaje con markdown rendering.
 * Bot (izq): fondo blanco cálido, avatar monograma "P" naranja.
 * Usuario (der): gradiente naranja Pantera, texto blanco.
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
        marginBottom: '12px',
        flexDirection: isUser ? 'row-reverse' : 'row',
        animation: 'ptFadeIn 0.22s ease-out',
      }}
    >
      {/* Avatar del bot */}
      {!isUser && (
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
      )}

      {/* Burbuja + timestamp */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: isUser ? 'flex-end' : 'flex-start',
          maxWidth: '75%',
          gap: '4px',
        }}
      >
        <div
          className={!isUser ? 'pt-bubble-content' : undefined}
          style={{
            padding: '10px 14px',
            borderRadius: isUser
              ? '16px 4px 16px 16px'
              : '4px 16px 16px 16px',
            background: isUser
              ? 'var(--pt-gradient-user)'
              : 'var(--pt-surface)',
            color: isUser ? '#ffffff' : 'var(--pt-ink)',
            fontSize: '14px',
            lineHeight: '1.58',
            fontWeight: 400,
            wordBreak: 'break-word',
            boxShadow: isUser
              ? '0 2px 14px rgba(124, 58, 237, 0.32)'
              : 'var(--pt-shadow-sm)',
            border: isUser ? 'none' : '1px solid var(--pt-border-soft)',
            letterSpacing: '-0.005em',
          }}
        >
          {isUser ? message.content : <MarkdownContent text={message.content} />}
        </div>

        <span
          style={{
            fontSize: '10.5px',
            color: 'var(--pt-ink-4)',
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

/* ─── Markdown renderer liviano ─────────────────────────────────── */
function MarkdownContent({ text }) {
  const lines = text.split('\n');
  const elements = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Línea vacía → separación
    if (line.trim() === '') {
      i++;
      continue;
    }

    // Listas con guión o bullet
    if (/^[-•*]\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^[-•*]\s+/.test(lines[i])) {
        items.push(
          <li key={i} style={{ marginBottom: '3px' }}>
            {renderInline(lines[i].replace(/^[-•*]\s+/, ''))}
          </li>
        );
        i++;
      }
      elements.push(
        <ul key={`ul-${i}`} style={{ paddingLeft: '17px', margin: '4px 0' }}>
          {items}
        </ul>
      );
      continue;
    }

    // Listas numeradas
    if (/^\d+\.\s+/.test(line)) {
      const items = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i])) {
        items.push(
          <li key={i} style={{ marginBottom: '3px' }}>
            {renderInline(lines[i].replace(/^\d+\.\s+/, ''))}
          </li>
        );
        i++;
      }
      elements.push(
        <ol key={`ol-${i}`} style={{ paddingLeft: '17px', margin: '4px 0' }}>
          {items}
        </ol>
      );
      continue;
    }

    // Párrafo normal
    elements.push(
      <p key={i} style={{ margin: elements.length > 0 ? '5px 0 0' : '0' }}>
        {renderInline(line)}
      </p>
    );
    i++;
  }

  return <>{elements}</>;
}

function renderInline(text) {
  // Dividir por **bold**, URLs
  const parts = text.split(/(\*\*[^*]+\*\*|https?:\/\/[^\s)]+)/g);

  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    if (/^https?:\/\//.test(part)) {
      const short = part.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
      return (
        <a
          key={i}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: 'var(--pt-orange-light)',
            textDecoration: 'underline',
            textUnderlineOffset: '2px',
            fontWeight: 500,
          }}
        >
          {short}
        </a>
      );
    }
    return part;
  });
}
