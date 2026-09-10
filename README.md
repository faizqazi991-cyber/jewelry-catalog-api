# Jewelry Catalog API

A backend REST API for a product catalog, built as an internship assignment. It provides product CRUD, search/filtering, pagination, JWT-based admin authentication, PostgreSQL persistence, validation, tests, Swagger/OpenAPI documentation, and Docker support.

## 🚀 Live Demo

- **Live API:** https://jewelry-catalog-api-xcuz.onrender.com
- **Swagger UI:** https://jewelry-catalog-api-xcuz.onrender.com/docs
- **Health Check:** https://jewelry-catalog-api-xcuz.onrender.com/health

> The free Render service may take a short time to wake up after inactivity.

## ✨ Features

- Full product CRUD
- PostgreSQL + Prisma ORM
- JWT admin authentication
- bcrypt password hashing
- Search by product name/description
- Category, price-range, and stock filters
- Pagination and sorting
- Zod request validation
- Centralized error handling
- Swagger/OpenAPI docs
- Jest + Supertest tests
- Docker + Docker Compose
- Helmet security headers and configurable CORS

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js 20+ |
| Framework | Express.js |
| Database | PostgreSQL |
| ORM | Prisma |
| Authentication | JWT |
| Password hashing | bcryptjs |
| Validation | Zod |
| Documentation | Swagger / OpenAPI |
| Testing | Jest + Supertest |
| Containerization | Docker + Docker Compose |
| Deployment | Render |

## 📋 Assignment Requirements

| Requirement | Implementation |
|---|---|
| Product CRUD | POST, GET, PUT, DELETE `/api/products` |
| Product fields | name, price, category, images, stock, description |
| Search/filter | search, category, price range, stock status |
| Admin auth | JWT-protected product mutations |
| Database | PostgreSQL + Prisma |
| Edge cases | validation, missing records, duplicate records, invalid auth, zero stock, empty results |
| Deployment | Dockerized API on Render |
| Documentation | Interactive Swagger/OpenAPI UI |

## 🔐 Authentication

### Register an admin

`POST /api/auth/register`

```json
{
  "email": "admin@example.com",
  "password": "your-secure-password",
  "registrationKey": "your-admin-registration-key"
}
```

The registration key comes from the private `ADMIN_REGISTRATION_KEY` environment variable and is never committed to the repository.

### Login

`POST /api/auth/login`

```json
{
  "email": "admin@example.com",
  "password": "your-secure-password"
}
```

Use the returned JWT as:

```text
Authorization: Bearer <token>
```

### Current admin

`GET /api/auth/me`

## 📦 Product API

| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| GET | `/api/products` | No | List/search products |
| GET | `/api/products/:id` | No | Get one product |
| POST | `/api/products` | JWT | Create product |
| PUT | `/api/products/:id` | JWT | Update product |
| DELETE | `/api/products/:id` | JWT | Delete product |

Example create request:

```json
{
  "name": "Royal Gold Ring",
  "description": "Minimal gold ring",
  "price": 12999,
  "category": "rings",
  "images": ["https://example.com/ring.jpg"],
  "stock": 5
}
```

## 🔎 Search, Filters, Pagination & Sorting

The listing endpoint supports combined query parameters:

```text
GET /api/products?search=gold
GET /api/products?category=rings
GET /api/products?minPrice=5000&maxPrice=25000
GET /api/products?inStock=true
GET /api/products?search=diamond&category=rings
GET /api/products?sortBy=price&sortOrder=asc&page=1&limit=10
```

`inStock=true` means `stock > 0`; `inStock=false` includes zero-stock products. Zero-stock products remain in the catalog and are returned with `inStock: false`.

## 🧪 Edge Cases & Error Handling

The API handles invalid/missing authentication, invalid registration keys, malformed request bodies, negative prices or stock, invalid query parameters, invalid product IDs, duplicate/conflicting resources, missing products, empty search results, zero-stock products, unknown routes, and unexpected server/database errors.

Common HTTP status codes include `200`, `201`, `204`, `400`, `401`, `403`, `404`, `409`, and `500`.

## 📖 API Documentation

Interactive Swagger documentation:

