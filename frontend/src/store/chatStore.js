import { create } from 'zustand';

const generateSessionId = () =>
  `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

const useChatStore = create((set, get) => ({
  isOpen: false,
  sessionId: generateSessionId(),

  messages: [
    {
      id: 'welcome',
      role: 'assistant',
      content: '¡Hola! Soy el asistente virtual de **Pantera Comercios**. Estoy acá para ayudarte a conocer el sistema y ver si es lo que tu negocio necesita. ¿En qué te puedo ayudar?',
      timestamp: new Date(),
    },
  ],

  // true hasta que el usuario manda su primer mensaje
  showQuickReplies: true,

  isLoading: false,
  apiUrl: '/api',

  toggleChat: () => set((state) => ({ isOpen: !state.isOpen })),
  openChat:   () => set({ isOpen: true }),
  closeChat:  () => set({ isOpen: false }),

  setApiUrl: (url) => set({ apiUrl: url }),

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

  sendMessage: async (content) => {
    if (!content.trim() || get().isLoading) return;

    const { apiUrl, sessionId, addMessage } = get();

    addMessage('user', content.trim());
    set({ isLoading: true, showQuickReplies: false });

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
      addMessage('assistant', 'Hubo un error al conectar. Por favor, intentá nuevamente en unos segundos.');
    } finally {
      set({ isLoading: false });
    }
  },
}));

export default useChatStore;
