import { useState, useRef, useEffect } from 'react';
import useChatStore from '../store/chatStore';

export default function ChatInput() {
  const [input, setInput] = useState('');
  const [focused, setFocused] = useState(false);
  const { sendMessage, isLoading } = useChatStore();
  const textareaRef = useRef(null);

  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = 'auto';
    ta.style.height = Math.min(ta.scrollHeight, 110) + 'px';
  }, [input]);

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage(input);
    setInput('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const canSend = input.trim().length > 0 && !isLoading;

  const borderColor = focused
    ? 'var(--pt-orange)'
    : 'var(--pt-border-mid)';

  const boxShadow = focused
    ? '0 0 0 3px rgba(124, 58, 237, 0.12)'
    : 'none';

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: 'flex',
        alignItems: 'flex-end',
        gap: '8px',
        padding: '10px 12px',
        background: 'var(--pt-surface)',
        borderTop: '1px solid var(--pt-border-soft)',
      }}
    >
      <div
        style={{
          flex: 1,
          position: 'relative',
          display: 'flex',
          alignItems: 'flex-end',
        }}
      >
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Escribí tu pregunta..."
          disabled={isLoading}
          rows={1}
          style={{
            width: '100%',
            resize: 'none',
            border: `1.5px solid ${borderColor}`,
            borderRadius: '12px',
            padding: '10px 14px',
            fontSize: '14px',
            lineHeight: '1.5',
            color: 'var(--pt-ink)',
            background: focused ? 'var(--pt-surface)' : 'var(--pt-surface-2)',
            outline: 'none',
            fontFamily: 'var(--pt-font)',
            transition: 'border-color 0.15s ease, box-shadow 0.15s ease, background 0.15s ease',
            overflowY: 'hidden',
            maxHeight: '110px',
            boxShadow,
            cursor: isLoading ? 'not-allowed' : 'text',
            opacity: isLoading ? 0.55 : 1,
          }}
        />
      </div>

      {/* Botón enviar */}
      <button
        type="submit"
        disabled={!canSend}
        aria-label="Enviar mensaje"
        style={{
          flexShrink: 0,
          width: '38px',
          height: '38px',
          borderRadius: '10px',
          background: canSend ? 'var(--pt-gradient)' : 'rgba(28, 25, 23, 0.07)',
          border: 'none',
          cursor: canSend ? 'pointer' : 'not-allowed',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.15s ease',
          boxShadow: canSend ? '0 2px 10px rgba(124, 58, 237, 0.35)' : 'none',
          color: canSend ? '#fff' : 'rgba(28, 25, 23, 0.25)',
        }}
        onMouseEnter={(e) => {
          if (canSend) {
            e.currentTarget.style.transform = 'scale(1.06)';
            e.currentTarget.style.boxShadow = '0 3px 14px rgba(124, 58, 237, 0.50)';
          }
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = canSend ? '0 2px 10px rgba(124, 58, 237, 0.35)' : 'none';
        }}
        onMouseDown={(e) => { if (canSend) e.currentTarget.style.transform = 'scale(0.94)'; }}
        onMouseUp={(e)   => { if (canSend) e.currentTarget.style.transform = 'scale(1.06)'; }}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M1.5 8L14.5 2L8.5 14L7 9.5L1.5 8Z"
            fill="currentColor"
          />
        </svg>
      </button>
    </form>
  );
}