**https://jewelry-catalog-api-xcuz.onrender.com/docs**

OpenAPI source:

```text
docs/openapi.yaml
```

## 🏗️ Architecture

```text
HTTP Request
    ↓
Express Routes
    ↓
Validation / Authentication Middleware
    ↓
Controllers
    ↓
Prisma ORM
    ↓
PostgreSQL
```

Routing, validation, authentication, controllers, and database access are separated to keep the codebase maintainable and testable.

## 📁 Project Structure

```text
jewelry-catalog-api/
├── docs/openapi.yaml
├── prisma/schema.prisma
├── prisma/seed.js
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── utils/
│   ├── validators/
│   ├── app.js
│   ├── db.js
│   └── server.js
├── tests/
├── .env.example
├── .gitignore
├── Dockerfile
├── docker-compose.yml
├── jest.config.js
├── package.json
└── README.md
```

## 💻 Run Locally

### Prerequisites

- Node.js 20+
- PostgreSQL, or Docker Desktop

### Install and configure

```bash
npm install
cp .env.example .env
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

Configure the private values in `.env`:

```env
PORT=5000
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/jewelry_catalog?schema=public"
JWT_SECRET="replace-with-a-long-random-secret"
JWT_EXPIRES_IN="1d"
ADMIN_REGISTRATION_KEY="replace-with-a-private-registration-key"
CORS_ORIGIN="*"
```

Never commit the real `.env` file or production secrets.

### Database and seed

```bash
npx prisma db push
npm run db:seed
```

The seed script creates sample jewelry products and a demo admin for local development. For a real deployment, use your own credentials through environment variables.

### Start the API

```bash
npm run dev
```

The API runs at `http://localhost:5000`.

### Docker

```bash
docker compose up --build
```

The container initializes the Prisma schema, seeds the database, and starts the API.

## 🧪 Testing

```bash
npm test
```

The included Jest/Supertest tests cover core application behavior such as health checks, routing/validation behavior, and error handling. A dedicated test database can be added for deeper database-backed integration tests.

## 🗄️ Database Design

### User

- id
- email
- passwordHash
- role
- timestamps

### Product

- id
- name
- description
- price
- category
- images
- stock
- timestamps

Product prices use Prisma's decimal database type for reliable monetary storage, while stock is an integer.

## 🔒 Security Notes

- Passwords are stored as bcrypt hashes.
- JWT secrets and registration keys come from environment variables.
- `.env` is excluded from Git.
- Product mutations require a valid JWT.
- Request payloads are validated before database access.
- Helmet adds common HTTP security headers.
- Request body size is limited.
- CORS is configurable.

## 🚢 Deployment

The API is containerized with Docker and deployed on Render with a managed PostgreSQL database. Deployment uses environment variables for database access and authentication secrets. The Docker startup command initializes Prisma, seeds the database, and starts Express.

### Deployment checklist

- [x] PostgreSQL configured
- [x] Environment variables configured
- [x] Docker deployment completed
- [x] Database schema initialized
- [x] Seed data loaded
- [x] Public API accessible
- [x] Search/filter verified
- [x] Pagination verified
- [x] Swagger available

## 🎯 Design Decisions

1. **PostgreSQL + Prisma** — structured catalog data fits a relational database and Prisma keeps database access maintainable.
2. **JWT authentication** — provides stateless authentication for protected admin operations.
3. **Zod validation** — rejects invalid data at the HTTP boundary before database access.
4. **Pagination and sorting** — avoids returning an unbounded product list as the catalog grows.
5. **Zero-stock products remain visible** — availability is represented by stock instead of deleting catalog records.
6. **Layered architecture** — routes, middleware, controllers, validation, and database access are separated for easier maintenance and testing.

## 📌 Internship Submission

This repository demonstrates REST API design, CRUD operations, PostgreSQL database design, authentication/authorization, search/filtering, pagination/sorting, validation, edge-case handling, automated testing, API documentation, and Docker-based deployment.

- **Repository:** https://github.com/faizqazi991-cyber/jewelry-catalog-api
- **Live API:** https://jewelry-catalog-api-xcuz.onrender.com
- **Swagger:** https://jewelry-catalog-api-xcuz.onrender.com/docs
