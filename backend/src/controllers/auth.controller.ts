import { Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
import { z } from "zod";

import { prisma } from "../lib/prisma.js";
import {
  comparePassword,
  createAccessToken,
  createRefreshToken,
  getRefreshTokenExpiry,
  hashPassword,
  hashToken,
} from "../lib/auth.js";
import { firebaseAuth } from "../config/firebase-admin.js";

// ==========================================
// GOOGLE CLIENT
// ==========================================

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ==========================================
// VALIDATION SCHEMAS
// ==========================================

const signupSchema = z
  .object({
    name: z.string().trim().min(2).max(50),
    email: z.string().trim().email(),
    password: z.string().min(8).max(72),
    confirmPassword: z.string(),
    acceptTerms: z.boolean(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })
  .refine((data) => data.acceptTerms === true, {
    message: "You must accept the Terms and Conditions",
    path: ["acceptTerms"],
  });

const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
});

const firebaseLoginSchema = z.object({
  idToken: z.string().min(1),
});

// ==========================================
// COOKIE HELPER
// ==========================================

function setAuthCookies(
  res: Response,
  accessToken: string,
  refreshToken: string
) {
  const isProduction = process.env.NODE_ENV === "production";

  res.cookie("access_token", accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 15 * 60 * 1000,
    path: "/",
  });

  res.cookie("refresh_token", refreshToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: "/api/auth",
  });
}

// ==========================================
// CREATE SESSION
// ==========================================

async function createSession(userId: string, req: Request) {
  const refreshToken = createRefreshToken();
  const tokenHash = hashToken(refreshToken);

  await prisma.session.create({
    data: {
      userId,
      tokenHash,
      expiresAt: getRefreshTokenExpiry(),
      userAgent: req.headers["user-agent"] ?? null,
      ipAddress: req.ip ?? null,
    },
  });

  return refreshToken;
}

// ==========================================
// SIGNUP
// ==========================================

export async function signup(req: Request, res: Response) {
  try {
    const result = signupSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        message: result.error.issues[0]?.message || "Invalid data",
      });
    }

    const { name, email, password } = result.data;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "An account with this email already exists." });
    }

    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        emailVerified: false,
        role: "USER", // Safe default
      },
    });

    return res.status(201).json({
      success: true,
      message: "User created successfully.",
      email: user.email,
    });
  } catch (error: any) {
    console.error("Signup error:", error);
    return res
      .status(500)
      .json({ message: error.message || "Something went wrong while creating your account." });
  }
}

// ==========================================
// FIREBASE LOGIN (MAGIC LINK)
// ==========================================

export async function firebaseLogin(req: Request, res: Response) {
  try {
    const result = firebaseLoginSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "Invalid token data" });
    }

    const { idToken } = result.data;

    // Verify Firebase ID token using Admin SDK
    const decodedToken = await firebaseAuth.verifyIdToken(idToken);
    
    if (!decodedToken.email) {
      return res.status(400).json({ message: "No email associated with this token" });
    }
    
    const email = decodedToken.email.toLowerCase();

    // Find user in TubeX DB
    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      // Create user if they don't exist (e.g. they only signed up via magic link directly)
      user = await prisma.user.create({
        data: {
          name: decodedToken.name || "TubeX User",
          email,
          emailVerified: true,
          role: "USER",
        },
      });
    } else if (!user.emailVerified) {
      // Mark as verified
      user = await prisma.user.update({
        where: { id: user.id },
        data: { emailVerified: true },
      });
    }

    // Issue TubeX JWTs
    const accessToken = createAccessToken(user.id);
    const refreshToken = await createSession(user.id, req);

    setAuthCookies(res, accessToken, refreshToken);

    return res.status(200).json({
      success: true,
      message: "Authentication successful!",
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error("Firebase login error:", error);
    return res.status(401).json({ message: "Invalid or expired authentication token." });
  }
}

// ==========================================
// LOGIN
// ==========================================

