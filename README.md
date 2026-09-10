# Jewelry Catalog API

A backend-focused product catalog REST API built for an internship selection assignment. It demonstrates CRUD operations, search/filtering, PostgreSQL data modeling, admin authentication, validation, error handling, API documentation, testing, and Docker support.

## Tech stack

- Node.js + Express
- PostgreSQL
- Prisma ORM
- JWT + bcryptjs for admin authentication
- Zod for request validation
- Swagger/OpenAPI for API documentation
- Jest + Supertest for automated tests
- Docker / Docker Compose

## Requirements covered

| Requirement | Implementation |
|---|---|
| Product CRUD | `POST`, `GET`, `PUT`, `DELETE /api/products` |
| Product fields | name, price, category, images, stock, description |
| Search/filter | search, category, price range, stock status |
| Basic admin auth | JWT bearer authentication |
| Database | PostgreSQL + Prisma |
| Edge cases | validation, missing records, bad credentials, empty results, zero stock |
| Deployment ready | Dockerfile + environment variables |
| API documentation | Swagger UI at `/docs` |

## Architecture

`routes -> validation middleware -> controllers -> Prisma -> PostgreSQL`

Authentication is handled by a JWT middleware before protected product mutations. Controllers stay focused on HTTP behavior while Prisma handles persistence.

## Run locally

### 1. Install

Use Node.js 20+ and PostgreSQL, or use the included Docker Compose setup.

```bash
npm install
cp .env.example .env
```

### 2. Start PostgreSQL with Docker

```bash
docker compose up -d db
```

### 3. Configure `.env`

Keep secrets only in `.env`; never commit them.

```env
PORT=5000
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/jewelry_catalog?schema=public"
JWT_SECRET="use-a-long-random-secret-here"
JWT_EXPIRES_IN="1d"
ADMIN_REGISTRATION_KEY="your-private-registration-key"
CORS_ORIGIN="*"
```

### 4. Create the database schema and seed demo data

```bash
npx prisma db push
npm run db:seed
```

The seed creates a demo admin account using `SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD` if supplied. Otherwise it uses `admin@example.com` / `AdminPass123!` for local demonstration only.

### 5. Start the API

```bash
npm run dev
```

The API runs at `http://localhost:5000`.

## Docker full stack

```bash
docker compose up --build
```

This starts PostgreSQL and the API together.

## API usage

### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@example.com",
  "password": "AdminPass123!"
}
```

Copy the returned JWT and send it as:

```http
Authorization: Bearer <token>
```

### Create product (admin)

```http
POST /api/products
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Royal Gold Ring",
  "description": "Minimal gold ring",
  "price": 12999,
  "category": "rings",
  "images": ["https://example.com/ring.jpg"],
  "stock": 5
}
```

### Search/filter examples

```text
GET /api/products?search=gold
GET /api/products?category=rings
GET /api/products?minPrice=5000&maxPrice=25000
GET /api/products?inStock=true
GET /api/products?search=diamond&category=rings
GET /api/products?sortBy=price&sortOrder=asc&page=1&limit=10
```

`inStock=true` means `stock > 0`; `inStock=false` includes zero-stock products. Zero stock is therefore represented without deleting the product from the catalog.

## HTTP status conventions

- `200` successful read/update/login
- `201` successful creation
- `204` successful deletion
- `400` validation error
- `401` missing/invalid authentication
- `403` authenticated user lacks permission or registration key is invalid
- `404` resource/route not found
- `409` duplicate/conflicting resource
- `500` unexpected server error

## API documentation

After starting the server, open `/docs` for interactive Swagger UI.

The OpenAPI source is in `docs/openapi.yaml`.

## Tests

```bash
npm test
```

The included tests cover health checks, validation/routing behavior, and 404 handling. Database-backed integration tests can be added with a dedicated test database when extending the project.

## Deployment

The application is container-ready. For a cloud deployment, provision a managed PostgreSQL database, set the environment variables from `.env.example`, build the Docker image, and run the container on a platform that supports Docker. Do not commit production credentials.

## Design decisions

1. **PostgreSQL** was chosen because product data is structured and benefits from relational constraints and indexes.
2. **Prisma** keeps database access typed and makes the schema easy to review.
3. **JWT** keeps the admin API stateless and easy to deploy.
4. **Validation at the HTTP boundary** prevents invalid prices, negative stock, malformed image URLs, and invalid query parameters from reaching the database layer.
5. **Pagination and sorting** make the catalog endpoint usable as the product list grows.
6. **Zero-stock products remain visible** so the catalog can show unavailable products instead of losing them.

## Security notes

- Passwords are hashed with bcrypt.
- JWT secrets and registration keys come from environment variables.
- Helmet adds common HTTP security headers.
- Request bodies are size-limited.
- `.env` is excluded from Git.
- Admin mutations require a valid JWT.

## Project structure

```text
jewelry-catalog-api/
├── docs/openapi.yaml
├── prisma/schema.prisma
├── prisma/seed.js
├── src/
│   ├── config/env.js
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── utils/
│   ├── validators/
│   ├── app.js
│   ├── db.js
│   └── server.js
├── tests/health.test.js
├── .env.example
├── .gitignore
├── Dockerfile
├── docker-compose.yml
├── jest.config.js
└── package.json
```

## Internship walkthrough checklist

Be ready to explain:

- Why PostgreSQL and Prisma were selected.
- How the Product schema supports search and filtering.
- How `inStock` is derived from `stock`.
- Why product reads are public while mutations are admin-only.
- How JWT verification works.
- How invalid input is rejected before database access.
- How pagination prevents returning an unbounded product list.
- How the API can be deployed without hard-coded secrets.
