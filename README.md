# AutoLease API

Car Rental & Marketplace API built with **Node.js**, **Express.js**, **js** (MVC).

## Tech Stack

| Layer | Technology |
|-------|------------|
| Runtime | Node.js |
| Framework | Express.js |
| Language | js |
| Database | PostgreSQL + TypeORM |
| Auth | JWT, Google OAuth |

## MVC Structure

```
src/
├── models/        # Data + business logic (TypeORM)
├── controllers/   # Express request handlers
├── routes/        # Route definitions
├── middlewares/
├── validators/
├── config/
├── utils/
├── types/
├── database/
├── app.js         # Express app setup
└── server.js      # Node.js entry point
```

## Setup

```bash
npm install
cp .env.example .env   # add your secrets (.env is gitignored)
npm run dev            # development (ts-node-dev)
npm run build          # compile TypeScript → dist/
npm start              # run compiled JS
npm run seed           # seed test users
```

## Test Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@autolease.com | Admin@12345 |
| Customer | customer@autolease.com | Customer@12345 |
| Car Owner | owner@autolease.com | Owner@12345 |

## API Base

`http://localhost:3000/api/v1`

ER diagram: [docs/ER-DIAGRAM.md](docs/ER-DIAGRAM.md)
