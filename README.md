# ACT Practice App

This repo is split into two projects:

- `backend/` — Express authentication API (PostgreSQL + migrations).
- `frontend/` — Expo React Native app with login, register, and dashboard placeholder screens.

## Backend setup (Express + PostgreSQL)

1. **Create the database**

   ```bash
   createdb act_practice
   ```

2. **Configure environment variables**

   ```bash
   cp backend/.env.example backend/.env
   ```

   Update `backend/.env` with your `DATABASE_URL`, `JWT_SECRET`, and any custom `PORT`.

3. **Install dependencies**

   ```bash
   npm install --workspace backend
   ```

4. **Run migrations**

   ```bash
   npm run --workspace backend migrate
   ```

5. **Start the API**

   ```bash
   npm run --workspace backend dev
   ```

The API runs on `http://localhost:3000` by default.

## Database notes

- The backend expects a PostgreSQL connection string in `DATABASE_URL`.
- Migrations are managed with `node-pg-migrate` in `backend/migrations`.

## Frontend setup (Expo)

1. **Install dependencies**

   ```bash
   npm install --workspace frontend
   ```

2. **Start the Expo dev server**

   ```bash
   npm run --workspace frontend start
   ```

3. **Run on device or simulator**

   Follow the Expo CLI prompts to open the app in iOS Simulator, Android Emulator, or on a device.

## Project structure

```
.
├── backend
├── frontend
├── public
└── README.md
```
