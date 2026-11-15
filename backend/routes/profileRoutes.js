const express = require("express");

const {
    getProfile,
    createProfile,
    updateProfile
} = require("../controllers/profileController");


const {
    protect
} = require("../middleware/authMiddleware");


const router = express.Router();


router.use(protect);



router.route("/")
.get(getProfile)
.post(createProfile)
.put(updateProfile);



module.exports = router;