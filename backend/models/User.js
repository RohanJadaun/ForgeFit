const mongoose = require("mongoose");


const userSchema = new mongoose.Schema(

  {

    fullName: {

      type: String,

      required: [true, "Full name is required"],

      trim: true,

    },


    email: {

      type: String,

      required: [true, "Email is required"],

      unique: true,

      lowercase: true,

      trim: true,

    },


    password: {

      type: String,

      required: [true, "Password is required"],

      minlength: 8,
      maxlength: 128,
      select: false,

    },

    passwordResetToken: { type: String, select: false },
    passwordResetExpires: { type: Date, select: false },

    googleId: { type: String, unique: true, sparse: true, select: false },
    githubId: { type: String, unique: true, sparse: true, select: false },


    profileImage: {

      type: String,

      default: "",

    },


    role: {

      type: String,

      enum: ["user", "admin"],

      default: "user",

    },


    // NEW FITNESS PROFILE DATA

    fitnessProfile: {

      age: {

        type: Number,

        default: 0,

      },


      height: {

        type: Number,

        default: 0,

      },


      goal: {

        type: String,

        default: "Fitness",

      },


      level: {

        type: String,

        enum: [
          "Beginner",
          "Intermediate",
          "Advanced",
        ],

        default: "Beginner",

      },


    },


  },

  {

    timestamps:true,

  }

);


module.exports = mongoose.model("User", userSchema);
