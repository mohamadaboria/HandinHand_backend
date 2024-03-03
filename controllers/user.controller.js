const { User } = require("../models/user");
const bycript = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { userRegister } = require("../validations/validators");
const { Message } = require("../models/message");
const { getUserByToken } = require("../helpers/getUserByToken");

//register
exports.Register = async (req, res, next) => {
  try {
    const { error } = userRegister(req.body);
    if (error) {
      const errorMessage = error.details.map((detail) => detail.message);
      console.log("errorMessage");
      console.log(errorMessage);
      return res.status(400).json({ message: errorMessage[0] });
    }
    const {
      name,
      mobile,
      email,
      type,
      birthDate,
      gender,
      password,
      hand,
      language,
      version,
      hearingNormal,
      origin,
      ADHD,
      musicalBackground,
    } = req.body;
    const userExist = await User.findOne({
      $or: [{ email }, { mobile }],
    });
    if (userExist) {
      return res
        .status(400)
        .json({ message: "email or mobile already exists" });
    }

    let user = new User({
      name,
      mobile,
      email,
      type,
      birthDate,
      gender,
      password: bycript.hashSync(password, 10),
      hand,
      language,
      version,
      hearingNormal,
      origin,
      ADHD,
      musicalBackground,
    });

    user = await user.save();
    if (!user) {
      return res.status(404).send("the user cannot be created");
    }

    const secret = process.env.secret;
    const token = jwt.sign(
      {
        userId: user._id,
        type: user.type,
      },
      secret
      // {
      //   expiresIn: "1d",
      // }
    );

    return res.status(201).send({ ...user.toObject(), token });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Internal Server Error", message: error["message"] });
  }
};

//login
exports.login = async (req, res, next) => {
  try {
    const user = await User.findOne({
      $or: [{ email: req.body.value }, { mobile: req.body.value }],
    });
    if (!user) {
      return res.status(400).send({ message: "User Not Found" });
    }
    if (user && bycript.compareSync(req.body.password, user.password)) {
      const secret = process.env.secret;
      const token = jwt.sign(
        {
          userId: user._id,
          type: user.type,
        },
        secret
        // {
        //   expiresIn: "1d",
        // }
      );

      //update firebase token of user
      if (
        req.body.fbToken &&
        req.body.fbToken !== null &&
        req.body.fbToken !== undefined
      ) {
        user.fbToken = req.body.fbToken;
        await user.save();
      }

      return res.status(200).send({
        ...user.toObject(),
        token,
      });
    } else {
      return res.status(400).send({ message: "Pawword does not match" });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Internal Server Error", message: error["message"] });
  }
};

//get all students
exports.getAllStudents = async (req, res, next) => {
  try {
    const students = await User.find({ type: "student" });
    return res.status(200).json({ students });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Internal Server Error", message: error["message"] });
  }
};

//get all researchers
exports.getAllResearchers = async (req, res, next) => {
  try {
    const researchers = await User.find({ type: "researcher" });
    return res.status(200).json({ researchers });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Internal Server Error", message: error["message"] });
  }
};

//get all notification of user by token
exports.getAllNotificationByToken = async (req, res, next) => {
  try {
    const userByToken = await getUserByToken(req, res);
    // Check if invalid token sent
    if (!userByToken)
      return res.status(401).json({
        success: false,
        message: "Invalid access token",
      });

    const allNotifications = await Message.find({
      user: userByToken._id,
    })
      .populate("user research")
      .sort({ createdAt: -1 });
    return res.status(200).json(allNotifications);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error["message"],
      message: "Internal Server error",
    });
  }
};
