const { getUserByToken } = require("../helpers/getUserByToken");
const { postImageLocatianSpecify } = require("../helpers/imageStorage");
const { Research } = require("../models/research");
const { User } = require("../models/user");
const { validateCreateResearch } = require("../validations/validators");

//create new research
exports.createResearch = async (req, res, next) => {
  try {
    const { error } = validateCreateResearch(req.body);
    if (error) {
      const errorMessage = error.details.map((detail) => detail.message);
      console.log("errorMessage");
      console.log(errorMessage);
      return res.status(400).json({ message: errorMessage[0] });
    }

    const userByToken = await getUserByToken(req, res);

    // Check if invalid token sent
    if (!userByToken || userByToken.type !== "researcher")
      return res.status(401).json({
        success: false,
        message: "Invalid access token",
      });

    const {
      researchQuestion,
      hand,
      language,
      vision,
      hearingNormal,
      origin,
      ADHD,
      musicalBackground,
      Credits,
      description,
    } = req.body;

    console.log("bpdyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy");
    console.log(req.body);
    console.log("bpdyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy");

    const researchExist = await Research.findOne({ researchQuestion });
    if (researchExist)
      return res.status(400).json({ message: "Research already exists" });

    let path = postImageLocatianSpecify(req);

    console.log("Path");
    console.log(path);

    let research = new Research({
      researher: userByToken._id,
      researchQuestion,
      hand,
      language,
      vision,
      hearingNormal,
      origin,
      ADHD,
      musicalBackground,
      Credits,
      description,
      // approvment: path,
    });

    research = await research.save();
    if (!research) {
      return res
        .status(404)
        .send({ message: "the research cannot be created" });
    }

    return res.status(201).json(research);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Internal Server Error", message: error["message"] });
  }
};

// get All Research of research by token
exports.getAllResearchesOfUser = async (req, res, next) => {
  try {
    const userByToken = await getUserByToken(req, res);
    // Check if invalid token sent
    if (!userByToken || userByToken.type !== "researcher")
      return res.status(401).json({
        success: false,
        message: "Invalid access token",
      });

    const AllResearches = await Research.find({
      researher: userByToken._id,
    }).populate("researher studentsStatus.student", "-password");

    if (!AllResearches) {
      return res.status(404).send({ message: "Internal Server error " });
    }

    return res.status(201).json({ researches: AllResearches });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Internal Server Error", message: error["message"] });
  }
};

// get all researchs based algorithm at leaset half or more items acheived
exports.getAllResearchsbasedAlgorithm = async (req, res, next) => {
  try {
    const userByToken = await getUserByToken(req, res);
    if (!userByToken || userByToken.type !== "student") {
      return res.status(401).json({
        success: false,
        message: "Invalid access token",
      });
    }

    const {
      hand,
      language,
      vision,
      hearingNormal,
      origin,
      ADHD,
      musicalBackground,
    } = userByToken;

    const criteria = {
      hand,
      language,
      vision,
      hearingNormal,
      origin,
      ADHD,
      musicalBackground,
    };

    // Count the number of criteria
    const criteriaCount = Object.values(criteria).filter(
      (value) => value !== undefined && value !== null
    ).length;

    // Construct the aggregation pipeline
    const pipeline = [
      {
        $match: {
          $or: [
            { hand: { $in: [hand] } },
            { language: { $in: [language] } },
            { vision: { $in: [vision] } },
            { hearingNormal: { $in: [hearingNormal] } },
            { origin: { $in: [origin] } },
            { ADHD: { $in: [ADHD] } },
            { musicalBackground: { $in: [musicalBackground] } },
          ],
        },
      },
      {
        $addFields: {
          matchingCriteriaCount: {
            $sum: [
              { $cond: [{ $in: [hand, "$hand"] }, 1, 0] },
              { $cond: [{ $in: [language, "$language"] }, 1, 0] },
              { $cond: [{ $in: [vision, "$vision"] }, 1, 0] },
              { $cond: [{ $in: [hearingNormal, "$hearingNormal"] }, 1, 0] },
              { $cond: [{ $in: [origin, "$origin"] }, 1, 0] },
              { $cond: [{ $in: [ADHD, "$ADHD"] }, 1, 0] },
              {
                $cond: [
                  { $in: [musicalBackground, "$musicalBackground"] },
                  1,
                  0,
                ],
              },
            ],
          },
        },
      },
      {
        $match: {
          matchingCriteriaCount: { $gte: Math.ceil(criteriaCount / 2) },
        },
      },
    ];

    // Execute the aggregation pipeline
    const filteredResearches = await Research.aggregate(pipeline);

    res.json(filteredResearches);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

//accept of reject the request student who register the research
exports.changeResearchStatusofStudent = async (req, res, next) => {
  try {
    const userByToken = await getUserByToken(req, res);
    // Check if invalid token sent
    if (!userByToken || userByToken.type !== "researcher")
      return res.status(401).json({
        success: false,
        message: "Invalid access token",
      });

    const { status, student, research } = req.query;
    if (status !== "accepted" && status !== "rejected")
      return res
        .status(400)
        .send({ message: "status must be accepted or rejected" });
    const studentExist = await User.findById(student);
    if (!studentExist) return res.status(400).send();

    const researchExist = await Research.findById(research);
    if (!researchExist)
      return res.status(400).json({ message: "Research Not found" });

    researchExist.studentsStatus.forEach((el) => {
      if (el.student.toString() === student.toString()) {
        el.status = status;
        el.updateTime = new Date();
      }
    });
    await researchExist.save();

    //send notification for student that accepted or rejected of research

    //return success message
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Internal Server Error", message: error["message"] });
  }
};
