const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");

//regitser of user
router.post("/register", userController.Register);

//login of user
router.post("/login", userController.login);

//get all students
router.get("/students", userController.getAllStudents);

//get all Researchers
router.get("/researchers", userController.getAllResearchers);

module.exports = router;
