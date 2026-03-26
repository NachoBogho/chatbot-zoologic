const fs = require('fs');
const path = require('path');

// Carga la base de conocimiento desde el JSON compartido
const knowledgePath = path.join(__dirname, '../../knowledge/knowledge.json');
const knowledge = JSON.parse(fs.readFileSync(knowledgePath, 'utf-8'));

/**
 * Busca contenido relevante en la base de conocimiento de Pantera Comercios
 * según las palabras clave del mensaje del usuario.
 */
function searchKnowledge(userMessage) {
  const msg = userMessage.toLowerCase();
  const results = [];

  // Info base: producto y empresa (siempre incluida)
  results.push(
    `## Pantera Comercios\n${knowledge.producto.descripcion}\n` +
    `Sitio: ${knowledge.producto.sitio_web} | App: ${knowledge.producto.app}\n` +
    `Desarrollado por ${knowledge.empresa.nombre} — ${knowledge.empresa.descripcion}`
  );

  // Propuesta de valor y modelo de precios
  const precioKw = ['precio', 'costo', 'cuánto', 'cuanto', 'pago', 'pagar', 'plan', 'abono', 'gratis', 'gratuito', 'free', 'vacacion', 'permanencia', 'contrato', 'barato', 'económico'];
  if (precioKw.some((kw) => msg.includes(kw))) {
    const ejemplos = knowledge.precios.ejemplos.map((e) =>
      `${e.tipo}: ${e.costo_aprox}${e.comprobantes ? ` (${e.comprobantes} comprobantes/mes)` : ''}`
    ).join('\n');
    results.push(
      `## Modelo de Precios\n${knowledge.precios.modelo}\n` +
      `Cotizador: ${knowledge.precios.cotizador}\n\n` +
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

  // Si el mensaje es muy corto o genérico, incluir propuesta de valor completa
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

module.exports = { searchKnowledge, knowledge };
