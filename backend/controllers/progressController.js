const Progress = require("../models/Progress");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");

// CREATE PROGRESS
exports.createProgress = asyncHandler(async (req, res) => {
  const { date, weight, bodyFat, muscleMass, bmi, fitnessScore, progressNote } = req.body;
  const progress = await Progress.create({
    date, weight, bodyFat, muscleMass, bmi, fitnessScore, progressNote,
    user: req.user._id,
  });

  res.status(201).json({
    success: true,
    progress,
  });
});

// GET ALL PROGRESS
exports.getProgresses = asyncHandler(async (req, res) => {
  const progresses = await Progress.find({
    user: req.user._id,
  }).sort({ date: -1 });

  res.status(200).json({
    success: true,
    count: progresses.length,
    progresses,
  });
});

// GET SINGLE PROGRESS
exports.getProgress = asyncHandler(async (req, res, next) => {
  const progress = await Progress.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!progress) {
    return next(new AppError("Progress record not found", 404));
  }

  res.status(200).json({
    success: true,
    progress,
  });
});

// UPDATE PROGRESS
exports.updateProgress = asyncHandler(async (req, res, next) => {
  const allowedFields = ["date", "weight", "bodyFat", "muscleMass", "bmi", "fitnessScore", "progressNote"];
  const updates = Object.fromEntries(Object.entries(req.body).filter(([key]) => allowedFields.includes(key)));
  const progress = await Progress.findOneAndUpdate(
    {
      _id: req.params.id,
      user: req.user._id,
    },
    updates,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!progress) {
    return next(new AppError("Progress record not found", 404));
  }

  res.status(200).json({
    success: true,
    progress,
  });
});

// DELETE PROGRESS
exports.deleteProgress = asyncHandler(async (req, res, next) => {
  const progress = await Progress.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!progress) {
    return next(new AppError("Progress record not found", 404));
  }

  await progress.deleteOne();

  res.status(200).json({
    success: true,
    message: "Progress record deleted successfully",
  });
});

// 🔥 NEW: GET LATEST PROGRESS (FIX FOR YOUR ERROR)
exports.getLatestProgress = asyncHandler(async (req, res) => {
  const latestProgress = await Progress.findOne({
    user: req.user._id,
  }).sort({ date: -1 });

  res.status(200).json({
    success: true,
    latestProgress,
  });
});
