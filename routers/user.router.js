const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const { whichUpload } = require("../helpers/imageStorage");

//regitser of user
router.post("/register", userController.Register);

//login of user
router.post("/login", userController.login);

//get all students
router.get("/students", userController.getAllStudents);

//get all Researchers
router.get("/researchers", userController.getAllResearchers);

//get all notification of user by token
router.get("/notifications", userController.getAllNotificationByToken);

// get user by token
router.get("/token/user", userController.getUserByToken);

//edit profile
router.put(
    "/profile/edit",
    whichUpload.single("image"),
    userController.updateProfile
  );

module.exports = router;
