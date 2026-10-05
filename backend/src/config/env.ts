import "dotenv/config";
import { z } from "zod";

const schema = z.object({
 NODE_ENV:z.enum(["development","test","production"]).default("development"),
 PORT:z.coerce.number().int().positive().default(5000),
 FRONTEND_URL:z.string().url(),
 DATABASE_URL:z.string().min(1),
 SMTP_HOST:z.string().min(1),
 SMTP_PORT:z.coerce.number().int().positive(),
 SMTP_USER:z.string().min(1),
 SMTP_PASS:z.string().min(1),
 SMTP_FROM:z.string().min(1),
 TEST_EMAIL_TO:z.string().email().optional(),
}).refine(data => {
  return true;
}, { message: "Configuration validation failed" });

export const env=schema.parse(process.env);

