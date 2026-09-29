import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  try {
    await prisma.$runCommandRaw({ dropIndexes: "User", index: "User_googleId_key" });
    console.log("Index dropped");
  } catch (e) {
    console.error("Error dropping index:", e);
  }
}
main().finally(() => prisma.$disconnect());
