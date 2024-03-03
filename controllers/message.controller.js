const { getUserByToken } = require("../helpers/getUserByToken");
const { sendPushNotification } = require("../helpers/sendNotification");
const { Research } = require("../models/research");
const { User } = require("../models/user");

//send notification to specific user
exports.sendMessage = async (req, res, next) => {
  try {
    const userByToken = await getUserByToken(req, res);
    if (!userByToken) {
      return res.status(401).json({
        success: false,
        message: "Invalid access token",
      });
    }

    const { user, title, body, research } = req.body;

    const userExist = await User.findById(user);
    if (!userExist) return res.status(400).send({ message: "user not found" });
    const researchExist = await Research.findById(research);
    if (!researchExist)
      return res.status(400).send({ message: "Research not found" });

    const notification = await sendPushNotification(
      userExist,
      title,
      body,
      "private",
      research
    );

    console.log("notification");
    console.log(notification);
    return res.status(200).send({ message: "Send Message Successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
