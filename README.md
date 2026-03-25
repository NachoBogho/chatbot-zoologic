# Zoologic Chatbot

Widget de chatbot embebible para Zoologic. Responde preguntas sobre Pantera, Lince y Dragonfish usando IA (OpenAI) y una base de conocimiento propia.

---

## Estructura

```
zoologic-chatbot/
├── backend/          # API Node.js + Express
│   ├── knowledge/    # Loader del RAG
│   ├── openai/       # Cliente OpenAI
│   ├── routes/       # Endpoints
│   ├── server.js
│   └── package.json
├── frontend/         # Widget React + Vite
│   ├── src/
│   │   ├── components/
│   │   ├── store/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── vite.config.js
│   └── package.json
├── knowledge/        # Base de conocimiento JSON
│   └── knowledge.json
└── example/          # HTML de ejemplo de uso
    └── index.html
```

---

## Instalación y uso

### 1. Configurar el backend

```bash
cd backend
npm install

# Copiar y editar el archivo de variables de entorno
cp .env.example .env
# Editar .env y agregar tu OPENAI_API_KEY
```

Contenido del `.env`:
```
OPENAI_API_KEY=sk-...tu_clave...
PORT=3001
FRONTEND_URL=http://localhost:5173
```

### 2. Correr el backend

```bash
# Producción
npm start

# Desarrollo (con hot reload)
npm run dev
```

El servidor queda en: `http://localhost:3001`

Verificar que funciona:
```bash
curl http://localhost:3001/health
```

---

### 3. Configurar el frontend

```bash
cd frontend
npm install
```

### 4. Desarrollo del frontend

```bash
npm run dev
```

Abre `http://localhost:5173` para ver el widget en modo desarrollo.

---

### 5. Build del widget embebible

```bash
cd frontend
npm run build
```

Genera `frontend/dist/chatbot.iife.js` — un único archivo JS listo para embeber.

---

## Uso del widget en producción

### Opción A: Básica

```html
<div id="zoologic-chatbot"></div>
<script src="/ruta/a/chatbot.iife.js"></script>
<script>
  ZoologicChatbot.init({
    apiUrl: 'https://tu-backend.com'
  });
</script>
```

### Opción B: Con configuración completa

```html
<div id="mi-chatbot"></div>
<script src="/ruta/a/chatbot.iife.js"></script>
<script>
  ZoologicChatbot.init({
    apiUrl: 'https://api.zoologic.com.ar',
    containerId: 'mi-chatbot',
    theme: 'light'
  });
</script>
```

### Control programático

```js
ZoologicChatbot.open();   // Abrir el chat
ZoologicChatbot.close();  // Cerrar el chat
```

---

## API del backend

### `POST /chat`

**Request:**
```json
{
  "message": "¿Qué es Pantera?",
  "sessionId": "session_abc123"
}
```

**Response:**
```json
{
  "reply": "Pantera es el sistema ERP de Zoologic..."
}
```

**Errores:**
```json
{ "error": "Descripción del error" }
```

### `GET /health`

Devuelve estado del servidor:
```json
{ "status": "ok", "timestamp": "2024-01-01T00:00:00.000Z" }
```

---

## Base de conocimiento

El archivo `knowledge/knowledge.json` contiene toda la información que el chatbot puede usar.

Para agregar contenido nuevo:
1. Editar `knowledge/knowledge.json`
2. Reiniciar el backend (el archivo se carga al inicio)

Estructura del JSON:
```json
{
  "empresa": { ... },
  "productos": [ { "id", "nombre", "descripcion", "caracteristicas", ... } ],
  "faq": [ { "pregunta", "respuesta" } ]
}
```

El sistema RAG busca automáticamente las secciones más relevantes según el mensaje del usuario.

---

## Variables de entorno

| Variable | Descripción | Default |
|---|---|---|
| `OPENAI_API_KEY` | API Key de OpenAI | — (requerida) |
| `PORT` | Puerto del servidor | `3001` |
| `FRONTEND_URL` | URL del frontend para CORS | `http://localhost:5173` |

---

## Despliegue en producción

### Backend (Railway / Render / VPS)
1. Subir la carpeta `backend/` y `knowledge/`
2. Configurar la variable `OPENAI_API_KEY` en el proveedor
3. Configurar `FRONTEND_URL` con el dominio del sitio

### Frontend (Widget)
1. Correr `npm run build` en `frontend/`
2. Subir `frontend/dist/chatbot.iife.js` a un CDN o servidor estático
3. Referenciarlo con `<script src="...">` en el sitio

---

## Tecnologías

- **Frontend:** React 18, Vite, TailwindCSS, Zustand
- **Backend:** Node.js, Express, OpenAI SDK
- **IA:** GPT-4o-mini (OpenAI)
- **RAG:** Búsqueda por keywords sobre JSON local
