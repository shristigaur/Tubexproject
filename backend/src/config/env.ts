import "dotenv/config";
import { z } from "zod";

const schema = z.object({
 NODE_ENV:z.enum(["development","test","production"]).default("development"),
 PORT:z.coerce.number().int().positive().default(5000),
 FRONTEND_URL:z.string().url().optional(),
 CLIENT_URL:z.string().url().optional(),
 DATABASE_URL:z.string().min(1),
 FORMSPREE_FORM_ID:z.string().min(1).optional(),
 TEST_EMAIL_TO:z.string().email().optional(),
}).refine(data => {
  return true;
}, { message: "Configuration validation failed" });

export const env=schema.parse(process.env);

