const mongoose = require("mongoose");


const profileSchema = new mongoose.Schema(
{
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
        unique:true
    },


    age:{
        type:Number,
        default:0
    },


    gender:{
        type:String,
        enum:[
            "Male",
            "Female",
            "Other"
        ]
    },


    height:{
        type:Number,
        default:0
    },


    weight:{
        type:Number,
        default:0
    },


    goal:{
        type:String,
        enum:[
            "Weight Loss",
            "Muscle Gain",
            "Maintenance"
        ],
        default:"Maintenance"
    },


    level:{
        type:String,
        enum:[
            "Beginner",
            "Intermediate",
            "Advanced"
        ],
        default:"Beginner"
    },


    activityLevel:{
        type:String,
        default:"Moderate"
    }

},
{
    timestamps:true
}
);


module.exports =
mongoose.model("Profile",profileSchema);