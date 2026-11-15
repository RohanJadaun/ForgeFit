const express = require("express");

const {
  getReadiness,
  getRecovery,
  getWeeklyPlan,
  getCoachChat,
  clearCoachChat,
  chatCoach,
} = require("../controllers/aiController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();
const rateLimit = require("../middleware/rateLimit");

// protect all AI routes
router.use(protect);

//
// 🟢 AI ROUTES
//
router.get("/readiness", getReadiness);
router.get("/recovery", getRecovery);
router.get("/weekly-plan", getWeeklyPlan);
router.get("/chat", getCoachChat);
router.delete("/chat", clearCoachChat);
router.post("/chat", rateLimit({ windowMs: 60 * 1000, max: 20, message: "Too many coach messages. Please wait a moment." }), chatCoach);

module.exports = router;
