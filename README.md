# Recipe Finder

A full-stack recipe finder application with a mobile client and backend API.

## Project Structure

```
recipe-finder/
├── backend/     # Express.js API server
└── mobile/      # Expo/React Native mobile app
```

## Tech Stack

### Backend

- Node.js with Express
- TypeScript
- Drizzle ORM
- Neon Database (PostgreSQL)
- Cron jobs for scheduled tasks

### Mobile

- Expo
- React Native
- TypeScript
- Expo Router for navigation

## Prerequisites

- Node.js (v18 or higher)
- pnpm
- Expo CLI (for mobile development)
- PostgreSQL database (Neon or local)

## Getting Started

### Backend Setup

1. Navigate to the backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
pnpm install
```

3. Create a `.env` file in the `backend` directory with the following variables:

```
PORT=3000
DATABASE_URL=your_database_url
API_URL=your_api_url
```

4. Run database migrations:

```bash
pnpm db:migrate
```

5. Start the development server:

```bash
pnpm dev
```

The API will be available at `http://localhost:3000`

### Mobile Setup

1. Navigate to the mobile directory:

```bash
cd mobile
```

2. Install dependencies:

```bash
pnpm install
```

3. Start the Expo development server:

```bash
pnpm start
```

4. Follow the Expo CLI instructions to open the app on your device or emulator.

## API Endpoints

### Health Check

- `GET /health` - Server health status

### Favourites

- `POST /api/favourites` - Add a recipe to favourites
- `GET /api/favourites/:userId` - Get all favourites for a user
- `DELETE /api/favourites/:userId/:recipeId` - Remove a recipe from favourites

## Database

The application uses Drizzle ORM with PostgreSQL. Database schema and migrations are managed in `backend/src/db/`.

### Database Commands

- Generate migrations: `pnpm db:generate`
- Run migrations: `pnpm db:migrate`
- Open Drizzle Studio: `pnpm db:studio`

## Development

### Backend Scripts

- `pnpm dev` - Start development server with hot reload
- `pnpm start` - Start production server
- `pnpm build` - Build TypeScript to JavaScript

### Mobile Scripts

- `pnpm start` - Start Expo development server
- `pnpm android` - Start on Android emulator
- `pnpm ios` - Start on iOS simulator
- `pnpm web` - Start web version
- `pnpm lint` - Run ESLint

## License

ISC
