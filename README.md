# Poker ProGrid Backend

## Description

Backend API for Poker ProGrid, built with NestJS, PostgreSQL, and Prisma. This application handles user management, tournament data, grid creation, and subscription management through Stripe.

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL
- npm or yarn
- A Kinde account for authentication
- A Stripe account for payments

## Environment Variables

Create a `.env` file in the root directory with the following variables:

- `DATABASE_URL`: Your PostgreSQL connection string
- `KINDE_ISSUER_URL`: Your Kinde issuer URL
- `STRIPE_SECRET_KEY`: Your Stripe secret key
- `STRIPE_WEBHOOK_SECRET`: Your Stripe webhook secret
- `STRIPE_PREMIUM_PRICE_ID`: Your Stripe premium price ID
- `STRIPE_ELITE_PRICE_ID`: Your Stripe elite price ID


## Installation

1. Clone the repository
2. Install dependencies with `npm install` or `yarn install`.
3. Generate Prisma client with `npx prisma generate`.
4. Run migrations with `npx prisma migrate dev`.
5. Start the server with `npm run start:dev` or `yarn start:dev`.

## API Endpoints

### Authentication
- All routes are protected by Kinde authentication except for webhooks
- Requires a valid JWT token in the Authorization header

### Users
- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID
- `GET /users?role=` - Get users by role
- `PATCH /users/:id` - Update user
- `DELETE /users/:id` - Delete user

### Tournaments
- `GET /tournaments/search` - Search tournaments with filters
- `GET /tournaments/:id` - Get tournament by ID
- `POST /tournaments` - Add a new tournament
- `PATCH /tournaments/:id` - Update tournament
- `DELETE /tournaments/:id` - Delete tournament

### Grids
- `POST /grid` - Create a new grid
- `GET /grid` - Get user's grids
- `GET /grid/:id` - Get specific grid
- `PUT /grid/:id` - Update grid
- `DELETE /grid/:id` - Delete grid
- `POST /grid/:id/add-tournament` - Add tournament to grid

### Webhooks
- `POST /webhook/kinde` - Handle Kinde user events
- `POST /stripe/webhook` - Handle Stripe payment events

### Payments
- `POST /stripe/create-checkout-session` - Create Stripe checkout session for subscription




