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

  // Info base: producto y empresa (siempre incluida)
  results.push(
    `## Pantera Comercios\n${knowledge.producto.descripcion}\n` +
    `Sitio: ${knowledge.producto.sitio_web} | App: ${knowledge.producto.app}\n` +
    `Desarrollado por ${knowledge.empresa.nombre} — ${knowledge.empresa.descripcion}`
  );

  // Propuesta de valor y precios
  const precioKw = ['precio', 'costo', 'cuánto', 'cuanto', 'pago', 'pagar', 'plan', 'abono', 'gratis', 'gratuito', 'free', 'vacacion', 'permanencia', 'contrato', 'barato', 'económico'];
  if (precioKw.some((kw) => msg.includes(kw))) {
    const ejemplos = knowledge.precios.ejemplos.map((e) =>
      `${e.tipo}: ${e.costo_aprox}${e.comprobantes ? ` (${e.comprobantes} comprobantes/mes)` : ''}`
    ).join('\n');
    results.push(
      `## Modelo de Precios\n${knowledge.precios.modelo}\nCotizador: ${knowledge.precios.cotizador}\n\n` +
      `## Capa Gratuita\n${knowledge.capa_gratuita.descripcion}\nIncluye: ${knowledge.capa_gratuita.incluye.join(', ')}\n${knowledge.capa_gratuita.nota}\n\n` +
      `## Propuesta de Valor\n${knowledge.propuesta_valor.modelo}\n${knowledge.propuesta_valor.puntos.join('\n')}\n\n` +
      `## Ejemplos de Costos Mensuales\n${ejemplos}`
    );
  }

  // Funcionalidades
  const funcKw = ['función', 'funciona', 'feature', 'módulo', 'puede', 'permite', 'qué hace', 'sirve', 'herramienta', 'gestión'];
  const matchedFuncs = knowledge.funcionalidades.filter((f) =>
    f.keywords.some((kw) => msg.includes(kw)) || funcKw.some((kw) => msg.includes(kw))
  );
  if (matchedFuncs.length > 0) {
    const funcText = matchedFuncs.map((f) => `### ${f.nombre}\n${f.descripcion}`).join('\n\n');
    results.push(`## Funcionalidades\n${funcText}`);
  }

  // Integraciones
  const integKw = ['mercado libre', 'tiendanube', 'mercado pago', 'integra', 'sincroniza', 'ml ', ' ml', 'ecommerce', 'e-commerce', 'tienda online'];
  if (integKw.some((kw) => msg.includes(kw))) {
    const integText = knowledge.integraciones.map((i) => `### ${i.nombre}\n${i.descripcion}`).join('\n\n');
    results.push(`## Integraciones\n${integText}`);
  }

  // Registro / cómo empezar
  const registroKw = ['registr', 'empezar', 'comenzar', 'alta', 'crear cuenta', 'inicio', 'cómo entro', 'cómo accedo', 'tarjeta'];
  if (registroKw.some((kw) => msg.includes(kw))) {
    results.push(
      `## Cómo Registrarse\n${knowledge.registro.nota}\nURL: ${knowledge.registro.url}\n` +
      `Pasos:\n${knowledge.registro.pasos.map((p, i) => `${i + 1}. ${p}`).join('\n')}`
    );
  }

  // Soporte / ayuda / demo / capacitación
  const soporteKw = ['soporte', 'ayuda', 'demo', 'capacitación', 'tutorial', 'video', 'manual', 'aprend', 'campus', 'asesor', 'contacto'];
  if (soporteKw.some((kw) => msg.includes(kw))) {
    results.push(
      `## Soporte y Capacitación\nCanales: ${knowledge.soporte.canales.join(' | ')}\n` +
      `Capacitación: ${knowledge.soporte.capacitacion.join(' | ')}\n` +
      `Demo gratuita: ${knowledge.soporte.demo}`
    );
  }

  // Requerimientos técnicos
  const reqKw = ['celular', 'tablet', 'dispositivo', 'instalar', 'instalación', 'requisito', 'requerimiento', 'internet', 'nube', 'web', 'navegador'];
  if (reqKw.some((kw) => msg.includes(kw))) {
    results.push(`## Requerimientos Técnicos\n${knowledge.requerimientos}`);
  }

  // Mensaje genérico: incluir propuesta de valor
  const isGeneric = msg.split(' ').length <= 4 || ['qué es', 'que es', 'contame', 'info', 'información'].some((kw) => msg.includes(kw));
  if (isGeneric && results.length === 1) {
    results.push(
      `## Propuesta de Valor\n${knowledge.propuesta_valor.modelo}\n${knowledge.propuesta_valor.puntos.join('\n')}\n\n` +
      `## Capa Gratuita\n${knowledge.capa_gratuita.descripcion}\nIncluye: ${knowledge.capa_gratuita.incluye.join(', ')}`
    );
    const allFuncs = knowledge.funcionalidades.map((f) => f.nombre).join(', ');
    results.push(`## Módulos disponibles\n${allFuncs}`);
  }

  // FAQs relevantes
  const faqTriggers = ['?', 'cómo', 'cuánto', 'cuál', 'puedo', 'tiene', 'hay', 'existe'];
  if (faqTriggers.some((kw) => msg.includes(kw))) {
    const relevantFaqs = knowledge.faq.filter((faq) => {
      const faqText = (faq.pregunta + ' ' + faq.respuesta).toLowerCase();
      return msg.split(' ').some((word) => word.length > 3 && faqText.includes(word));
    });
    const faqsToShow = relevantFaqs.length > 0 ? relevantFaqs : knowledge.faq.slice(0, 5);
    results.push(
      `## Preguntas Frecuentes\n` +
      faqsToShow.map((f) => `P: ${f.pregunta}\nR: ${f.respuesta}`).join('\n\n')
    );
  }

  return results.join('\n\n---\n\n');
}

// ── System prompt ─────────────────────────────────────────────────────────────
function buildSystemPrompt(context) {
  return `Sos el asistente virtual de Pantera Comercios, el sistema de gestión para comercios de Zoo Logic. Tu objetivo es ayudar al usuario a entender el producto y convencerlo de que Pantera es la mejor solución para su negocio.

CÓMO HABLAR:
- Español rioplatense natural: "vos", "tenés", "podés", etc.
- Tono cálido, entusiasta y vendedor — pero sin ser exagerado ni forzado.
- Respuestas concretas y directas a lo que pregunta el usuario. Si la respuesta es corta, que sea corta.
- Resaltá los beneficios reales: sin permanencia, pagás lo que usás, gratis para empezar, fácil de usar.
- Usá emojis ocasionalmente (no en cada mensaje) para darle calidez, pero sin abusar.
- No empieces cada respuesta con "¡Claro!" ni similares. Variá la forma de arrancar.
- No agregues despedidas, cierres forzados ni invitaciones a "consultar con un asesor" salvo que el usuario lo pida o que genuinamente no tengas la info.

REGLAS DE CONTENIDO:
- Respondé solo con información del contexto provisto. No inventés funcionalidades, precios ni datos.
- Si no tenés la información, decilo simple: "Eso no lo tengo — podés consultarlo directamente en pantera.com.ar o pedir una demo."
- Cuando sea relevante, mencioná que pueden registrarse gratis sin tarjeta en https://app.pantera.com.ar/account/register-tenant
- Si el usuario muestra interés en probar o comprar, incentivalo a registrarse o pedir la demo sin presionar.

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
