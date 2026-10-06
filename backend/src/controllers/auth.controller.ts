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
  createOtpToken,
  verifyOtpToken,
} from "../lib/auth.js";
import { generateAndSendOtp } from "../services/otp.service.js";

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

    const { name, password } = result.data;
    const email = result.data.email.toLowerCase();

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

    await generateAndSendOtp({ id: user.id, email: user.email });

    return res.status(201).json({
      success: true,
      message: "User created successfully. Please verify your email.",
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

    const { password } = result.data;
    const email = result.data.email.toLowerCase();

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



    // Set pending OTP state
    const otpToken = createOtpToken(user.id);
    const isProduction = process.env.NODE_ENV === "production";
    
    res.cookie("otp_token", otpToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 15 * 60 * 1000, // 15 mins
      path: "/api/auth",
    });

    await generateAndSendOtp({ id: user.id, email: user.email });

    return res.status(200).json({
      requiresOtp: true,
      message: "Please verify your email",
      email: user.email,
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



    if (user.emailVerified) {
      const accessToken = createAccessToken(user.id);
      const refreshToken = await createSession(user.id, req);
      setAuthCookies(res, accessToken, refreshToken);

      return res.status(200).json({
        success: true,
        message: "Logged in successfully.",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });
    }

    await generateAndSendOtp({ id: user.id, email: user.email });

    return res.status(200).json({
      requiresOtp: true,
      message: "Please verify your email",
      email: user.email,
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
// SEND OTP
// ==========================================

export async function sendOtp(req: Request, res: Response) {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required." });

    const user = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
      select: { id: true, email: true },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Rate limiting: prevent spamming
    const lastToken = await prisma.verificationToken.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    if (lastToken) {
      const timeSinceLastOtp = Date.now() - lastToken.createdAt.getTime();
      const cooldownMs = 60 * 1000; // 1 minute cooldown
      if (timeSinceLastOtp < cooldownMs) {
        return res.status(429).json({ 
          message: "Please wait before requesting another code." 
        });
      }
    }

    await generateAndSendOtp({ id: user.id, email: user.email });

    return res.status(200).json({
      success: true,
      message: "Verification code sent to your email",
    });
  } catch (error) {
    // Note: Do not log the OTP or sensitive data here, only the generic error
    console.error("Send OTP error:", error);
    return res.status(500).json({ message: "Failed to send verification code." });
  }
}

// ==========================================
// VERIFY OTP
// ==========================================

export async function verifyOtp(req: Request, res: Response) {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required." });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const tokenRecord = await prisma.verificationToken.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    if (!tokenRecord || tokenRecord.verified || tokenRecord.expiresAt < new Date()) {
      return res.status(400).json({ message: "Invalid or expired code" });
    }

    if (tokenRecord.attempts >= 5) {
      return res.status(400).json({ message: "Too many failed attempts. Please request a new code." });
    }

    const isValid = await comparePassword(otp.toString(), tokenRecord.codeHash);

    if (!isValid) {
      await prisma.verificationToken.update({
        where: { id: tokenRecord.id },
        data: { attempts: { increment: 1 } },
      });
      return res.status(400).json({ message: "Invalid or expired code" });
    }

    // Success! Mark as verified
    await prisma.verificationToken.update({
      where: { id: tokenRecord.id },
      data: { verified: true },
    });

    // Fully verify the user
    await prisma.user.update({
      where: { id: user.id },
      data: { emailVerified: true },
    });

    // Clear otp_token
    res.clearCookie("otp_token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/api/auth"
    });

    // Grant full session
    const accessToken = createAccessToken(user.id);
    const refreshToken = await createSession(user.id, req);
    setAuthCookies(res, accessToken, refreshToken);

    return res.status(200).json({
      success: true,
      message: "Verification successful!",
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    console.error("Verify OTP error:", error);
    return res.status(500).json({ message: "Failed to verify code." });
  }
}

// ==========================================
// FORGOT PASSWORD
// ==========================================

export async function forgotPassword(req: Request, res: Response) {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    const emailLower = email.trim().toLowerCase();
    
    // Fire and forget background execution to prevent timing attacks
    const successMessage = "If this email is registered, an OTP has been sent";
    res.status(200).json({ success: true, message: successMessage });

    setImmediate(async () => {
      try {
        const user = await prisma.user.findUnique({
          where: { email: emailLower }
        });

        if (!user) return;

        const now = new Date();
        if (user.resetOtpLastSentAt) {
          const timeSinceLastSent = now.getTime() - user.resetOtpLastSentAt.getTime();
          if (timeSinceLastSent < 60000) {
            return;
          }
        }

        const { randomInt } = await import("crypto");
        const otp = randomInt(100000, 1000000).toString();
        const otpHash = await hashPassword(otp);
        
        const expires = new Date(now.getTime() + 10 * 60000); // 10 minutes

        await prisma.user.update({
          where: { id: user.id },
          data: {
            resetOtpHash: otpHash,
            resetOtpExpires: expires,
            resetOtpAttempts: 0,
            resetOtpVerified: false,
            resetOtpLastSentAt: now,
          }
        });

        const { sendEmail } = await import("../services/mail.service.js");
        const htmlBody = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>TubeX Password Reset</h2>
            <p>You requested a password reset. Here is your 6-digit OTP code:</p>
            <div style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0;">
              ${otp}
            </div>
            <p>This code expires in 10 minutes.</p>
            <p style="color: #666; font-size: 12px; margin-top: 30px;">
              If you did not request this email, please ignore it.
            </p>
          </div>
        `;
        await sendEmail({
          to: emailLower,
          subject: "TubeX password reset code",
          html: htmlBody,
        });
      } catch (err) {
        console.error("Background OTP processing error:", err);
      }
    });

  } catch (error) {
    if (!res.headersSent) {
      return res.status(500).json({ message: "Something went wrong." });
    }
  }
}

// ==========================================
// VERIFY RESET OTP
// ==========================================

export async function verifyResetOtp(req: Request, res: Response) {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required." });
    }

    const emailLower = email.trim().toLowerCase();
    const user = await prisma.user.findUnique({
      where: { email: emailLower },
    });

    if (!user || !user.resetOtpHash || !user.resetOtpExpires || user.resetOtpExpires < new Date()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    if (user.resetOtpAttempts >= 5) {
      return res.status(429).json({ message: "Too many attempts, request a new OTP" });
    }

    const isValid = await comparePassword(otp.toString(), user.resetOtpHash);

    if (!isValid) {
      await prisma.user.update({
        where: { id: user.id },
        data: { resetOtpAttempts: { increment: 1 } }
      });
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { resetOtpVerified: true }
    });

    return res.status(200).json({ success: true, message: "OTP verified successfully." });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong." });
  }
}

// ==========================================
// RESET PASSWORD
// ==========================================

export async function resetPassword(req: Request, res: Response) {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: "Email, OTP and new password are required." });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters." });
    }

    const emailLower = email.trim().toLowerCase();
    const user = await prisma.user.findUnique({
      where: { email: emailLower },
    });

    if (!user || !user.resetOtpVerified || !user.resetOtpHash || !user.resetOtpExpires || user.resetOtpExpires < new Date()) {
      return res.status(400).json({ message: "Invalid or expired reset session." });
    }

    const isValid = await comparePassword(otp.toString(), user.resetOtpHash);
    if (!isValid) {
      return res.status(400).json({ message: "Invalid or expired reset session." });
    }

    const newPasswordHash = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: newPasswordHash,
        resetOtpHash: null,
        resetOtpExpires: null,
        resetOtpAttempts: 0,
        resetOtpVerified: false,
        resetOtpLastSentAt: null,
      }
    });

    return res.status(200).json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong." });
  }
}
