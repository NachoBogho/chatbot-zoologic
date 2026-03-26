import useChatStore from './store/chatStore';
import ChatWindow from './components/ChatWindow';

export default function App() {
  const { isOpen, toggleChat } = useChatStore();

  return (
    <div
      className="pt-widget-root"
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
      {isOpen && <ChatWindow />}

      <div style={{ position: 'relative', display: 'inline-flex' }}>
        {/* Onda de pulso */}
        {!isOpen && (
          <span
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              background: 'var(--pt-orange)',
              animation: 'ptPulse 2.6s ease-out infinite',
              pointerEvents: 'none',
            }}
          />
        )}

        <button
          onClick={toggleChat}
          aria-label={isOpen ? 'Cerrar chat' : 'Hablar con Pantera'}
          style={{
            position: 'relative',
            width: '58px',
            height: '58px',
            borderRadius: '50%',
            background: 'var(--pt-gradient)',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: 'var(--pt-shadow-btn)',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            animation: 'ptPop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
            color: '#fff',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.08)';
            e.currentTarget.style.boxShadow = '0 6px 24px rgba(124, 58, 237, 0.60)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = 'var(--pt-shadow-btn)';
          }}
          onMouseDown={(e) => { e.currentTarget.style.transform = 'scale(0.94)'; }}
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
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
      <path
        d="M13 2.5C7.201 2.5 2.5 6.868 2.5 12.25c0 2.992 1.38 5.672 3.563 7.524L5 23.5l4.688-2.083A12.37 12.37 0 0013 22c5.799 0 10.5-4.368 10.5-9.75S18.799 2.5 13 2.5z"
        fill="white"
        opacity="0.95"
      />
      <circle cx="9"  cy="12.25" r="1.6" fill="var(--pt-orange)" />
      <circle cx="13" cy="12.25" r="1.6" fill="var(--pt-orange)" />
      <circle cx="17" cy="12.25" r="1.6" fill="var(--pt-orange)" />
    </svg>
  );
}

function IconClose() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path d="M15 5L5 15M5 5l10 10" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
    </svg>
  );
}
