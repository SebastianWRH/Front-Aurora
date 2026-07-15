# Aurora Frontend

Frontend React + Vite para el catalogo publico y el panel administrativo de Aurora. Consume la API del backend mediante `VITE_API_URL`; no se conecta directamente a Neon ni a Cloudinary.

## Arquitectura

- `src/lib/catalogApi.js`: cliente API centralizado.
- `src/hooks/`: hooks publicos de productos, categorias y configuracion.
- `src/Pages/Catalogo.jsx`, `src/Pages/Producto.jsx`, `src/Pages/Home.jsx`: experiencia publica.
- `src/Pages/Admin.jsx`: login, proteccion de rutas y administracion.
- `src/styles/Admin.css`: estilos del panel admin.

## Instalacion

```bash
npm install
cp .env.example .env
```

## Variables de entorno

```env
VITE_API_URL=http://localhost:3000
```

El frontend solo necesita la URL publica del backend. No coloques `DATABASE_URL`, `SESSION_SECRET`, secretos Cloudinary ni credenciales admin en variables `VITE_*`.

## Ejecucion local

Con el backend corriendo:

```bash
npm run dev
```

La app queda disponible normalmente en `http://localhost:5173`.

## Panel administrativo

Rutas:

```text
/admin
/admin/login
/admin/dashboard
/admin/productos
/admin/categorias
/admin/configuracion
```

Flujos disponibles:

- Login con cookie `HttpOnly` emitida por el backend.
- Consulta silenciosa de sesion en login con `GET /api/admin/auth/status`.
- Validacion de sesion con `GET /api/admin/auth/me`.
- Crear, editar y eliminar productos.
- Subir multiples imagenes de producto con `multipart/form-data`.
- Seleccionar imagen principal y retirar imagenes.
- Crear, editar y eliminar categorias.
- Subir imagen de categoria.
- Editar configuracion del catalogo.
- Cerrar sesion con `POST /api/admin/auth/logout`.

Las llamadas admin usan `credentials: "include"` para que el navegador envie la cookie. No se guarda token en `localStorage`.

## Build y lint

```bash
npm run lint
npm run build
```

Comandos usados para validar esta implementacion frontend:

```bash
npm run lint
npm run build
```

## Despliegue

Configura `VITE_API_URL` con la URL publica del backend desplegado. En el backend, agrega el dominio del frontend a `FRONTEND_URL` para CORS.
