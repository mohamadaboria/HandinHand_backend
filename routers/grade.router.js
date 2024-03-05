const express = require("express");
const router = express.Router();
const gradeController = require("../controllers/grade.controller");

//add grade to student
router.post("/user", gradeController.addGrdeToStudent);

module.exports = router;
