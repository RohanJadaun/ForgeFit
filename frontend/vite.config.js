import { defineConfig, loadEnv } from "vite";
import process from "node:process";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "VITE_");
  const apiUrl = env.VITE_API_URL?.trim();

  if (mode === "production") {
    let parsedApiUrl;
    try {
      parsedApiUrl = new URL(apiUrl);
    } catch {
      throw new Error("Set VITE_API_URL to the public HTTPS API URL ending in /api before building for production.");
    }

    if (parsedApiUrl.protocol !== "https:" || /^(localhost|127\.0\.0\.1|0\.0\.0\.0)$/i.test(parsedApiUrl.hostname) || !parsedApiUrl.pathname.replace(/\/$/, "").endsWith("/api")) {
      throw new Error("Production VITE_API_URL must be a public HTTPS URL ending in /api.");
    }
  }

  return {
    plugins: [react(), tailwindcss()],
  };
});
