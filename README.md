# TubeX

TubeX is a full-stack YouTube channel marketplace starter with a Next.js frontend and Express + Prisma + MongoDB backend.

## Visual direction
The landing page recreates the *design language* of the supplied reference video: restrained navigation, large editorial typography, white/soft-gray surfaces, dark feature bands, metric blocks, cards, and a strong footer. The content and brand are TubeX-specific rather than copied.

## Stack
- Frontend: Next.js App Router, TypeScript, Tailwind CSS v4, shadcn/ui style components, Lucide
- Backend: Node.js, Express, TypeScript, Helmet, CORS, rate limiting, Zod
- Database: MongoDB + Prisma 6.19.3

## Run
### 1. Backend
```bash
cd backend
cp .env.example .env
npm install
npx prisma generate
npx prisma db push
npm run seed
npm run dev
```

Set `DATABASE_URL` to a MongoDB Atlas connection string. For Prisma's MongoDB connector, Atlas is convenient because it provides a replica set for transactional operations.

### 2. Frontend
In another terminal:
```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```
Open http://localhost:3000.

## API
- `GET /api/health`
- `GET /api/channels/featured`
- `POST /api/newsletter` with `{ "email": "person@example.com" }`

## Important production upgrades
This starter deliberately separates public landing-page functionality from future authenticated marketplace functionality. Before handling real channel transfers or money, add authentication with secure httpOnly cookies, server-side authorization, audit logs, CSRF strategy appropriate to the auth design, KYC/identity checks where legally required, payment/escrow provider integration, webhook signature verification, ownership verification, malware/file-upload controls, dispute handling, email verification, and comprehensive tests.
