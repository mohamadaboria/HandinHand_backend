const express = require("express");
const router = express.Router();
const researcherController = require("../controllers/researcher.controller");

//create new Research
router.post("/", researcherController.createResearch);

module.exports = router;
