import { env } from "./env.js";

export function validateGoogleConfig() {
  if (process.env.NODE_ENV !== "production") {
    console.log("=========================================");
    console.log("TubeX Google OAuth configuration:");
    console.log("");
    console.log("Frontend (JavaScript Origin):");
    console.log(env.FRONTEND_URL || "NOT CONFIGURED");
    console.log("");
    console.log("Backend:");
    console.log(`http://localhost:${env.PORT || 5000}`);
    console.log("");
    console.log("Google Client:");
    console.log(process.env.GOOGLE_CLIENT_ID ? "configured" : "MISSING");
    console.log("");
    console.log("Google Secret:");
    console.log(process.env.GOOGLE_CLIENT_SECRET ? "configured" : "MISSING");
    console.log("=========================================");
    
    if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
      console.warn("⚠️ WARNING: Google OAuth configuration is incomplete. Authentication will fail.");
    }
  }
}
