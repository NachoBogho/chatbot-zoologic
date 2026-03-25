const fs = require('fs');
const path = require('path');

// Carga la base de conocimiento desde el JSON compartido
const knowledgePath = path.join(__dirname, '../../knowledge/knowledge.json');
const knowledge = JSON.parse(fs.readFileSync(knowledgePath, 'utf-8'));

/**
 * Busca contenido relevante en la base de conocimiento
 * según las palabras clave del mensaje del usuario.
 *
 * Implementación simple de RAG sin vector DB:
 * - Tokeniza el mensaje del usuario
 * - Busca coincidencias en productos y FAQ
 * - Retorna los fragmentos más relevantes
 */
function searchKnowledge(userMessage) {
  const msg = userMessage.toLowerCase();
  const results = [];

  // Siempre incluir info de la empresa
  results.push(`## Empresa\n${knowledge.empresa.nombre}: ${knowledge.empresa.descripcion}\nContacto: ${knowledge.empresa.contacto.email} | ${knowledge.empresa.contacto.web}`);

  // Palabras clave por producto
  const productKeywords = {
    pantera: ['pantera', 'erp', 'gestión empresarial', 'inventario', 'finanzas', 'rrhh', 'producción', 'logística', 'manufactura'],
    lince: ['lince', 'crm', 'ventas', 'clientes', 'leads', 'comercial', 'marketing', 'oportunidades', 'pipeline'],
    dragonfish: ['dragonfish', 'bi', 'business intelligence', 'analítica', 'dashboard', 'datos', 'reportes', 'kpi', 'métricas'],
  };

  // Verificar qué productos son relevantes
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

  // Si no encontró ningún producto específico, incluir todos (resumen)
  if (results.length === 1) {
    knowledge.productos.forEach((p) => {
      results.push(`## ${p.nombre}\n${p.descripcion}`);
    });
  }

  // Buscar FAQs relevantes
  const faqKeywords = ['soporte', 'precio', 'costo', 'prueba', 'demo', 'implementación', 'nube', 'integración', 'capacitación', 'contacto', 'asesor', 'diferencia'];
  const isFaqQuery = faqKeywords.some((kw) => msg.includes(kw));

  if (isFaqQuery || msg.includes('?') || msg.includes('cómo') || msg.includes('cuánto') || msg.includes('cuál')) {
    const relevantFaqs = knowledge.faq.filter((faq) => {
      const faqText = (faq.pregunta + ' ' + faq.respuesta).toLowerCase();
      return msg.split(' ').some((word) => word.length > 3 && faqText.includes(word));
    });

    // Si no hay FAQs específicas, incluir todas
    const faqsToInclude = relevantFaqs.length > 0 ? relevantFaqs : knowledge.faq;
    const faqSection = faqsToInclude.map((f) => `P: ${f.pregunta}\nR: ${f.respuesta}`).join('\n\n');
    results.push(`## Preguntas Frecuentes\n${faqSection}`);
  }

  return results.join('\n\n---\n\n');
}

module.exports = { searchKnowledge, knowledge };
