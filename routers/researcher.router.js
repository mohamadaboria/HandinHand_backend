const express = require("express");
const router = express.Router();
const researcherController = require("../controllers/researcher.controller");
const { whichUpload } = require("../helpers/imageStorage");

//create new Research
router.post(
  "/research/create",
  whichUpload.single("approvment"),
  researcherController.createResearch
);

// get All Researches of researcher by token
router.get("/user/researchs", researcherController.getAllResearchesOfUser);

// get all researchs based algorithm at leaset half or more items acheived
router.get(
  "/researchs/filter",
  researcherController.getAllResearchsbasedAlgorithm
);

//accept of reject the request student who register the research
router.put(
  "/research/student/status",
  researcherController.changeResearchStatusofStudent
);

//get All accepted student in all researches
router.get(
  "/students/accepted",
  researcherController.getAllAcceptedStudentsResearchesOfUser
);

// get All Researches of researcher by researcher id
router.get(
  "/researcher/researches/:id",
  researcherController.getAllResearchesOfResearcher
);

module.exports = router;