export async function login(req: Request, res: Response) {
  try {
    const result = loginSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        message: result.error.issues[0]?.message || "Invalid data",
      });
    }

    const { email, password } = result.data;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.passwordHash) {
      return res
        .status(401)
        .json({ message: "Invalid email or password." });
    }

    const passwordCorrect = await comparePassword(password, user.passwordHash);
    if (!passwordCorrect) {
      return res
        .status(401)
        .json({ message: "Invalid email or password." });
    }

    if (!user.emailVerified) {
      return res.status(403).json({ message: "Please verify your email first.", unverified: true });
    }

    const accessToken = createAccessToken(user.id);
    const refreshToken = await createSession(user.id, req);

    setAuthCookies(res, accessToken, refreshToken);

    return res.status(200).json({
      message: "Login successful!",
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error("Login error:", error);
    return res
      .status(500)
      .json({ message: "Something went wrong while logging in." });
  }
}

// ==========================================
// GOOGLE LOGIN / SIGNUP
// ==========================================

export async function googleAuth(req: Request, res: Response) {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res
        .status(400)
        .json({ message: "Google credential is required." });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    if (!payload) {
      return res.status(401).json({ message: "Invalid Google account." });
    }

    if (!payload.email || payload.email_verified !== true) {
      return res
        .status(401)
        .json({ message: "Google email could not be verified." });
    }

    const email = payload.email.toLowerCase();

    let user = await prisma.user.findUnique({ where: { email } });
    let isNewUser = false;

    if (!user) {
      user = await prisma.user.create({
        data: {
          name: payload.name || "TubeX User",
          email,
          googleId: payload.sub,
          emailVerified: false, // Explicitly false so they do OTP
          role: "USER", // Default role
        },
      });
      isNewUser = true;
    } else {
      if (!user.googleId) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: {
            googleId: payload.sub,
          }
        });
      } else if (user.googleId !== payload.sub) {
         return res.status(401).json({ message: "Google authentication failed. Please use your original login method." });
      }
    }

    if (!user.emailVerified) {
      return res.status(403).json({ message: "Please verify your email first.", unverified: true });
    }

    const accessToken = createAccessToken(user.id);
    const refreshToken = await createSession(user.id, req);

    setAuthCookies(res, accessToken, refreshToken);

    return res.status(200).json({
      message: "Google authentication successful!",
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });
  } catch (error: any) {
    console.error("Google auth error:", error);
    return res.status(401).json({ message: error.message || "Google authentication failed." });
  }
}

// ==========================================
// LOGOUT
// ==========================================

export async function logout(req: Request, res: Response) {
  try {
    const refreshToken = req.cookies?.refresh_token;

    if (refreshToken) {
      const tokenHash = hashToken(refreshToken);
      await prisma.session.deleteMany({ where: { tokenHash } });
    }

    res.clearCookie("access_token", {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });

    res.clearCookie("refresh_token", {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/api/auth",
    });

    return res.status(200).json({ message: "Logged out successfully." });
  } catch (error) {
    console.error("Logout error:", error);
    return res.status(500).json({ message: "Logout failed." });
  }
}

// ==========================================
// GET ME
// ==========================================

export async function getMe(req: Request, res: Response) {
  try {
    // Note: The auth middleware must set req.userId
    const userId = (req as any).userId;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        emailVerified: true,
        createdAt: true,
        googleId: true,
      }
    });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.status(200).json({ user, success: true });
  } catch (error) {
    console.error("Get me error:", error);
    return res.status(500).json({ message: "Failed to load user profile." });
  }
}

// ==========================================
// FORGOT / RESET PASSWORD
// ==========================================

export async function forgotPassword(req: Request, res: Response) {
  // Not implemented for Firebase replacement yet
  res.status(501).json({ message: "Not Implemented" });
}

export async function verifyResetOTP(req: Request, res: Response) {
  res.status(501).json({ message: "Not Implemented" });
}

export async function resetPassword(req: Request, res: Response) {
  res.status(501).json({ message: "Not Implemented" });
}