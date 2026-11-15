const generateToken = require("./generateToken");

const sendToken = (user, statusCode, res, message, { remember = true } = {}) => {
  const token = generateToken(user._id, remember);

  res
    .status(statusCode)
    .cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite:
process.env.NODE_ENV==="production"
?"none"
:"lax",
      ...(remember ? { maxAge: 7 * 24 * 60 * 60 * 1000 } : {}),
    })
    .json({
      success: true,
      message,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        profileImage: user.profileImage,
        role: user.role,
        fitnessProfile: user.fitnessProfile,
      },
    });
};

module.exports = sendToken;
