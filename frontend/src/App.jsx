import useChatStore from './store/chatStore';
import ChatWindow from './components/ChatWindow';

/**
 * Componente raíz del widget.
 * Botón flotante + ventana de chat, posicionados en esquina inferior derecha.
 */
export default function App() {
  const { isOpen, toggleChat } = useChatStore();

  return (
    <div
      className="zl-widget-root"
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: '12px',
      }}
    >
      {/* Ventana del chat */}
      {isOpen && <ChatWindow />}

      {/* Botón flotante */}
      <div style={{ position: 'relative', display: 'inline-flex' }}>
        {/* Onda de pulso (solo cuando está cerrado) */}
        {!isOpen && (
          <span
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              background: 'var(--zl-blue)',
              animation: 'zlPulse 2.4s ease-out infinite',
              pointerEvents: 'none',
            }}
          />
        )}

        <button
          onClick={toggleChat}
          aria-label={isOpen ? 'Cerrar chat con Zara' : 'Abrir chat con Zara'}
          style={{
            position: 'relative',
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'var(--zl-gradient)',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--zl-shadow-btn)',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            animation: 'zlPop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
            color: '#fff',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.08)';
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(26, 86, 219, 0.50)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = 'var(--zl-shadow-btn)';
          }}
          onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.95)'; }}
          onMouseUp={(e) => { e.currentTarget.style.transform = 'scale(1.08)'; }}
        >
          {isOpen ? <IconClose /> : <IconChat />}
        </button>
      </div>
    </div>
  );
}

function IconChat() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C6.477 2 2 6.18 2 11.333c0 2.812 1.304 5.332 3.375 7.083L4.5 22l4.313-1.917A11.43 11.43 0 0012 20.667c5.523 0 10-4.18 10-9.334C22 6.18 17.523 2 12 2z" fill="white"/>
      <circle cx="8" cy="11" r="1.5" fill="var(--zl-blue)"/>
      <circle cx="12" cy="11" r="1.5" fill="var(--zl-blue)"/>
      <circle cx="16" cy="11" r="1.5" fill="var(--zl-blue)"/>
    </svg>
  );
}

function IconClose() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 5L5 15M5 5l10 10" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  );
}
