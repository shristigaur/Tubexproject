import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function run() {
  const user = await prisma.user.findUnique({ where: { email: "test99@navgurukul.org" } });
  if (!user) throw new Error("User not found");

  await prisma.verificationToken.deleteMany({ where: { userId: user.id } });

  const codeHash = await bcrypt.hash("123456", 12);
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + 10);

  await prisma.verificationToken.create({
    data: {
      userId: user.id,
      codeHash,
      expiresAt,
    }
  });
  console.log("Inserted valid OTP 123456");
}
run();
