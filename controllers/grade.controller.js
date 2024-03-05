const { getUserByToken } = require("../helpers/getUserByToken");
const { sendPushNotification } = require("../helpers/sendNotification");
const { Grade } = require("../models/grade");
const { Research } = require("../models/research");
const { User } = require("../models/user");
const { validateCreateGrade } = require("../validations/validators");

//get all grades of student
exports.addGrdeToStudent = async (req, res, next) => {
  try {
    const userByToken = await getUserByToken(req, res);
    if (!userByToken || userByToken.type !== "researcher") {
      return res.status(401).json({
        success: false,
        message: "Invalid access token",
      });
    }
    const { error } = validateCreateGrade(req.body);
    if (error) {
      const errorMessage = error.details.map((detail) => detail.message);
      console.log("errorMessage");
      console.log(errorMessage);
      return res.status(400).json({ message: errorMessage[0] });
    }
    const { student, research, status } = req.body;

    const studentExist = await User.findById(student);
    if (!studentExist)
      return res.status(400).send({ message: "student not found" });
    const researchExist = await Research.findById(research);
    if (!researchExist)
      return res.status(400).send({ message: "Research not found" });

    const gradeExist = await Grade.findOne({
      student,
      research,
      researcher: userByToken._id,
    });
    if (gradeExist)
      return res
        .status(401)
        .send({ message: "You have already added grades for this student " });

    let grade = new Grade({
      student,
      research,
      researcher: userByToken._id,
      isSuccess: status,
    });
    grade = await grade.save();
    if (!grade)
      return res.status(500).send({ message: "Internal Server error " });

    //send notification for student that success or failed of research
    const title = "HandInHand";
    const body =
      status === true
        ? `Congratulations, your full mark has been added to the research recorded by researcher ${userByToken.name}.`
        : `Unfortunately, the grades were not added to your research with researcher ${userByToken.name} because he did not attend all the meetings.`;
    await sendPushNotification(studentExist, title, body, "private", research);
    return res.status(200).send({ message: "Add grade Successfully", grade });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
