const express = require("express");

const {
  getUserProfile,
  updateUserProfile,
  changePassword,
} = require("../controllers/userController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();
const { body } = require("express-validator");
const validate = require("../middleware/validationMiddleware");

router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);
router.put("/password", protect, [
  body("currentPassword").notEmpty().withMessage("Current password is required"),
  body("newPassword").isLength({ min: 8, max: 72 }).withMessage("New password must be between 8 and 72 characters")
    .bail().custom((value) => Buffer.byteLength(value, "utf8") <= 72).withMessage("Password must be 72 bytes or fewer"),
], validate, changePassword);

module.exports = router;
