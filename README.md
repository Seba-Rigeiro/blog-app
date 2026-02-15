# Blog CMS

CMS de artículos de blog — Next.js (App Router), TypeScript, tRPC, BetterAuth, MongoDB.

## Stack

| Capa         | Tecnología                    |
| ------------ | ----------------------------- |
| Framework    | Next.js 15 (App Router)       |
| Lenguaje     | TypeScript                    |
| API          | tRPC v11                      |
| Validación   | Zod                           |
| Auth         | BetterAuth                    |
| DB           | MongoDB (driver nativo)       |
| UI           | Tailwind CSS, React Hook Form |
| Estado/Fetch | TanStack Query                |

## Requisitos

- Node.js 20+
- MongoDB (local o Atlas)
- Cuenta (para deploy opcional)

## Setup

```bash
# Clonar e instalar
git clone <repo>
cd blog-app
npm install

# Variables de entorno (copiar y completar)
cp .env.example .env
# Editar .env con MONGODB_URI, BETTER_AUTH_SECRET, NEXT_PUBLIC_APP_URL

# Desarrollo
npm run dev
# Abrir http://localhost:3000

# Build producción
npm run build
npm start
```

## Variables de entorno

| Variable              | Descripción                                       |
| --------------------- | ------------------------------------------------- |
| `MONGODB_URI`         | URI de conexión MongoDB                           |
| `BETTER_AUTH_SECRET`  | Secret para sesiones (mín. 32 caracteres)         |
| `BETTER_AUTH_URL`     | URL base de la app (ej. http://localhost:3000)    |
| `NEXT_PUBLIC_APP_URL` | URL pública de la app (ej. http://localhost:3000) |

## Scripts

- `npm run dev` — Desarrollo con Turbopack
- `npm run build` — Build de producción
- `npm start` — Servidor producción
- `npm run lint` — ESLint

## Estructura `/src`

```
src/
  app/          # App Router (layout, pages, api)
  components/  # UI reutilizables
  features/     # Lógica por dominio
  server/       # tRPC (init, routers)
  db/           # Cliente MongoDB
  hooks/        # Custom hooks
  schemas/      # Zod (auth, articles, search, pagination)
  types/        # Tipos globales
  lib/          # Utilidades
```

## Deploy

- Build: `npm run build`
- Configurar en el host: `MONGODB_URI`, `BETTER_AUTH_SECRET`, `NEXT_PUBLIC_APP_URL`
- Ejecutar: `npm start` o usar plataforma (Vercel, etc.) con Node server.

## Uso de IA

Parte del código y la estructura fueron generados o sugeridos con asistencia de IA. Se revisó y adaptó a las reglas del proyecto (SOLID, Clean Architecture, tipado estricto, sin `any`).

## Decisiones técnicas

- **tRPC**: API type-safe sin duplicar tipos entre cliente y servidor.
- **Zod**: Schemas únicos para validación en frontend y backend.
- **BetterAuth**: Auth moderna con sesiones y adaptadores.
- **MongoDB driver nativo**: Control total sobre índices y queries (sin ORM).
- **Carpetas por capa**: Separación clara UI / lógica / validación / persistencia.

---

## Control de calidad — ETAPA 1 (Setup)

**Estado:** OK

**Checklist:**

- [x] Next App Router
- [x] TypeScript
- [x] Tailwind CSS
- [x] ESLint
- [x] MongoDB (dependencia; cliente en ETAPA 2)
- [x] tRPC (init, router, API route, client, providers)
- [x] Estructura `/src` (app, components, features, server, db, hooks, schemas, types, lib)
- [x] `npm run dev` — OK
- [x] `npm run build` — OK

**Pendientes:** Ninguno. Listo para ETAPA 2 (Database).

---

## Control de calidad — ETAPA 2 (Database)

**Estado:** OK

**Checklist:**

- [x] Cliente centralizado (`src/db/client.ts`) con patrón singleton/serverless
- [x] Colecciones tipadas (`src/db/collections.ts`): Users, Articles
- [x] Tipos (`src/types/db.ts`): UserDocument, ArticleDocument
- [x] Índices: users (email unique, createdAt), articles (authorId+createdAt, updatedAt, text search)
- [x] Test conexión: procedimiento tRPC `dbPing` (ping + ensureIndexes)
- [x] `npm run build` — OK

**Pendientes:** Ninguno. Listo para ETAPA 3 (Auth).

---

## Control de calidad — ETAPA 3 (Auth)

**Estado:** OK

**Checklist:**

- [x] BetterAuth con MongoDB adapter (`src/lib/auth.ts`, getAuth lazy)
- [x] Ruta API `/api/auth/[...all]` (GET, POST, PATCH, PUT, DELETE)
- [x] Email/password: Register, Login, Logout
- [x] Session: `auth.api.getSession({ headers })` en servidor; `useSession` en cliente
- [x] Rutas privadas: layout `(protected)` con redirect a `/login` si no hay sesión
- [x] Hooks: `useAuth()` (signIn, signUp, signOut, useSession), `useCurrentUser()`
- [x] Schemas Zod: `loginSchema`, `registerSchema` en `src/schemas/auth.ts`
- [x] Formularios: React Hook Form + Zod resolver en `/login` y `/register`
- [x] User additionalFields: firstName, lastName (signUp envía name + campos extra)
- [x] `npm run build` — OK

**Validar manualmente:** Login OK, Login fallido (credenciales incorrectas), acceso a `/dashboard` sin sesión (redirect a `/login`).

**Pendientes:** Ninguno. Listo para ETAPA 4 (API Core).

---

## Control de calidad — ETAPA 4 (API Core)

**Estado:** OK

**Checklist:**

- [x] Routers: `authRouter`, `articleRouter`, `userRouter`, `searchRouter`
- [x] Context tRPC con sesión (Better Auth `getSession` en `createTRPCContext`)
- [x] Middleware: `protectedProcedure` (requiere sesión; UNAUTHORIZED si no)
- [x] Inputs validados con Zod en todos los procedimientos
- [x] Separación: input → lógica → capa DB
- [x] `npm run build` — OK

**Pendientes:** Ninguno.

---

## Control de calidad — ETAPA 5 (CRUD)

**Estado:** OK

**Checklist:**

- [x] Create: `article.create` (protegido, authorId = session.user.id)
- [x] Read: `article.getById` (público), `article.list` y `article.listByAuthor` (paginación)
- [x] Update: `article.update` con ownership (solo autor)
- [x] Delete: `article.delete` con ownership (solo autor)
- [x] Paginación real: cursor/offset con `paginationInputSchema` y `getSkipTake`
- [x] `npm run build` — OK

**Pendientes:** Ninguno.

---

## Control de calidad — ETAPA 6 (Search)

**Estado:** OK

**Checklist:**

- [x] Búsqueda server-side: `search.articles` (título, texto, autor)
- [x] Índice MongoDB de texto en articles (title, content, español)
- [x] Paginación en resultados de búsqueda
- [x] Schema Zod: `searchArticlesSchema` (q, authorId opcional, limit, cursor)
- [x] `npm run build` — OK

**Pendientes:** Ninguno.

---

## Control de calidad — ETAPA 7 (Frontend)

**Estado:** OK

**Checklist:**

- [x] Layout: Header con nav (Inicio, Artículos, Buscar, Login/Registro o Nuevo artículo, Dashboard, Salir)
- [x] Home: últimos artículos + autores con cantidad (`user.getAuthorsWithArticleCount`)
- [x] Listado artículos: `/articles` con paginación
- [x] Vista detalle: `/articles/[id]` con editar/eliminar solo para autor
- [x] Formularios: crear (`/articles/new`) y editar (`/articles/[id]/edit`) con RHF + Zod
- [x] Rutas protegidas: `/articles/new` y `/articles/[id]/edit` bajo layout `(protected)`
- [x] Búsqueda: `/search` con `useSearchArticles`
- [x] Hooks: `useArticles`, `useArticleById`, `useCreateArticle`, `useUpdateArticle`, `useDeleteArticle`, `useMyArticles`, `useSearchArticles`
- [x] Loading y errores en listados y detalle
- [x] Responsive (Tailwind, max-w-4xl, mobile-first)
- [x] `npm run build` — OK

**Pendientes:** Ninguno. Listo para ETAPA 8 (Performance) y siguientes.
