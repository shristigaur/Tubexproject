import { Router } from "express";
import rateLimit from "express-rate-limit";

import {
  signup,
  login,
  googleAuth,
  logout,
  getMe,
} from "../controllers/auth.controller.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();



router.post("/signup", signup);
router.post("/login", login);
router.post("/google", googleAuth);
router.post("/logout", logout);



router.get("/me", requireAuth, getMe);

export default router;