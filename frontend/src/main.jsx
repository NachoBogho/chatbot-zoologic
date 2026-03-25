import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css';
import useChatStore from './store/chatStore';

let root = null;

/**
 * Inyecta Inter desde Google Fonts para tipografía premium.
 * Solo una vez, aunque se llame init() múltiples veces.
 */
function injectFont() {
  if (document.getElementById('zl-inter-font')) return;
  const link = document.createElement('link');
  link.id = 'zl-inter-font';
  link.rel = 'stylesheet';
  link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap';
  document.head.appendChild(link);
}

function mountWidget(containerId = 'zoologic-chatbot') {
  const container = document.getElementById(containerId);
  if (!container) {
    console.warn(`[ZoologicChatbot] No se encontró el elemento #${containerId}`);
    return;
  }
  if (root) return;

  root = ReactDOM.createRoot(container);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

/**
 * API pública del widget.
 * Expuesta como window.ZoologicChatbot en el bundle IIFE.
 *
 * Uso:
 *   <div id="zoologic-chatbot"></div>
 *   <script src="chatbot.iife.js"></script>
 *   <script>
 *     ZoologicChatbot.init({ apiUrl: 'https://tu-backend.com' });
 *   </script>
 */
const ZoologicChatbot = {
  init(options = {}) {
    const { apiUrl, containerId = 'zoologic-chatbot' } = options;

    injectFont();

    if (apiUrl) {
      useChatStore.getState().setApiUrl(apiUrl);
    }

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => mountWidget(containerId));
    } else {
      mountWidget(containerId);
    }
  },

  open:  () => useChatStore.getState().openChat(),
  close: () => useChatStore.getState().closeChat(),
};

if (typeof window !== 'undefined') {
  window.ZoologicChatbot = ZoologicChatbot;
}

// Auto-inicializar siempre (dev y producción).
// En modo IIFE (widget embebible) el usuario puede llamar init() de nuevo
// con su configuración; el mounting ya hecho es un no-op seguro.
injectFont();
ZoologicChatbot.init();

export default ZoologicChatbot;
