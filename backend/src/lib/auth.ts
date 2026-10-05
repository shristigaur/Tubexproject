import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const ACCESS_TOKEN_EXPIRES = "15m";

const REFRESH_TOKEN_EXPIRES_DAYS = 7;

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function comparePassword(
  password: string,
  passwordHash: string
) {
  return bcrypt.compare(password, passwordHash);
}

export function createAccessToken(userId: string) {
  return jwt.sign(
    {
      sub: userId,
    },
    process.env.JWT_ACCESS_SECRET!,
    {
      expiresIn: ACCESS_TOKEN_EXPIRES,
    }
  );
}

export function createRefreshToken() {
  return crypto.randomBytes(64).toString("hex");
}

export function hashToken(token: string) {
  return crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
}

export function getRefreshTokenExpiry() {
  const date = new Date();

  date.setDate(date.getDate() + REFRESH_TOKEN_EXPIRES_DAYS);

  return date;
}

export function verifyAccessToken(token: string) {
  const payload = jwt.verify(
    token,
    process.env.JWT_ACCESS_SECRET!
  ) as {
    sub: string;
    type?: string;
  };
  
  if (payload.type === "OTP") {
    throw new Error("Invalid access token");
  }
  
  return payload;
}

export function createOtpToken(userId: string) {
  return jwt.sign(
    { sub: userId, type: "OTP" },
    process.env.JWT_ACCESS_SECRET!,
    { expiresIn: "15m" }
  );
}

export function verifyOtpToken(token: string) {
  const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as { sub: string, type: string };
  if (payload.type !== "OTP") throw new Error("Invalid token type");
  return payload;
}