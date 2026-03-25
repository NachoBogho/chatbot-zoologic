import { useEffect, useRef } from 'react';
import useChatStore from '../store/chatStore';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import TypingIndicator from './TypingIndicator';

/**
 * Ventana principal del chat con header de marca, área de mensajes y input.
 */
export default function ChatWindow() {
  const { messages, isLoading, closeChat } = useChatStore();
  const messagesEndRef = useRef(null);

  // Scroll automático al último mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div
      style={{
        width: '380px',
        maxHeight: '580px',
        background: 'var(--zl-surface)',
        borderRadius: 'var(--zl-radius-lg)',
        boxShadow: 'var(--zl-shadow-lg)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        border: '1px solid var(--zl-border)',
        animation: 'zlSlideUp 0.28s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {/* ── HEADER ── */}
      <div
        style={{
          background: 'var(--zl-gradient)',
          padding: '16px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
        }}
      >
        {/* Identidad de Zara */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Avatar */}
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(8px)',
              border: '2px solid rgba(255,255,255,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              fontSize: '18px',
            }}
          >
            🦜
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ color: '#fff', fontWeight: 700, fontSize: '15px', letterSpacing: '-0.01em' }}>
                Zara
              </span>
              <span
                style={{
                  background: 'rgba(255,255,255,0.18)',
                  color: 'rgba(255,255,255,0.9)',
                  fontSize: '10px',
                  fontWeight: 600,
                  padding: '2px 7px',
                  borderRadius: '999px',
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                }}
              >
                IA
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '2px' }}>
              <span
                style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  background: '#4ade80',
                  boxShadow: '0 0 0 2px rgba(74, 222, 128, 0.3)',
                  display: 'inline-block',
                }}
              />
              <span style={{ color: 'rgba(255,255,255,0.75)', fontSize: '12px', fontWeight: 400 }}>
                Asistente de Zoologic · En línea
              </span>
            </div>
          </div>
        </div>

        {/* Botón cerrar */}
        <button
          onClick={closeChat}
          aria-label="Cerrar chat"
          style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'rgba(255,255,255,0.12)',
            border: '1px solid rgba(255,255,255,0.15)',
            color: 'rgba(255,255,255,0.85)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 0.15s ease',
            flexShrink: 0,
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.22)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M11 3L3 11M3 3l8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      {/* ── ÁREA DE MENSAJES ── */}
      <div
        className="zl-messages-area"
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px 16px 12px',
          background: 'var(--zl-surface-2)',
          display: 'flex',
          flexDirection: 'column',
          gap: '2px',
          minHeight: '180px',
        }}
      >
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}

        {isLoading && <TypingIndicator />}

        <div ref={messagesEndRef} />
      </div>

      {/* ── INPUT ── */}
      <ChatInput />

      {/* ── FOOTER ── */}
      <div
        style={{
          textAlign: 'center',
          padding: '7px 16px 8px',
          background: 'var(--zl-surface)',
          borderTop: '1px solid var(--zl-border-soft)',
          fontSize: '11px',
          color: 'var(--zl-ink-4)',
          letterSpacing: '0.01em',
        }}
      >
        Powered by{' '}
        <span style={{ fontWeight: 600, color: 'var(--zl-ink-3)' }}>Zoologic</span>
      </div>
    </div>
  );
}
