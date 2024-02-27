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

// get All Research of research by token
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

module.exports = router;
