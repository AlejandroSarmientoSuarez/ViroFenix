# ViroFenix — proyecto integrado del grupo

Esta carpeta conserva los archivos de las dos versiones recibidas y añade las reseñas con base de datos. Se mantienen también las funciones de soporte, historial, administración, pedidos, stock, carrito y autenticación.

## Cómo iniciar

1. Abrí una terminal en `server` y ejecutá `npm install` y después `npm run dev`.
2. En otra terminal, entrá en `client` y ejecutá `npm install` y después `npm run dev`.
3. Revisá `server/.env` para que los datos de MySQL coincidan con tu computadora.
4. En phpMyAdmin/MySQL, seleccioná la base indicada por `DB_NAME` y ejecutá una sola vez `server/migrations/crear-tabla-resenas.sql`.
5. Abrí la dirección que muestra Vite, normalmente `http://localhost:5173`.

## Cómo funciona el sistema de reseñas

- El frontend de `client/src/pages/ProductoDetalle.jsx` muestra las estrellas, el formulario y las opiniones.
- `client/src/services/resenaService.js` envía las peticiones HTTP al servidor.
- `server/routes/resenaRoutes.js` define las rutas `GET /api/resenas/:productoId` y `POST /api/resenas/:productoId`.
- `server/controllers/resenaController.js` valida el producto, la puntuación y el comentario, y calcula el promedio.
- `server/models/Resena.js` define la tabla MySQL `resenas`.
- El SQL para crear esa tabla está en `server/migrations/crear-tabla-resenas.sql`.
- Solo una sesión iniciada puede publicar y cada cliente puede publicar una reseña por producto. El servidor vuelve a validar los datos; no depende solo del formulario.

## Cómo funciona Soporte

- El botón flotante está en `client/src/components/ChatWidget.jsx`.
- El panel de administración está en `client/src/pages/AdminChat.jsx`, en la ruta `/admin/soporte`.
- `server/chat/chatSocket.js` usa Socket.IO: el cliente manda un evento `cliente:mensaje`; el servidor lo comparte con el panel admin. El admin responde con `admin:responder`, y el servidor entrega la respuesta al chat del cliente.
- El servidor comprueba el token y el rol de administrador para permitir el panel y responder.

**Importante:** las conversaciones de Soporte actuales se guardan en la memoria del servidor, no en MySQL; al reiniciar el servidor se pierden. Las reseñas sí se guardan en MySQL. Si el profesor pregunta por la base de datos, explicá esta diferencia.

## Distribución responsive de reseñas

En pantallas grandes, la imagen del producto queda a la izquierda y los datos/reseñas a la derecha. En pantallas pequeñas, la imagen aparece arriba y el contenido a continuación. El tamaño de las estrellas se controla en `client/src/assets/css/producto-detalle.css`.

## Antes de subir a GitHub

No subas contraseñas ni secretos. Revisá `.gitignore` y evitá publicar `server/.env`; cada integrante debe usar sus propias credenciales locales. No se incluyó `.git` ni `node_modules` en este ZIP para reducir el tamaño. GitHub debe contener el código fuente, no las dependencias instaladas.
