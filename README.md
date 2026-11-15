# ForgeFit

ForgeFit is a React/Vite fitness app with an Express, MongoDB, and cookie-authenticated API.

## Local development

Use Node.js 20.19 or newer.

1. Copy `backend/.env.example` to `backend/.env` and configure MongoDB, a random JWT secret, and the frontend origin.
2. Copy `frontend/.env.example` to `frontend/.env` and set `VITE_API_URL=http://localhost:5000/api`.
3. In `backend`, run `npm ci` and `npm run dev`.
4. In `frontend`, run `npm ci` and `npm run dev`.

## Deployment

Deploy the `backend` and `frontend` as separate services. Configure the variables from the example files in the hosting provider's secret/environment settings; do not commit real `.env` files.

- Backend: install with `npm ci`; start with `npm start`. Set `NODE_ENV=production`, `MONGO_URI`, a randomly generated `JWT_SECRET` of at least 32 characters, `PORT` if required, and `CLIENT_URL` to the exact frontend origin. Multiple allowed origins can be comma-separated.
- Frontend: install with `npm ci`; build with `npm run build`; publish the `frontend/dist` directory. Set `VITE_API_URL` to the public HTTPS backend URL ending in `/api` at build time. The production build rejects missing, HTTP, or localhost API URLs. Configure the frontend host to serve `index.html` for application routes.
- Optional Google/GitHub sign-in: set `API_PUBLIC_URL` to the public backend origin plus the matching `*_CLIENT_ID` and `*_CLIENT_SECRET`. Register these exact callback URLs with the providers:
  - `https://your-backend-domain.example/api/auth/oauth/google/callback`
  - `https://your-backend-domain.example/api/auth/oauth/github/callback`
  OAuth buttons remain disabled until the provider credentials and `API_PUBLIC_URL` are configured. A verified email is required. If it already belongs to a password account, sign in with that account instead.
- Use HTTPS for both services. Keep the frontend and API on the same site where possible so browsers accept the secure session cookie. Allow the backend to reach the MongoDB deployment from the hosting network.
- Password reset email is enabled when `RESEND_API_KEY` and a verified `EMAIL_FROM` are configured. The reset link uses the first origin in `CLIENT_URL`.
- AI replies use a personalized built-in coach by default. To enable model-generated replies, configure `OPENAI_API_KEY` and optionally `OPENAI_MODEL` / `OPENAI_BASE_URL` on the backend only.

The API exposes `/health` for a basic liveness check. This project has no deployment provider or production domains configured in source; supply those values in the hosting environment before release.
