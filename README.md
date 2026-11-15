# ForgeFit

ForgeFit is a fitness tracking app built with React and Vite, an Express API, and MongoDB. It lets users log workouts and food, track progress, and get personalized coaching based on their profile and saved activity.

## Requirements

- Node.js 20.19 or newer
- A MongoDB database reachable by the backend

## Run locally

1. Copy `backend/.env.example` to `backend/.env`. Set `MONGO_URI`, a strong `JWT_SECRET`, and `CLIENT_URL=http://localhost:5173`.
2. Copy `frontend/.env.example` to `frontend/.env` and set `VITE_API_URL=http://localhost:5000/api`.
3. In one terminal, run the backend:

   ```powershell
   cd backend
   npm ci
   npm run dev
   ```

4. In another terminal, run the frontend:

   ```powershell
   cd frontend
   npm ci
   npm run dev
   ```

Open the local URL printed by Vite. The API health check is available at `http://localhost:5000/health`.

## AI Coach

The built-in coach works without an external AI key. When configured, the backend can also use an OpenAI-compatible chat API. Keep the key in `backend/.env`, never in the frontend.

For Groq, set these backend environment variables:

```env
OPENAI_API_KEY=your-groq-key
OPENAI_BASE_URL=https://api.groq.com/openai/v1/chat/completions
OPENAI_MODEL=openai/gpt-oss-20b
```

The coach uses the user's saved profile, recent workouts, progress measurements, nutrition logs, and recent chat history. Chat history is saved per account; **Clear chat** deletes it.

## Deploy

Deploy the backend and frontend as separate services. Add environment variables in each hosting provider's settings; do not upload `.env` files or commit secrets. The repository's `.gitignore` excludes local `.env` files.

### Backend service

- Root directory: `backend`
- Install command: `npm ci`
- Start command: `npm start`
- Set `NODE_ENV=production`, `MONGO_URI`, a fresh `JWT_SECRET` of at least 32 characters, and `CLIENT_URL` to the exact public frontend origin. Set `PORT` only if the host requires it.
- Set the optional AI provider variables from the section above if you want generated replies.

### Frontend service

- Root directory: `frontend`
- Install command: `npm ci`
- Build command: `npm run build`
- Publish directory: `dist`
- At build time, set `VITE_API_URL` to the public HTTPS backend URL ending in `/api`.
- Configure the host to serve `index.html` for application routes.

Use HTTPS for both services. Set the backend's `CLIENT_URL` to the deployed frontend origin, and make sure the frontend can reach the backend and MongoDB. After deployment, check the backend's `/health` endpoint and sign in to test the app.

### Optional integrations

- Google and GitHub sign-in require `API_PUBLIC_URL` plus the matching client ID and secret. Register the provider callbacks as `https://<backend-domain>/api/auth/oauth/google/callback` and `https://<backend-domain>/api/auth/oauth/github/callback`.
- Password reset emails require `RESEND_API_KEY` and a verified `EMAIL_FROM` address.
