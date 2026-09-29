import { Router } from "express";
import rateLimit from "express-rate-limit";

import {
  signup,
  login,
  googleAuth,
  logout,
  firebaseLogin,
  getMe,
  forgotPassword,
  verifyResetOTP,
  resetPassword,
} from "../controllers/auth.controller.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

const otpRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Too many requests from this IP, please try again after 15 minutes",
  standardHeaders: true,
  legacyHeaders: false,
});

router.post("/signup", signup);
router.post("/login", login);
router.post("/google", googleAuth);
router.post("/logout", logout);

router.post("/firebase-login", otpRateLimiter, firebaseLogin);

router.post("/forgot-password", otpRateLimiter, forgotPassword);
router.post("/verify-reset-otp", otpRateLimiter, verifyResetOTP);
router.post("/reset-password", otpRateLimiter, resetPassword);

router.get("/me", requireAuth, getMe);

export default router;