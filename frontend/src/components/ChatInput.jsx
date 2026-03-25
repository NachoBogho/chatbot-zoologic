import { useState, useRef, useEffect } from 'react';
import useChatStore from '../store/chatStore';

/**
 * Input de texto con botón de envío.
 * Auto-expandible. Envío con Enter (Shift+Enter = nueva línea).
 */
export default function ChatInput() {
  const [input, setInput] = useState('');
  const { sendMessage, isLoading } = useChatStore();
  const textareaRef = useRef(null);

  // Auto-resize del textarea según el contenido
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, 120) + 'px';
  }, [input]);

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage(input);
    setInput('');
    // Reset altura
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const canSend = input.trim().length > 0 && !isLoading;

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: '10px',
        padding: '12px 14px',
        background: 'var(--zl-surface)',
        borderTop: '1px solid var(--zl-border-soft)',
      }}
    >
      <textarea
        ref={textareaRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Escribí tu pregunta..."
        disabled={isLoading}
        rows={1}
        style={{
          flex: 1,
          resize: 'none',
          border: '1.5px solid',
          borderColor: input ? 'var(--zl-blue)' : 'rgba(15, 23, 42, 0.12)',
          borderRadius: '12px',
          padding: '10px 14px',
          fontSize: '14px',
          lineHeight: '1.5',
          color: 'var(--zl-ink)',
          background: 'var(--zl-surface-2)',
          outline: 'none',
          fontFamily: 'var(--zl-font)',
          transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
          overflowY: 'hidden',
          maxHeight: '120px',
          boxShadow: input ? '0 0 0 3px rgba(26, 86, 219, 0.10)' : 'none',
          cursor: isLoading ? 'not-allowed' : 'text',
          opacity: isLoading ? 0.6 : 1,
        }}
        onFocus={(e) => {
          if (!isLoading) {
            e.target.style.borderColor = 'var(--zl-blue)';
            e.target.style.boxShadow = '0 0 0 3px rgba(26, 86, 219, 0.12)';
          }
        }}
        onBlur={(e) => {
          if (!input) {
            e.target.style.borderColor = 'rgba(15, 23, 42, 0.12)';
            e.target.style.boxShadow = 'none';
          }
        }}
      />

      {/* Botón enviar */}
      <button
        type="submit"
        disabled={!canSend}
        aria-label="Enviar mensaje"
        style={{
          flexShrink: 0,
          width: '40px',
          height: '40px',
          borderRadius: '10px',
          background: canSend ? 'var(--zl-gradient)' : 'rgba(15, 23, 42, 0.08)',
          border: 'none',
          cursor: canSend ? 'pointer' : 'not-allowed',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.15s ease',
          boxShadow: canSend ? '0 2px 8px rgba(26, 86, 219, 0.30)' : 'none',
          color: canSend ? '#fff' : 'rgba(15, 23, 42, 0.3)',
        }}
        onMouseEnter={(e) => {
          if (canSend) e.currentTarget.style.transform = 'scale(1.05)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
        }}
        onMouseDown={(e) => {
          if (canSend) e.currentTarget.style.transform = 'scale(0.95)';
        }}
        onMouseUp={(e) => {
          if (canSend) e.currentTarget.style.transform = 'scale(1.05)';
        }}
      >
        {/* Ícono avión de papel */}
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M2.25 9L15.75 2.25L9 15.75L7.5 10.5L2.25 9Z"
            fill="currentColor"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </form>
  );
}
