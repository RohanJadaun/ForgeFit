const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const providerConfig = {
  google: {
    clientId: () => process.env.GOOGLE_CLIENT_ID,
    clientSecret: () => process.env.GOOGLE_CLIENT_SECRET,
    callbackPath: "/api/auth/oauth/google/callback",
  },
  github: {
    clientId: () => process.env.GITHUB_CLIENT_ID,
    clientSecret: () => process.env.GITHUB_CLIENT_SECRET,
    callbackPath: "/api/auth/oauth/github/callback",
  },
};

const isConfigured = (provider) => Boolean(
  providerConfig[provider]?.clientId()
  && providerConfig[provider]?.clientSecret()
  && process.env.API_PUBLIC_URL,
);

const callbackUrl = (provider) => (
  `${process.env.API_PUBLIC_URL.replace(/\/$/, "")}${providerConfig[provider].callbackPath}`
);

const frontendUrl = () => process.env.CLIENT_URL.split(",")[0].trim().replace(/\/$/, "");

const oauthErrorRedirect = (res, reason = "failed") => (
  res.redirect(`${frontendUrl()}/login?oauth_error=${encodeURIComponent(reason)}`)
);

const setStateCookie = (res, provider, state) => {
  res.cookie(`oauth_${provider}_state`, state, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 10 * 60 * 1000,
  });
};

const clearStateCookie = (res, provider) => {
  res.clearCookie(`oauth_${provider}_state`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
};

const startOAuth = (provider) => (req, res) => {
  if (!isConfigured(provider)) return oauthErrorRedirect(res, "not_configured");

  const state = crypto.randomBytes(32).toString("hex");
  setStateCookie(res, provider, state);
  const authorizeUrl = provider === "google"
    ? new URL("https://accounts.google.com/o/oauth2/v2/auth")
    : new URL("https://github.com/login/oauth/authorize");
  authorizeUrl.search = new URLSearchParams({
    client_id: providerConfig[provider].clientId(),
    redirect_uri: callbackUrl(provider),
    response_type: "code",
    scope: provider === "google" ? "openid email profile" : "read:user user:email",
    state,
  }).toString();
  if (provider === "google") authorizeUrl.searchParams.set("prompt", "select_account");
  return res.redirect(authorizeUrl.toString());
};

const assertOAuthState = (req, res, provider) => {
  const provided = req.query.state;
  const expected = req.cookies?.[`oauth_${provider}_state`];
  clearStateCookie(res, provider);
  if (typeof provided !== "string" || typeof expected !== "string") return false;
  const providedBuffer = Buffer.from(provided);
  const expectedBuffer = Buffer.from(expected);
  return providedBuffer.length === expectedBuffer.length
    && crypto.timingSafeEqual(providedBuffer, expectedBuffer);
};

const fetchJson = async (url, options) => {
  const response = await fetch(url, { ...options, signal: AbortSignal.timeout(12000) });
  if (!response.ok) throw new Error(`OAuth provider returned ${response.status}`);
  return response.json();
};

const exchangeCode = async (provider, code) => {
  if (provider === "google") {
    return fetchJson("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: providerConfig.google.clientId(),
        client_secret: providerConfig.google.clientSecret(),
        redirect_uri: callbackUrl("google"),
        grant_type: "authorization_code",
      }),
    });
  }
  return fetchJson("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify({
      code,
      client_id: providerConfig.github.clientId(),
      client_secret: providerConfig.github.clientSecret(),
      redirect_uri: callbackUrl("github"),
    }),
  });
};

const fetchProviderProfile = async (provider, accessToken) => {
  if (provider === "google") {
    const profile = await fetchJson("https://openidconnect.googleapis.com/v1/userinfo", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!profile.sub || !profile.email || profile.email_verified !== true) {
      throw new Error("Google account has no verified email address");
    }
    return {
      id: profile.sub,
      email: profile.email,
      fullName: profile.name || profile.email.split("@")[0],
      profileImage: profile.picture || "",
    };
  }

  const headers = {
    Authorization: `Bearer ${accessToken}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  const [profile, emails] = await Promise.all([
    fetchJson("https://api.github.com/user", { headers }),
    fetchJson("https://api.github.com/user/emails", { headers }),
  ]);
  const email = emails.find((entry) => entry.primary && entry.verified)?.email;
  if (!profile.id || !email) throw new Error("GitHub account has no verified primary email address");
  return {
    id: String(profile.id),
    email,
    fullName: profile.name || profile.login || email.split("@")[0],
    profileImage: profile.avatar_url || "",
  };
};

const findOrCreateUser = async (provider, profile) => {
  const accountField = provider === "google" ? "googleId" : "githubId";
  let user = await User.findOne({ [accountField]: profile.id });
  if (user) return user;

  const normalizedEmail = profile.email.trim().toLowerCase();
  const existingUser = await User.findOne({ email: normalizedEmail });
  if (existingUser) {
    const error = new Error("An account already uses this email. Sign in with that method first.");
    error.code = "ACCOUNT_EXISTS";
    throw error;
  }

  const password = await bcrypt.hash(crypto.randomBytes(48).toString("hex"), 12);
  return User.create({
    fullName: profile.fullName.trim().slice(0, 100),
    email: normalizedEmail,
    password,
    profileImage: profile.profileImage,
    [accountField]: profile.id,
  });
};

const finishOAuth = (provider) => async (req, res) => {
  if (!isConfigured(provider)) return oauthErrorRedirect(res, "not_configured");
  if (req.query.error) return oauthErrorRedirect(res, "cancelled");
  if (!assertOAuthState(req, res, provider) || typeof req.query.code !== "string") {
    return oauthErrorRedirect(res, "invalid_state");
  }

  try {
    const token = await exchangeCode(provider, req.query.code);
    if (!token.access_token) return oauthErrorRedirect(res);
    const profile = await fetchProviderProfile(provider, token.access_token);
    const user = await findOrCreateUser(provider, profile);
    const sessionToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.cookie("token", sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return res.redirect(`${frontendUrl()}/dashboard`);
  } catch (error) {
    console.error(`${provider} sign-in failed:`, error.message);
    return oauthErrorRedirect(res, error.code === "ACCOUNT_EXISTS" ? "account_exists" : "failed");
  }
};

exports.getOAuthProviders = (req, res) => {
  res.json({
    success: true,
    providers: {
      google: isConfigured("google"),
      github: isConfigured("github"),
    },
  });
};

exports.startGoogleOAuth = startOAuth("google");
exports.startGithubOAuth = startOAuth("github");
exports.finishGoogleOAuth = finishOAuth("google");
exports.finishGithubOAuth = finishOAuth("github");
