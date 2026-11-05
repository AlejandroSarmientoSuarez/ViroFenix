# ViroFenix — Sistema de reseñas

Se añadió un sistema de reseñas integrado con MySQL en la ficha de cada producto.

## Funcionalidades
- Calificación de 1 a 5 estrellas y comentarios.
- Listado de reseñas con nombre del cliente y fecha.
- Promedio general y cantidad de reseñas por producto.
- Solo clientes con sesión iniciada pueden publicar.
- Una reseña por cliente y producto.
- Validación de calificación y longitud del comentario en el servidor.
- Persistencia en la tabla MySQL `resenas`.

## Activar la tabla en MySQL
1. Abrí phpMyAdmin o tu cliente MySQL y seleccioná la base de datos `2t` (o la base configurada en `server/.env`).
2. Ejecutá el archivo `server/migrations/crear-tabla-resenas.sql`.
3. Conservá tu archivo `server/.env` con las credenciales que ya usás en tu entorno. No se necesitan nuevas variables.

## Iniciar el proyecto
En una terminal:
```bash
cd server
npm install
npm run dev
```
En otra terminal:
```bash
cd client
npm install
npm run dev
```

El frontend sigue usando `http://localhost:4000` para la API, igual que el proyecto original.

## API añadida
- `GET /api/resenas/:productoId` — lista las reseñas y el promedio.
- `POST /api/resenas/:productoId` — crea una reseña; requiere `Authorization: Bearer <token>`.

La compilación del frontend no se pudo verificar en este entorno porque las dependencias nativas opcionales de Vite/Rolldown incluidas en el ZIP original no funcionan en Linux. Los archivos del servidor pasaron la comprobación de sintaxis de Node.js.
