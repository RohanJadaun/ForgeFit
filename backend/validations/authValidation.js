const { body } = require("express-validator");

exports.registerValidation = [
    body("fullName")
        .trim()
        .notEmpty()
        .withMessage("Full name is required")
        .isLength({ min: 3 })
        .withMessage("Full name must be at least 3 characters"),

    body("email")
        .trim()
        .isEmail()
        .withMessage("Please enter a valid email"),

    body("password")
        .isLength({ min: 8, max: 72 })
        .withMessage("Password must be between 8 and 72 characters")
        .bail()
        .custom((value) => Buffer.byteLength(value, "utf8") <= 72)
        .withMessage("Password must be 72 bytes or fewer"),
];

exports.loginValidation = [
    body("email")
        .trim()
        .isEmail()
        .withMessage("Please enter a valid email"),

    body("password")
        .notEmpty()
        .withMessage("Password is required"),
];

exports.forgotPasswordValidation = [
    body("email").trim().isEmail().withMessage("Please enter a valid email"),
];

exports.resetPasswordValidation = [
    body("token").isHexadecimal().isLength({ min: 64, max: 64 }).withMessage("A valid reset token is required"),
    body("password").isLength({ min: 8, max: 72 }).withMessage("Password must be between 8 and 72 characters")
        .bail().custom((value) => Buffer.byteLength(value, "utf8") <= 72).withMessage("Password must be 72 bytes or fewer"),
];
