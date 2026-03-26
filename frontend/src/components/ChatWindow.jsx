import { useEffect, useRef } from 'react';
import useChatStore from '../store/chatStore';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import TypingIndicator from './TypingIndicator';

const QUICK_REPLIES = [
  { label: '¿Cuánto cuesta?',            icon: '💰' },
  { label: '¿Qué funcionalidades tiene?', icon: '⚙️' },
  { label: '¿Cómo me registro?',          icon: '🚀' },
  { label: '¿Se integra con Mercado Libre?', icon: '🛒' },
];

export default function ChatWindow() {
  const { messages, isLoading, closeChat, showQuickReplies, sendMessage } = useChatStore();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div
      style={{
        width: '390px',
        maxHeight: '600px',
        background: 'var(--pt-surface)',
        borderRadius: 'var(--pt-radius-xl)',
        boxShadow: 'var(--pt-shadow-lg)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        border: '1px solid var(--pt-border-soft)',
        animation: 'ptSlideUp 0.30s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {/* ── HEADER oscuro de autoridad ── */}
      <div
        style={{
          background: 'var(--pt-gradient-dark)',
          padding: '14px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '11px' }}>
          {/* Logo mark */}
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'var(--pt-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              boxShadow: '0 2px 10px rgba(124, 58, 237, 0.40)',
            }}
          >
            <PanteraIcon />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
              <span
                style={{
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '15px',
                  letterSpacing: '-0.02em',
                  lineHeight: 1,
                }}
              >
                Pantera Comercios
              </span>
              <span
                style={{
                  background: 'rgba(124, 58, 237, 0.20)',
                  color: 'var(--pt-orange-light)',
                  fontSize: '9.5px',
                  fontWeight: 700,
                  padding: '2px 6px',
                  borderRadius: '999px',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  border: '1px solid rgba(124, 58, 237, 0.25)',
                }}
              >
                IA
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '4px' }}>
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: '#4ade80',
                  boxShadow: '0 0 0 2.5px rgba(74, 222, 128, 0.28)',
                  display: 'inline-block',
                  animation: 'ptBlink 2.5s ease-in-out infinite',
                }}
              />
              <span style={{ color: 'rgba(255,255,255,0.55)', fontSize: '12px', fontWeight: 400 }}>
                Asistente virtual · En línea
              </span>
            </div>
          </div>
        </div>

        {/* Botón cerrar */}
        <button
          onClick={closeChat}
          aria-label="Cerrar chat"
          style={{
            width: '30px',
            height: '30px',
            borderRadius: '8px',
            background: 'rgba(255,255,255,0.07)',
            border: '1px solid rgba(255,255,255,0.10)',
            color: 'rgba(255,255,255,0.60)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 0.15s, color 0.15s',
            flexShrink: 0,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.14)';
            e.currentTarget.style.color = 'rgba(255,255,255,0.90)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255,255,255,0.07)';
            e.currentTarget.style.color = 'rgba(255,255,255,0.60)';
          }}
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M10.5 2.5L2.5 10.5M2.5 2.5l8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      {/* ── ÁREA DE MENSAJES ── */}
      <div
        className="pt-messages-area"
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '18px 14px 10px',
          background: 'var(--pt-surface-2)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0px',
          minHeight: '200px',
        }}
      >
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}

        {/* Quick reply chips — solo al inicio */}
        {showQuickReplies && !isLoading && (
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '7px',
              marginTop: '4px',
              marginBottom: '8px',
              paddingLeft: '38px',
            }}
          >
            {QUICK_REPLIES.map((qr, i) => (
              <QuickReplyChip
                key={qr.label}
                label={qr.label}
                icon={qr.icon}
                delay={i * 0.07}
                onClick={() => sendMessage(qr.label)}
              />
            ))}
          </div>
        )}

        {isLoading && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* ── INPUT ── */}
      <ChatInput />

      {/* ── FOOTER ── */}
      <div
        style={{
          textAlign: 'center',
          padding: '6px 16px 8px',
          background: 'var(--pt-surface)',
          borderTop: '1px solid var(--pt-border-soft)',
          fontSize: '11px',
          color: 'var(--pt-ink-4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '5px',
        }}
      >
        <span>Potenciado por</span>
        <span style={{ fontWeight: 600, color: 'var(--pt-ink-3)' }}>Zoo Logic</span>
        <span style={{ color: 'var(--pt-ink-5)', fontSize: '10px' }}>·</span>
        <a
          href="https://www.pantera.com.ar"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'var(--pt-orange)', fontWeight: 500, textDecoration: 'none', fontSize: '11px' }}
        >
          pantera.com.ar
        </a>
      </div>
    </div>
  );
}

function QuickReplyChip({ label, icon, delay, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        padding: '7px 12px',
        borderRadius: 'var(--pt-radius-full)',
        border: '1.5px solid var(--pt-border)',
        background: 'var(--pt-surface)',
        color: 'var(--pt-ink-2)',
        fontSize: '12.5px',
        fontWeight: 500,
        cursor: 'pointer',
        transition: 'all 0.15s ease',
        animation: `ptChipIn 0.25s ease-out ${delay}s both`,
        fontFamily: 'var(--pt-font)',
        lineHeight: 1,
        boxShadow: 'var(--pt-shadow-sm)',
        whiteSpace: 'nowrap',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'var(--pt-orange-muted)';
        e.currentTarget.style.borderColor = 'var(--pt-orange)';
        e.currentTarget.style.color = 'var(--pt-orange-dark)';
        e.currentTarget.style.transform = 'translateY(-1px)';
        e.currentTarget.style.boxShadow = '0 3px 10px rgba(124, 58, 237, 0.18)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'var(--pt-surface)';
        e.currentTarget.style.borderColor = 'var(--pt-border)';
        e.currentTarget.style.color = 'var(--pt-ink-2)';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = 'var(--pt-shadow-sm)';
      }}
      onMouseDown={(e) => { e.currentTarget.style.transform = 'translateY(0) scale(0.97)'; }}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </button>
  );
}

function PanteraIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path
        d="M11 2C6.03 2 2 5.58 2 10c0 2.54 1.26 4.82 3.25 6.35L4.5 20l4-1.75A9.8 9.8 0 0011 18.5c4.97 0 9-3.58 9-8S15.97 2 11 2z"
        fill="white"
        opacity="0.95"
      />
      <path
        d="M7.5 10.5C7.5 9.12 8.62 8 10 8s2.5 1.12 2.5 2.5c0 .83-.4 1.57-1.01 2.03L12 14H10l-.5-1.5C8.62 12.17 7.5 11.42 7.5 10.5z"
        fill="var(--pt-orange)"
      />
      <circle cx="14.5" cy="9.5" r="1" fill="var(--pt-orange)" opacity="0.7" />
    </svg>
  );
}
