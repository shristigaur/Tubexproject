import { Router } from "express";
import rateLimit from "express-rate-limit";

import {
  signup,
  login,
  googleAuth,
  logout,
  getMe,
  sendOtp,
  verifyOtp,
  forgotPassword,
  verifyResetOtp,
  resetPassword,
} from "../controllers/auth.controller.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

const resetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 5,
  message: "Too many reset attempts, please try again later.",
  standardHeaders: "draft-7",
  legacyHeaders: false,
});

router.post("/signup", signup);
router.post("/login", login);
router.post("/google", googleAuth);
router.post("/logout", logout);

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);

router.post("/forgot-password", resetLimiter, forgotPassword);
router.post("/verify-reset-otp", resetLimiter, verifyResetOtp);
router.post("/reset-password", resetLimiter, resetPassword);

router.get("/me", requireAuth, getMe);

export default router;