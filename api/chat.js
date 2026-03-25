const { OpenAI } = require('openai');
const fs = require('fs');
const path = require('path');

// ── Base de conocimiento ──────────────────────────────────────────────────────
// Intentamos dos rutas posibles porque en Vercel el cwd puede variar
let knowledge;
try {
  const knowledgePath =
    path.join(__dirname, '../knowledge/knowledge.json');
  knowledge = JSON.parse(fs.readFileSync(knowledgePath, 'utf-8'));
} catch (e) {
  try {
    const knowledgePath = path.join(process.cwd(), 'knowledge/knowledge.json');
    knowledge = JSON.parse(fs.readFileSync(knowledgePath, 'utf-8'));
  } catch (e2) {
    console.error('[Knowledge] No se pudo cargar knowledge.json:', e2.message);
    knowledge = { empresa: { nombre: 'Zoologic', descripcion: '', contacto: { email: '', web: '' } }, productos: [], faq: [] };
  }
}

// ── Cliente OpenAI ────────────────────────────────────────────────────────────
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// ── Sesiones en memoria ───────────────────────────────────────────────────────
const sessions = new Map();
const MAX_HISTORY = 10;

// ── RAG simple ────────────────────────────────────────────────────────────────
function searchKnowledge(userMessage) {
  const msg = userMessage.toLowerCase();
  const results = [];

  results.push(
    `## Empresa\n${knowledge.empresa.nombre}: ${knowledge.empresa.descripcion}\n` +
    `Contacto: ${knowledge.empresa.contacto.email} | ${knowledge.empresa.contacto.web}`
  );

  const productKeywords = {
    pantera:    ['pantera', 'erp', 'gestión empresarial', 'inventario', 'finanzas', 'rrhh', 'producción', 'logística', 'manufactura'],
    lince:      ['lince', 'crm', 'ventas', 'clientes', 'leads', 'comercial', 'marketing', 'oportunidades', 'pipeline'],
    dragonfish: ['dragonfish', 'bi', 'business intelligence', 'analítica', 'dashboard', 'datos', 'reportes', 'kpi', 'métricas'],
  };

  for (const [productId, keywords] of Object.entries(productKeywords)) {
    const isRelevant = keywords.some((kw) => msg.includes(kw));
    if (isRelevant || msg.includes('producto') || msg.includes('sistema') || msg.includes('solución')) {
      const product = knowledge.productos.find((p) => p.id === productId);
      if (product) {
        results.push(
          `## Producto: ${product.nombre}\n` +
          `Categoría: ${product.categoria}\n` +
          `Descripción: ${product.descripcion}\n` +
          `Características: ${product.caracteristicas.join(', ')}\n` +
          `Casos de uso: ${product.casos_de_uso.join(', ')}\n` +
          `Precio: ${product.precio}`
        );
      }
    }
  }

  if (results.length === 1) {
    knowledge.productos.forEach((p) => {
      results.push(`## ${p.nombre}\n${p.descripcion}`);
    });
  }

  const faqTriggers = ['soporte', 'precio', 'costo', 'prueba', 'demo', 'implementación', 'nube', 'integración', 'capacitación', 'contacto', 'asesor', 'diferencia', '?', 'cómo', 'cuánto', 'cuál'];
  if (faqTriggers.some((kw) => msg.includes(kw))) {
    const relevantFaqs = knowledge.faq.filter((faq) => {
      const faqText = (faq.pregunta + ' ' + faq.respuesta).toLowerCase();
      return msg.split(' ').some((word) => word.length > 3 && faqText.includes(word));
    });
    const faqsToShow = relevantFaqs.length > 0 ? relevantFaqs : knowledge.faq;
    results.push(
      `## Preguntas Frecuentes\n` +
      faqsToShow.map((f) => `P: ${f.pregunta}\nR: ${f.respuesta}`).join('\n\n')
    );
  }

  return results.join('\n\n---\n\n');
}

// ── System prompt ─────────────────────────────────────────────────────────────
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

// ── Handler principal ─────────────────────────────────────────────────────────
module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });

  // Verificar API key antes de procesar
  if (!process.env.OPENAI_API_KEY) {
    console.error('[Config] OPENAI_API_KEY no está configurada en las variables de entorno de Vercel');
    return res.status(500).json({ error: 'El servicio no está configurado correctamente. Falta la API key.' });
  }

  const { message, sessionId } = req.body || {};

  if (!message || typeof message !== 'string' || !message.trim()) {
    return res.status(400).json({ error: 'El campo "message" es requerido.' });
  }
  if (!sessionId || typeof sessionId !== 'string') {
    return res.status(400).json({ error: 'El campo "sessionId" es requerido.' });
  }

  if (!sessions.has(sessionId)) sessions.set(sessionId, []);
  const history = sessions.get(sessionId);

  history.push({ role: 'user', content: message.trim() });

  const context = searchKnowledge(message);

  try {
    const recentHistory = history.slice(-MAX_HISTORY);
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.55,
      max_tokens: 600,
      messages: [
        { role: 'system', content: buildSystemPrompt(context) },
        ...recentHistory,
      ],
    });

    const reply = response.choices[0].message.content;
    history.push({ role: 'assistant', content: reply });

    if (history.length > MAX_HISTORY * 2) {
      history.splice(0, history.length - MAX_HISTORY * 2);
    }

    return res.json({ reply });
  } catch (error) {
    console.error('[OpenAI Error]', error?.status, error?.message);
    if (error?.status === 401) return res.status(500).json({ error: 'API key de OpenAI inválida o no configurada en Vercel.' });
    if (error?.status === 429) return res.status(429).json({ error: 'Límite de solicitudes alcanzado. Intentá en unos segundos.' });
    return res.status(500).json({ error: 'Error al procesar el mensaje. Intentá nuevamente.' });
  }
};
