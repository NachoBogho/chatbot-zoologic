const express = require('express');
const router = express.Router();
const { getChatCompletion } = require('../openai/client');
const { searchKnowledge } = require('../knowledge/loader');

// Almacén simple de sesiones en memoria (reemplazar por Redis en producción)
const sessions = new Map();
const MAX_HISTORY = 10; // Máximo de mensajes por sesión

/**
 * POST /chat
 * Recibe el mensaje del usuario y devuelve la respuesta del asistente.
 */
router.post('/', async (req, res) => {
  const { message, sessionId } = req.body;

  // Validación básica
  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    return res.status(400).json({ error: 'El campo "message" es requerido y no puede estar vacío.' });
  }

  if (!sessionId || typeof sessionId !== 'string') {
    return res.status(400).json({ error: 'El campo "sessionId" es requerido.' });
  }

  // Obtener o crear historial de la sesión
  if (!sessions.has(sessionId)) {
    sessions.set(sessionId, []);
  }
  const history = sessions.get(sessionId);

  // Agregar mensaje del usuario al historial
  const userMessage = { role: 'user', content: message.trim() };
  history.push(userMessage);

  // Buscar contexto relevante en la base de conocimiento (RAG simple)
  const context = searchKnowledge(message);

  try {
    // Llamar a OpenAI con el historial (limitado para no exceder tokens)
    const recentHistory = history.slice(-MAX_HISTORY);
    const reply = await getChatCompletion(recentHistory, context);

    // Agregar respuesta al historial
    history.push({ role: 'assistant', content: reply });

    // Limpiar historial antiguo si crece demasiado
    if (history.length > MAX_HISTORY * 2) {
      history.splice(0, history.length - MAX_HISTORY * 2);
    }

    return res.json({ reply });
  } catch (error) {
    console.error('[Chat Error]', error?.message || error);

    // Manejo diferenciado de errores de OpenAI
    if (error?.status === 401) {
      return res.status(500).json({ error: 'Error de autenticación con el proveedor de IA. Verificá la API key.' });
    }
    if (error?.status === 429) {
      return res.status(429).json({ error: 'Límite de solicitudes alcanzado. Intentá en unos segundos.' });
    }

    return res.status(500).json({ error: 'Ocurrió un error al procesar tu mensaje. Intentá nuevamente.' });
  }
});

module.exports = router;
