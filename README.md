# ForgeFit

ForgeFit is a fitness tracking app for people who want one place to plan workouts, log meals, follow progress, and get coaching based on their own activity.

## What you can do

- **Track workouts:** Save workout type and duration, estimate calories using your body weight, and record exercises, sets, reps, and lifting weight. Review older sessions to see how your reps and strength change over time.
- **Log food:** Enter a food and serving size in grams. ForgeFit estimates calories, protein, carbohydrates, and fat, then adds them to your daily nutrition totals. Estimates are approximate.
- **Follow progress:** Record body measurements and review weight and activity trends over time.
- **Use the AI Coach:** Ask about training, food, or recovery. The coach can use your saved profile, workout history, progress measurements, and nutrition logs. Conversations are saved to your account until you clear them. A built-in coach works without an AI provider key; an optional OpenAI-compatible provider can generate replies.
- **Personalize your workspace:** Set your fitness profile and switch between light and dark themes.

## How it is built

- **Frontend:** React, Vite, React Router, and Redux Toolkit.
- **Backend:** Node.js and Express REST API.
- **Database:** MongoDB with Mongoose models for users, workouts, nutrition, progress, profiles, and coach conversations.
- **Authentication:** Protected API routes with cookie-based sessions.

## Run locally

You need Node.js 20.19 or newer and a MongoDB database the backend can reach.

1. Copy `backend/.env.example` to `backend/.env`. Set `MONGO_URI`, a random `JWT_SECRET`, and `CLIENT_URL=http://localhost:5173`.
2. Copy `frontend/.env.example` to `frontend/.env` and set:

   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

3. Start the backend in one terminal:

   ```powershell
   cd backend
   npm ci
   npm run dev
   ```

4. Start the frontend in another terminal:

   ```powershell
   cd frontend
   npm ci
   npm run dev
   ```

Open the local URL printed by Vite. The backend health check is at `http://localhost:5000/health`.

## Configure AI replies (optional)

The built-in coach works without an external API key. To use a Groq key, add these settings to `backend/.env`:

```env
OPENAI_API_KEY=your-groq-key
OPENAI_BASE_URL=https://api.groq.com/openai/v1/chat/completions
OPENAI_MODEL=openai/gpt-oss-20b
```

The variable names are kept compatible with OpenAI-style APIs. Store provider keys on the backend only; never put them in `frontend/.env`.

## Deploy

Deploy the backend and frontend as separate services. Add secrets through each host's environment settings; do not commit `.env` files. The repository ignores local `.env` files.

### Backend

- Root directory: `backend`
- Install command: `npm ci`
- Start command: `npm start`
- Set `NODE_ENV=production`, `MONGO_URI`, a new `JWT_SECRET` with at least 32 characters, and `CLIENT_URL` to the frontend's exact public origin.
- Set `OPENAI_API_KEY`, `OPENAI_BASE_URL`, and `OPENAI_MODEL` only if using an external AI provider. The host may set `PORT` automatically.

### Frontend

- Root directory: `frontend`
- Install command: `npm ci`
- Build command: `npm run build`
- Publish directory: `dist`
- At build time, set `VITE_API_URL` to the public HTTPS backend URL ending in `/api`.
- Configure the host to serve `index.html` for application routes.

After deployment, check the backend `/health` endpoint and sign in to verify the app. Both services need HTTPS, and the backend must be able to connect to MongoDB.

## Optional integrations

- Google or GitHub sign-in requires `API_PUBLIC_URL` and the matching provider client ID and secret. Register callbacks at `https://<backend-domain>/api/auth/oauth/google/callback` and `https://<backend-domain>/api/auth/oauth/github/callback`.
- Password reset emails require `RESEND_API_KEY` and a verified `EMAIL_FROM` address.
