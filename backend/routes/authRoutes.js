const express = require("express");

const {
    registerUser,
    loginUser,
    getCurrentUser,
    logoutUser,
    requestPasswordReset,
    resetPassword,
} = require("../controllers/authController");

const { protect } = require("../middleware/authMiddleware");
const {
    getOAuthProviders,
    startGoogleOAuth,
    startGithubOAuth,
    finishGoogleOAuth,
    finishGithubOAuth,
} = require("../controllers/oauthController");

const validate = require("../middleware/validationMiddleware");

const {
    registerValidation,
    loginValidation,
    forgotPasswordValidation,
    resetPasswordValidation,
} = require("../validations/authValidation");

const router = express.Router();
const rateLimit = require("../middleware/rateLimit");
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10, message: "Too many authentication attempts. Please try again later." });
const resetLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 5, message: "Too many password reset requests. Please try again later." });

router.get("/oauth/providers", getOAuthProviders);
router.get("/oauth/google", authLimiter, startGoogleOAuth);
router.get("/oauth/google/callback", authLimiter, finishGoogleOAuth);
router.get("/oauth/github", authLimiter, startGithubOAuth);
router.get("/oauth/github/callback", authLimiter, finishGithubOAuth);

router.post(
    "/register",
    authLimiter,
    registerValidation,
    validate,
    registerUser
);

router.post("/forgot-password", resetLimiter, forgotPasswordValidation, validate, requestPasswordReset);
router.post("/reset-password", resetLimiter, resetPasswordValidation, validate, resetPassword);

router.post(
    "/login",
    authLimiter,
    loginValidation,
    validate,
    loginUser
);

router.get("/me", protect, getCurrentUser);

router.post("/logout", logoutUser);

module.exports = router;
