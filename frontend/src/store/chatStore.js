import { create } from 'zustand';

// Genera un ID de sesión único por visita del usuario
const generateSessionId = () =>
  `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

/**
 * Store global del chatbot usando Zustand.
 * Maneja: apertura/cierre, historial de mensajes, estado de carga.
 */
const useChatStore = create((set, get) => ({
  // Estado UI
  isOpen: false,

  // Identificador único de sesión para el backend
  sessionId: generateSessionId(),

  // Historial de mensajes: { id, role: 'user' | 'assistant', content, timestamp }
  messages: [
    {
      id: 'welcome',
      role: 'assistant',
      content: '¡Hola! Soy Zara, tu asistente virtual de Zoologic. ¿En qué puedo ayudarte hoy?',
      timestamp: new Date(),
    },
  ],

  // Indica si el bot está esperando respuesta
  isLoading: false,

  // URL de la API. En dev usa el proxy de Vite (/api → localhost:3001).
  // En producción (Vercel) llama a /api directamente (mismo dominio).
  apiUrl: '/api',

  // === Acciones ===

  toggleChat: () => set((state) => ({ isOpen: !state.isOpen })),
  openChat: () => set({ isOpen: true }),
  closeChat: () => set({ isOpen: false }),

  setApiUrl: (url) => set({ apiUrl: url }),

  // Agrega un mensaje al historial
  addMessage: (role, content) => {
    const message = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      role,
      content,
      timestamp: new Date(),
    };
    set((state) => ({ messages: [...state.messages, message] }));
    return message;
  },

  // Envía el mensaje del usuario al backend y procesa la respuesta
  sendMessage: async (content) => {
    if (!content.trim() || get().isLoading) return;

    const { apiUrl, sessionId, addMessage } = get();

    // Agregar mensaje del usuario inmediatamente
    addMessage('user', content.trim());
    set({ isLoading: true });

    try {
      const response = await fetch(`${apiUrl}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: content.trim(), sessionId }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Error ${response.status}`);
      }

      const data = await response.json();
      addMessage('assistant', data.reply);
    } catch (error) {
      console.error('[Chatbot Error]', error);
      addMessage('assistant', 'Hubo un error al conectar con el servidor. Por favor, intentá nuevamente en unos segundos.');
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useChatStore;
