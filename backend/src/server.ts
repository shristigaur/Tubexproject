import { app } from "./app.js";
import { env } from "./config/env.js";
import { prisma } from "./lib/prisma.js";
import { validateGoogleConfig } from "./config/google.js";
import { verifyMailConnection } from "./services/mail.service.js";

validateGoogleConfig();
verifyMailConnection();

const server = app.listen(env.PORT, "0.0.0.0", () => console.log(`TubeX API running on port ${env.PORT}`));
const shutdown=async()=>{server.close();await prisma.$disconnect();process.exit(0)};
process.on("SIGINT",shutdown);process.on("SIGTERM",shutdown);
