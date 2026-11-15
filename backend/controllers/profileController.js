const Profile = require("../models/Profile");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");


// ===============================
// GET PROFILE
// ===============================
exports.getProfile = asyncHandler(async(req,res,next)=>{


    const profile = await Profile.findOne({
        user:req.user._id
    });



    if(!profile){

        return next(
            new AppError(
                "Profile not found",
                404
            )
        );

    }



    res.status(200).json({

        success:true,

        profile

    });


});




// ===============================
// CREATE PROFILE
// ===============================
exports.createProfile = asyncHandler(async(req,res,next)=>{


    const existingProfile = await Profile.findOne({
        user:req.user._id
    });



    if(existingProfile){

        return next(
            new AppError(
                "Profile already exists",
                400
            )
        );

    }



    const { age, gender, height, weight, goal, level, activityLevel } = req.body;
    const profile = await Profile.create({
        age, gender, height, weight, goal, level, activityLevel,
        user:req.user._id
    });



    res.status(201).json({

        success:true,

        profile

    });


});




// ===============================
// UPDATE PROFILE
// ===============================
exports.updateProfile = asyncHandler(async(req,res,next)=>{
    const allowedFields = ["age", "gender", "height", "weight", "goal", "level", "activityLevel"];
    const updates = Object.fromEntries(Object.entries(req.body).filter(([key]) => allowedFields.includes(key)));


    const profile = await Profile.findOneAndUpdate(

        {
            user:req.user._id
        },

        updates,

        {
            new:true,
            runValidators:true
        }

    );



    if(!profile){

        return next(
            new AppError(
                "Profile not found",
                404
            )
        );

    }



    res.status(200).json({

        success:true,

        profile

    });


});
