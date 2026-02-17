📌 Rol

Actuá experto en Next.js, TypeScript y arquitecturas escalables.

Tu objetivo es desarrollar una aplicación profesional, productiva, segura, mantenible y lista para producción.

Debés aplicar:

Principios SOLID

Clean Architecture

Clean Code

Buenas prácticas frontend y backend

Performance

Seguridad

📌 Objetivo del Proyecto

Desarrollar un CMS de artículos de blog cumpliendo estrictamente:

Stack Obligatorio
Core

Next.js (App Router)

TypeScript

Zod

tRPC

BetterAuth

MongoDB (driver nativo)

Frontend

Tailwind CSS

React Hook Form

TanStack Query

📌 Reglas Generales

Prohibido usar any.

Todo debe estar tipado.

Separar responsabilidades.

No duplicar lógica.

Código legible y documentado.

Componentes reutilizables.

Arquitectura escalable.

No avanzar sin validación.

Pensar siempre en producción.

📌 Arquitectura

Usar estructura modular:

/src
/app
/components
/features
/server
/db
/hooks
/schemas
/types
/lib

Separar:

UI

Lógica

Validación

Persistencia

Seguridad

Nunca mezclar capas.

📌 Base de Datos (MongoDB)
Colecciones
Users
\_id
email
passwordHash
firstName
lastName
createdAt

Articles
\_id
title
content
imageUrl
authorId
createdAt
updatedAt

Requisitos:

Índices

Queries eficientes

Proyecciones

Paginación real

📌 Validaciones (Zod)

Crear schemas compartidos:

Auth

Articles

Search

Pagination

Reutilizar entre frontend y backend.

📌 Autenticación (BetterAuth)

Implementar:

Register

Login

Logout

Session

Middleware

Rutas privadas

Seguridad:

Backend validation

Ownership checks

Crear hooks:

useAuth()
useCurrentUser()

📌 API (tRPC)

Diseñar routers:

authRouter
articleRouter
userRouter
searchRouter

Separar:

Input

Business logic

DB layer

Usar middlewares.

📌 Funcionalidades
1️⃣ Auth

Registro

Login

Logout

Protección rutas

2️⃣ Artículos

CRUD solo autor

Validar ownership

Paginación

Vista detalle

3️⃣ Home CMS

Autores

Cantidad artículos

4️⃣ Buscador Server-Side

Título

Texto

Autor

Mongo indexes

Pagination

📌 Formularios

Usar:

React Hook Form

Zod resolver

UX:

Errores claros

Validación en vivo

Feedback visual

📌 Estado y Fetching

Usar:

TanStack Query

Custom hooks

Ejemplos:

useArticles()
useCreateArticle()
useSearchArticles()

Configurar cache e invalidación.

📌 Performance

Optimizar:

memo

useCallback

useMemo

Suspense

Server Components

Lazy loading

Evitar renders innecesarios.

📌 UI / UX

Diseñar:

Responsive

Mobile-first

Accesible

Minimalista

Usar Tailwind con clases reutilizables.

📌 Seguridad

Implementar:

Hash passwords

Sanitización

Validaciones backend

Control de acceso

Protección rutas

📌 Variables de Entorno

Nunca hardcodear:

MONGODB_URI=
BETTER_AUTH_SECRET=
NEXT_PUBLIC_APP_URL=

📌 README.md

Incluir:

Setup

Stack

Env vars

Scripts

Deploy

Uso de IA

Decisiones técnicas

📌 WORKFLOW CON CONTROL DE CALIDAD

No avanzar sin validación.

🟢 ETAPA 1 — Setup
Checklist

Next App Router

TS

Tailwind

ESLint

Mongo

tRPC

Validación
npm run dev
npm run build

🟢 ETAPA 2 — Database

Cliente centralizado

Índices

Tipos

Test conexión.

🟢 ETAPA 3 — Auth

BetterAuth

Sessions

Middleware

Validar:

✅ Login
❌ Fail login
❌ Ruta privada

🟢 ETAPA 4 — API Core

Routers

Middlewares

Zod

Test desde frontend.

🟢 ETAPA 5 — CRUD

Create

Read

Update

Delete

Ownership

Pagination

Test multi-user.

🟢 ETAPA 6 — Search

Server-side

Index

Pagination

🟢 ETAPA 7 — Frontend

Layout

Forms

Responsive

Loading

Errors

🟢 ETAPA 8 — Performance

Memo

Cache

Suspense

🟢 ETAPA 9 — Seguridad

Hash

Auth checks

Sanitization

🟢 ETAPA 10 — Producción

Build OK

Deploy

Env vars

README

📌 Regla de Avance

No avanzar sin:

✅ Build exitoso
✅ Tests manuales
✅ Flujo completo funcionando

📌 Modo Reporte

Después de cada etapa:

ETAPA: X
Estado: OK / ERROR
Problemas:
Soluciones:
Pendientes:

📌 Modo de Trabajo

Al escribir código:

Explicá decisiones

Justificá arquitectura

Proponé mejoras

Detectá riesgos

Siempre priorizá calidad sobre velocidad.

📌 Objetivo Final

El proyecto debe ser:

✅ Escalable
✅ Mantenible
✅ Seguro
✅ Performante
✅ Profesional
✅ Aprobable

Ejemplo:

Empezá con la ETAPA 1.
No avances hasta que esté validada.

Luego:

Continuá con ETAPA 2. y asi sucersivamente
