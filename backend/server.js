const dotenv = require("dotenv");
dotenv.config();

const cors = require("cors");
const express = require("express");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const errorMiddleware = require("./middleware/errorMiddleware");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const workoutRoutes = require("./routes/workoutRoutes");
const nutritionRoutes = require("./routes/nutritionRoutes");
const progressRoutes = require("./routes/progressRoutes");
const aiRoutes = require("./routes/aiRoutes");
const profileRoutes = require("./routes/profileRoutes");

const requiredEnv = ["MONGO_URI", "JWT_SECRET", "CLIENT_URL"];
const missingEnv = requiredEnv.filter((name) => !process.env[name]?.trim());
if (missingEnv.length) {
  console.error(`Missing required environment variables: ${missingEnv.join(", ")}`);
  process.exit(1);
}
if (process.env.NODE_ENV === "production" && process.env.JWT_SECRET.length < 32) {
  console.error("JWT_SECRET must contain at least 32 characters in production.");
  process.exit(1);
}
if (process.env.NODE_ENV === "production") {
  const productionOrigins = process.env.CLIENT_URL.split(",").map((origin) => {
    try { return new URL(origin.trim()); } catch { return null; }
  });
  if (productionOrigins.some((origin) => !origin || origin.protocol !== "https:" || origin.pathname !== "/" || origin.search || origin.hash || /^(localhost|127\.0\.0\.1|0\.0\.0\.0)$/i.test(origin.hostname))) {
    console.error("Every CLIENT_URL origin must use HTTPS and a public hostname in production.");
    process.exit(1);
  }
  const oauthRequested = ["GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET", "GITHUB_CLIENT_ID", "GITHUB_CLIENT_SECRET"].some((name) => process.env[name]?.trim());
  if (oauthRequested) {
    let apiOrigin;
    try { apiOrigin = new URL(process.env.API_PUBLIC_URL); } catch { apiOrigin = null; }
    if (!apiOrigin || apiOrigin.protocol !== "https:" || apiOrigin.pathname !== "/" || apiOrigin.search || apiOrigin.hash || /^(localhost|127\.0\.0\.1|0\.0\.0\.0)$/i.test(apiOrigin.hostname)) {
      console.error("API_PUBLIC_URL must be the public HTTPS backend origin to enable OAuth in production.");
      process.exit(1);
    }
    for (const [idName, secretName] of [["GOOGLE_CLIENT_ID", "GOOGLE_CLIENT_SECRET"], ["GITHUB_CLIENT_ID", "GITHUB_CLIENT_SECRET"]]) {
      if (Boolean(process.env[idName]?.trim()) !== Boolean(process.env[secretName]?.trim())) {
        console.error(`${idName} and ${secretName} must both be set to enable that OAuth provider.`);
        process.exit(1);
      }
    }
  }
}

const app = express();
app.disable("x-powered-by");
app.set("trust proxy", 1);
const allowedOrigins = process.env.CLIENT_URL.split(",").map((origin) => origin.trim().replace(/\/$/, "")).filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin.replace(/\/$/, ""))) return callback(null, true);
    return callback(new Error("Origin is not allowed by CORS."));
  },
  credentials: true,
}));
app.use((req, res, next) => {
  const isStateChanging = ["POST", "PUT", "PATCH", "DELETE"].includes(req.method);
  const origin = req.get("origin")?.replace(/\/$/, "");
  if (isStateChanging && origin && !allowedOrigins.includes(origin)) {
    return res.status(403).json({ success: false, message: "Request origin is not allowed." });
  }
  next();
});
app.use((req, res, next) => {
  res.set({
    "X-Content-Type-Options": "nosniff",
    "X-Frame-Options": "DENY",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  });
  next();
});
app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: true, limit: "100kb" }));
app.use(cookieParser());

app.get("/", (req, res) => res.json({ success: true, message: "ForgeFit API is running." }));
app.get("/health", (req, res) => res.json({ success: true, status: "ok" }));
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/workouts", workoutRoutes);
app.use("/api/nutrition", nutritionRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/profile", profileRoutes);
app.use((req, res) => res.status(404).json({ success: false, message: "Route not found." }));
app.use(errorMiddleware);

const start = async () => {
  await connectDB();
  const port = Number(process.env.PORT) || 5000;
  app.listen(port, "0.0.0.0", () => console.log(`ForgeFit API listening on port ${port}`));
};

start().catch((error) => {
  console.error("ForgeFit API could not start:", error.message);
  process.exit(1);
});
