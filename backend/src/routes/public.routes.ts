import { Router } from "express";
import { featuredChannels, health, subscribe, newsletterSchema } from "../controllers/public.controller.js";
import { validate } from "../middleware/validate.js";
const router=Router();
router.get("/health",health);
router.get("/channels/featured",featuredChannels);
router.post("/newsletter",validate(newsletterSchema),subscribe);
export default router;
