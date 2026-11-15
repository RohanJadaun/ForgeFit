const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  type: { type: String, enum: ["user", "ai"], required: true },
  text: { type: String, required: true, maxlength: 4000 },
  createdAt: { type: Date, default: Date.now },
}, { _id: false });

const conversationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  messages: { type: [messageSchema], default: [] },
}, { timestamps: true });

module.exports = mongoose.model("CoachConversation", conversationSchema);
