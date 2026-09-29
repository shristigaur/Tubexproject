import "dotenv/config";
import { z } from "zod";

const schema = z.object({
 NODE_ENV:z.enum(["development","test","production"]).default("development"),
 PORT:z.coerce.number().int().positive().default(5000),
 FRONTEND_URL:z.string().url(),
 DATABASE_URL:z.string().min(1),
  FIREBASE_PROJECT_ID: z.string().min(1),
  FIREBASE_CLIENT_EMAIL: z.string().email(),
  FIREBASE_PRIVATE_KEY: z.string().min(1),
}).refine(data => {
  return true;
}, { message: "Configuration validation failed" });

export const env=schema.parse(process.env);

