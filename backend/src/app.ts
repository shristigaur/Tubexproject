import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";

import publicRoutes from "./routes/public.routes.js";
import authRoutes from "./routes/auth.routes.js";

import { env } from "./config/env.js";
import { notFound, errorHandler } from "./middleware/error.js";

export const app = express();
app.set("trust proxy", 1);
app.disable("x-powered-by");
app.use(helmet());
const clientOrigin = env.CLIENT_URL || env.FRONTEND_URL || "";
const allowedOrigins = env.NODE_ENV === "production" 
  ? [clientOrigin] 
  : [clientOrigin, "http://localhost:3000"].filter(Boolean);

app.use(cors({ 
  origin: allowedOrigins,
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]
}));
app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: false, limit: "20kb" }));
app.use(cookieParser());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 100, standardHeaders: "draft-7", legacyHeaders: false }));

app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "TubeX API is running",
  });
});

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "TubeX backend is running",
  });
});

if (env.NODE_ENV === "development") {
  app.get("/dev/test-email", async (_req, res) => {
    if (!env.TEST_EMAIL_TO) {
      return res.status(400).json({ success: false, message: "TEST_EMAIL_TO is not configured" });
    }
    const { sendEmail } = await import("./services/mail.service.js");
    const result = await sendEmail({
      to: env.TEST_EMAIL_TO,
      subject: "TubeX SMTP Test",
      text: "This is a test email from the TubeX backend.",
    });
    return res.status(result.success ? 200 : 500).json(result);
  });
}
app.use("/api", publicRoutes);
app.use("/api/auth", authRoutes);
app.use(notFound);
app.use(errorHandler);

// app.get("/api/health", (_req, res) => {
//   res.status(200).json({
//     success: true,
//     message: "TubeX backend is running",
//   });
// });