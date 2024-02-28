const { getUserByToken } = require("../helpers/getUserByToken");
const { sendPushNotification } = require("../helpers/sendNotification");
const { Research } = require("../models/research");
const { User } = require("../models/user");

//student register to rersearch
exports.registerResearch = async (req, res, next) => {
  try {
    const userByToken = await getUserByToken(req, res);

    // Check if invalid token sent
    if (!userByToken || userByToken.type !== "student")
      return res.status(401).json({
        success: false,
        message: "Invalid access token",
      });

    const { research } = req.body;
    if (!research)
      return res.status(500).send({ message: "you should send research " });
    const researchExist = await Research.findById(research);
    if (!researchExist)
      return res.status(400).json({ message: "Research dosen't exists" });

    //check if student allready register in research
    if (
      researchExist.studentsStatus.some(
        (el) => el.student.toString() === userByToken._id.toString()
      )
    ) {
      return res
        .status(401)
        .json({ message: "You already registerd to research" });
    }

    researchExist.studentsStatus.push({
      student: userByToken._id,
    });
    researchExist.newRequest = parseInt(researchExist.newRequest) + 1;
    await researchExist.save();

    //send notification message to researcher that new student registerd and can you accepted or refused
    const title = "HandInHand";
    const body = `Student ${userByToken.name} has sent a new request in your search `;
    const researcher = await User.findById(researchExist.researher);
    await sendPushNotification(researcher, title, body, "private", research);

    return res.status(200).json({
      message: "you registered successfully and status is pending",
      research: researchExist,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Internal Server Error", message: error["message"] });
  }
};

//get all researches based status of user
exports.getmyResearches = async (req, res, next) => {
  try {
    const userByToken = await getUserByToken(req, res);
    // Check if invalid token sent
    if (!userByToken || userByToken.type !== "student")
      return res.status(401).json({
        success: false,
        message: "Invalid access token",
      });

    const { status = "pending" } = req.query;

    const AllUserResearches = await Research.find({
      "studentsStatus.student": userByToken._id,
      "studentsStatus.status": status,
    }).populate("researher studentsStatus.student", "-password");

    if (!AllUserResearches) {
      return res.status(404).send({ message: "Internal Server error " });
    }

    return res.status(201).json({ researches: AllUserResearches });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Internal Server Error", message: error["message"] });
  }
};
