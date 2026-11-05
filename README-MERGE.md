# ViroFenix — versión integrada

Esta versión reúne las funciones de los dos proyectos recibidos y el sistema de reseñas:

- Tienda, autenticación, carrito, checkout y pedidos.
- Administración de usuarios, pedidos y stock.
- Chat/soporte y registro de historial de productos visitados.
- Reseñas con estrellas y comentarios, persistidas en MySQL.

## Instalación

1. Conservá las credenciales reales de `server/.env`; no las publiques ni las compartas.
2. En `server/`, ejecutá `npm install` y luego `npm run dev`.
3. En `client/`, ejecutá `npm install` y luego `npm run dev`.
4. Para habilitar reseñas, ejecutá `server/migrations/crear-tabla-resenas.sql` una sola vez en la base MySQL configurada.

Rutas administrativas añadidas: `/admin/pedidos`, `/admin/stock`, `/admin/usuarios` y `/admin/soporte`.
