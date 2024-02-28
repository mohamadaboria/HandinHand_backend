const express = require("express");
const router = express.Router();
const studentController = require("../controllers/student.controller");

//student register to rersearch
router.put("/research/register", studentController.registerResearch);

//get all researches based status of user
router.get("/student/researches", studentController.getmyResearches);

module.exports = router;
