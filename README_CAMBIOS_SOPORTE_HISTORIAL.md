# Cambios ViroFenix: Soporte y productos visitados

Esta carpeta contiene los archivos nuevos/modificados basados en `ViroFenix(3).zip`.

## Qué se agregó

1. **Soporte humano en tiempo real**: botón flotante abajo a la derecha y pantalla de administrador `/admin/soporte`.
2. **Historial de productos**: al abrir el detalle de un producto, se guarda en el navegador. La página `/historial` muestra hasta 20 productos recientes.
3. **Sin cambios de base de datos**: no hace falta SQL. El historial usa `localStorage`; el chat activo vive en la memoria del servidor y se pierde al reiniciarlo.
4. **Permisos**: el servidor verifica el JWT y consulta que la cuenta sea Admin y Activo antes de permitir responder.

## Archivos nuevos

- `client/src/components/ChatWidget.jsx`
- `client/src/assets/css/chat-widget.css`
- `client/src/pages/AdminChat.jsx`
- `client/src/assets/css/admin-chat.css`
- `client/src/pages/Historial.jsx`
- `client/src/assets/css/historial.css`
- `server/chat/chatSocket.js`

## Archivos modificados

- `client/src/App.jsx`
- `client/src/components/Navbar.jsx`
- `client/src/pages/ProductoDetalle.jsx`
- `client/package.json` (socket.io-client)
- `server/package.json` (socket.io)
- `server/app.js`

## Instalar y ejecutar

Terminal del servidor:

```bash
cd server
npm install
npm run dev
```

Terminal del cliente:

```bash
cd client
npm install
npm run dev
```

Abrir `http://localhost:5173`. Para probar el chat con dos ventanas, abrir una ventana normal como cliente y otra ventana con una cuenta Admin e ir a `/admin/soporte`.

## Historial

Abrir cualquier producto desde la colección. Luego tocar `Historial` en la barra de navegación o abrir `http://localhost:5173/historial`. El historial está guardado solo en el navegador actual; no se comparte entre equipos y se puede borrar con el botón.

## Oral en español sencillo

**Soporte:** "Usamos Socket.IO para enviar mensajes en tiempo real. El cliente escribe un mensaje y el servidor lo envía al panel del administrador. El administrador responde y el cliente recibe la respuesta. No guardamos los chats en MySQL; se mantienen en la memoria del servidor mientras está encendido."

**Historial:** "Cuando se abre el detalle de un producto, guardamos sus datos en localStorage. La página Historial lee esos datos y muestra los últimos veinte productos visitados. No necesitamos crear una tabla nueva en MySQL."

## Nota

El chat está preparado para un único servidor local de desarrollo. Si el administrador cierra sesión o el servidor se reinicia, las conversaciones en memoria no quedan guardadas. El historial sí continúa en el navegador mientras no se borre su almacenamiento local.
