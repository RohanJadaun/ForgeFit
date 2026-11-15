const bcrypt = require("bcryptjs");
const User = require("../models/User");

const sendToken = require("../utils/sendToken");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");
const crypto = require("crypto");

// ==========================
// Register User

const registerUser = asyncHandler(async (req, res, next) => {
  const {
    fullName,
    email,
    password,
    age,
    height,
    goal,
    level,
  } = req.body;
  const normalizedEmail = email.trim().toLowerCase();

  // Check existing user
  const existingUser = await User.findOne({ email: normalizedEmail });

  if (existingUser) {
    return next(new AppError("User already exists.", 400));
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 12);

  // Create user
const user = await User.create({

    fullName,

    email: normalizedEmail,

    password: hashedPassword,

    fitnessProfile: {
        age,
        height,
        goal,
        level,
    },

});

  return sendToken(user, 201, res, "User registered successfully.");
});

// ==========================
// Login User

const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password, remember } = req.body;

  // Find user
  const user = await User.findOne({ email: email.trim().toLowerCase() }).select("+password");

  if (!user) {
    return next(new AppError("Invalid email or password.", 400));
  }

  // Compare password
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return next(new AppError("Invalid email or password.", 400));
  }

  return sendToken(user, 200, res, "Login successful.", { remember: remember === true });
});

// ==========================
// Get Current User

const getCurrentUser = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
});

// ==========================
// Logout User

const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("token", "", {
    expires: new Date(0),
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully.",
  });
});

const requestPasswordReset = asyncHandler(async (req, res, next) => {
  if (!process.env.RESEND_API_KEY || !process.env.EMAIL_FROM) {
    return next(new AppError("Password reset email is not configured. Set RESEND_API_KEY and EMAIL_FROM.", 503));
  }
  const user = await User.findOne({ email: req.body.email.toLowerCase() });
  if (!user) {
    return res.json({ success: true, message: "If an account exists for that address, a reset link has been sent." });
  }
  const token = crypto.randomBytes(32).toString("hex");
  user.passwordResetToken = crypto.createHash("sha256").update(token).digest("hex");
  user.passwordResetExpires = Date.now() + 30 * 60 * 1000;
  await user.save({ validateBeforeSave: false });

  const frontendUrl = (process.env.CLIENT_URL || "").split(",")[0].trim();
  const resetUrl = `${frontendUrl.replace(/\/$/, "")}/reset-password?token=${token}`;
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM,
        to: [user.email],
        subject: "Reset your ForgeFit password",
        text: `Use this link to reset your password within 30 minutes: ${resetUrl}\n\nIf you did not request this, you can ignore this email.`,
      }),
      signal: AbortSignal.timeout(15000),
    });
    if (!response.ok) throw new Error(`Email provider returned ${response.status}`);
  } catch (error) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    console.error("Password reset email could not be sent:", error.message);
    return next(new AppError("Could not send the password reset email. Please try again later.", 502));
  }
  res.json({ success: true, message: "If an account exists for that address, a reset link has been sent." });
});

const resetPassword = asyncHandler(async (req, res, next) => {
  const resetToken = crypto.createHash("sha256").update(req.body.token).digest("hex");
  const user = await User.findOne({ passwordResetToken: resetToken, passwordResetExpires: { $gt: Date.now() } })
    .select("+passwordResetToken +passwordResetExpires");
  if (!user) return next(new AppError("This reset link is invalid or expired. Request a new one.", 400));
  user.password = await bcrypt.hash(req.body.password, 12);
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  res.json({ success: true, message: "Password reset successfully. You can now log in." });
});

module.exports = {
  registerUser,
  loginUser,
  getCurrentUser,
  logoutUser,
  requestPasswordReset,
  resetPassword,
};
