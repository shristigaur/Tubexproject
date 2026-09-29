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
app.disable("x-powered-by");
app.use(helmet());
app.use(cors({ origin: env.FRONTEND_URL, credentials: true }));
app.use(express.json({ limit: "20kb" }));
app.use(express.urlencoded({ extended: false, limit: "20kb" }));
app.use(cookieParser());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 100, standardHeaders: "draft-7", legacyHeaders: false }));


app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "TubeX backend is running",
  });
});
app.use("/api", publicRoutes);
app.use(
  "/api/auth",
  authRoutes
);
app.use(notFound);
app.use(errorHandler);

// app.get("/api/health", (_req, res) => {
//   res.status(200).json({
//     success: true,
//     message: "TubeX backend is running",
//   });
// });