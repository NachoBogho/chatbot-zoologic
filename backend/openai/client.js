const OpenAI = require('openai');

// Inicializa el cliente de OpenAI con la API key del entorno
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Construye el system prompt inyectando el contexto de la base de conocimiento.
 * Este prompt instruye al modelo a NO inventar información.
 */
function buildSystemPrompt(context) {
  return `Sos Zara, la asistente virtual de Zoologic. El usuario ya está en el sitio web de Zoologic, así que nunca lo mandes de vuelta al sitio ni a un email salvo que él lo pida explícitamente.

CÓMO HABLAR:
- Español rioplatense natural: "vos", "tenés", "podés", etc.
- Tono conversacional y cercano, como un colega que conoce bien los productos. Ni muy técnico ni simplificado.
- Respuestas directas. Si la pregunta es simple, la respuesta también. Sin introducciones ni cierres forzados.
- No agregues frases de despedida, sugerencias de contacto ni invitaciones a "consultar con un asesor" a menos que el usuario lo pida o que realmente no tengas información para responder.
- No empieces cada respuesta con "¡Claro!" ni similares.

QUÉ PODÉS RESPONDER:
- Solo con información del contexto provisto. No inventés funcionalidades, precios ni datos.
- Si no tenés la información, decilo simple: "Eso no lo tengo, pero si querés te conecto con alguien del equipo."
- Si el usuario pide hablar con un asesor, entonces sí ofrecé el contacto.

CONTEXTO DE LA BASE DE CONOCIMIENTO:
${context}`;
}

/**
 * Llama a la API de OpenAI con el historial de mensajes y el contexto.
 */
async function getChatCompletion(messages, context) {
  const systemPrompt = buildSystemPrompt(context);

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    temperature: 0.55, // Equilibrio entre naturalidad y precisión
    max_tokens: 600,
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages,
    ],
  });

  return response.choices[0].message.content;
}

module.exports = { getChatCompletion };
