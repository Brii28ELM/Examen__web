# Evaluación Parcial 1 · API de Reservas de Canchas Deportivas

**Asignatura:** Desarrollo Web Avanzado  
**Estudiante:** Brithany Lopez  
**ID ESPE:** L00083773  
**Variante:** Dígito 3  
- **Canchas:** Vóley 2 · Básquet 2  
- **Fecha:** 2026-11-13  
- **Horarios:** 08:00 a 10:00 y 10:00 a 12:00 (UTC)  
- **Puerto local:** 3073  

---

## 🚀 Comandos para Levantar el Proyecto

### 1. Variables de entorno
Crea tu archivo `.env` basado en `.env-example`:
```bash
cp .env-example .env
```
Asegúrate de configurar los valores:
```env
PORT=3073
NODE_ENV=development
JWT_SECRET=secreto_examen_p1_espe_2026
DATABASE_URL="postgresql://espe_user:espe_password@localhost:5432/espe_db?schema=public"
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Levantar base de datos con Docker
```bash
docker compose up -d
```

### 4. Ejecutar migración y generar cliente Prisma
```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 5. Ejecutar seed (Población inicial de datos)
```bash
npx prisma db seed
```
> **Credenciales del seed:**
> - **Administrador:** `paulo.galarza@example.com` / `admin123`
> - **Usuario (Variante):** `belopez6@espe.edu.ec` / `user123`

### 6. Iniciar el servidor
Modo desarrollo:
```bash
npm run dev
```
Modo producción:
```bash
npm start
```
Servidor disponible en: `http://localhost:3073`

---

## 📋 Tabla de Endpoints

| Método | Endpoint | Rol requerido | Body / Parámetros | Respuestas |
|---|---|---|---|---|
| `GET` | `/` | Público | Ninguno | `200` ("Hello World") |
| `POST` | `/api/auth/register` | Público | `{ name, email, password }` | `201` { message }, `400` (Faltan campos / Email inválido / Ya registrado) |
| `POST` | `/api/auth/login` | Público | `{ email, password }` | `200` { token }, `400` ("Invalid email or password") |
| `GET` | `/api/auth/protected-route` | Autenticado (`token`) | Ninguno | `200`, `401` (Sin token), `403` (Token inválido) |
| `POST` | `/api/admin/schedules` | `ADMIN` | `{ court, startTime, endTime }` | `201` Horario creado, `400` (Faltan campos), `401` (Sin token), `403` (No es ADMIN) |
| `GET` | `/api/admin/bookings` | `ADMIN` | Ninguno | `200` Lista con user y schedule (`include`), `401`, `403` |
| `POST` | `/api/bookings` | Autenticado (`token`) | `{ date, scheduleId }` | `201` Reserva creada, `400` ("El horario ya está ocupado" o faltan campos), `401` |
| `GET` | `/api/bookings/:id` | Dueño o `ADMIN` | Ninguno | `200` Detalle reserva, `401`, `403` (No es dueño ni ADMIN), `404` (No existe) |
| `PUT` | `/api/bookings/:id` | Dueño o `ADMIN` | `{ date, scheduleId }` | `200` Reserva actualizada, `400` (Horario ocupado), `401`, `403`, `404` |
| `DELETE` | `/api/bookings/:id` | Dueño o `ADMIN` | Ninguno | `204` No Content, `401`, `403`, `404` |
| `GET` | `/api/users/:id/bookings` | Dueño o `ADMIN` | Ninguno | `200` Reservas del usuario con schedule (`include`), `401`, `403` (:id no corresponde) |

---

## 📮 Pruebas con Postman

1. Importa el archivo de colección: `postman/EVAL_P1_Lopez.postman_collection.json`.
2. Importa el entorno: `postman/EVAL_P1_local.postman_environment.json`.
3. Selecciona el entorno `EVAL_P1_local` en Postman.
4. Ejecuta primero la petición de **Login** con el usuario o administrador para que el token se asigne automáticamente a las variables `token` y `adminToken`.

---

## ☁️ Despliegue en Render

1. En Render: Crear **PostgreSQL** (Free). Copiar la **External Database URL** y añadir al final `?sslmode=require`.
2. Desde la máquina local con esa URL en `DATABASE_URL`:
   ```bash
   npx prisma migrate deploy
   npx prisma db seed
   ```
3. En Render: Crear **Web Service** vinculado al repositorio de GitHub:
   - **Runtime:** `Node`
   - **Build Command:** `npm install --include=dev && npx prisma generate`
   - **Start Command:** `npm start`
   - **Instance Type:** `Free`
4. Variables de entorno en Render:
   - `DATABASE_URL`: Internal Database URL de Render
   - `JWT_SECRET`: Llave secreta para producción
   - `NODE_ENV`: `production`
