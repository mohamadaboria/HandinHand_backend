const { getUserByToken } = require("../helpers/getUserByToken");
const { postImageLocatianSpecify } = require("../helpers/imageStorage");
const { sendPushNotification } = require("../helpers/sendNotification");
const { Research } = require("../models/research");
const { User } = require("../models/user");
const { validateCreateResearch } = require("../validations/validators");
const fs = require("fs");
const path = require("path");
const aws = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");

// Function to save base64 data as an image file
function saveBase64Image(base64Data) {
  const imageBuffer = Buffer.from(base64Data, "base64");
  const fileName = uuidv4(); // Generate a unique filename
  const filePath = path.join(__dirname, `../public/uploads/${fileName}.png`); // Path to save the image file
  fs.writeFileSync(filePath, imageBuffer); // Save the image file
  return filePath;
}

// Function to upload file to Amazon S3
async function uploadFileToS3(filePath) {
  aws.config.update({
    secretAccessKey: "vMacd2NsOKFXJoOZJx8G5LoNR9qlBy6nPpudoJqI",
    accessKeyId: "AKIAX4V6NCUOXMOTNHGN",
    region: "us-east-1",
  });

  let s3 = new aws.S3();

  const fileContent = fs.readFileSync(filePath);

  const params = {
    Bucket: "handinhand-demo",
    Key: path.basename(filePath),
    Body: fileContent,
    ContentType: "image/png", // Set the content type as per your requirement
  };

  const file = await s3.upload(params).promise();
  // Remove the image file from the project directory
  fs.unlinkSync(filePath);
  // Return the S3 path of the uploaded image
  return file.Location;
}

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
      approvment,
    } = req.body;

    // console.log("bpdyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy");
    // // console.log(req.body);
    // console.log("bpdyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy");

    const researchExist = await Research.findOne({ researchQuestion });
    if (researchExist)
      return res.status(400).json({ message: "Research already exists" });

    // Decode base64 data and save it as an image file
    const approvementFilePath = saveBase64Image(approvment);
    // Upload the image file to S3
    const s3Path = await uploadFileToS3(approvementFilePath);

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
      approvment: s3Path,
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

// get All Researches of researcher by token
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

// get All Researches of researcher by researcher id
exports.getAllResearchesOfResearcher = async (req, res, next) => {
  try {
    const { id } = req.params;

    const AllResearches = await Research.find({
      researher: id,
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

    const { status, student, research } = req.body;

    if (status !== "accepted" && status !== "rejected")
      return res
        .status(400)
        .send({ message: "status must be accepted or rejected" });
    const studentExist = await User.findById(student);
    if (!studentExist)
      return res.status(400).send({ message: "student not found" });

    const researchExist = await Research.findById(research).populate(
      "researher studentsStatus.student",
      "-password"
    );
    if (!researchExist)
      return res.status(400).json({ message: "Research Not found" });

    console.log("req.body");
    console.log(req.body);

    researchExist.studentsStatus.forEach(async (el) => {
      if (el.student._id.toString() === student.toString()) {
        if (el.status != "pending") {
          console.log("sssss");
          return res.status(402).send({
            message: `you can not change the status of student again`,
          });
        } else {
          console.log("true", status);
          el.status = status;
          el.updateTime = new Date();
          researchExist.newRequest = parseInt(researchExist.newRequest) - 1;
          await researchExist.save();
          //send notification for student that accepted or rejected of research
          const title = "HandInHand";
          const body = ` You have been ${status} in the research submitted by researcher ${
            userByToken.name
          } ${
            status === "accepted"
              ? "and within 48 hours you will receive details of the location and timing of the meeting"
              : ""
          } `;
          await sendPushNotification(
            studentExist,
            title,
            body,
            "private",
            research
          );

          return res.status(200).send({
            message: "update status of student successfully",
            research: researchExist,
          });
        }
      }
    });

    //return success message
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Internal Server Error", message: error["message"] });
  }
};

//get All accepted student in all researches
exports.getAllAcceptedStudentsResearchesOfUser = async (req, res, next) => {
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
      "studentsStatus.status": "accepted",
    }).populate("researher studentsStatus.student", "-password");

    if (!AllResearches) {
      return res.status(404).send({ message: "Internal Server error " });
    }

    // Extract only the accepted students from each research
    const acceptedStudents = AllResearches.reduce((acc, research) => {
      research.studentsStatus.forEach((studentStatus) => {
        if (studentStatus.status === "accepted") {
          acc.push({
            researchId: research._id,
            researcher: research.researher,
            student: studentStatus.student,
          });
        }
      });
      return acc;
    }, []);

    return res.status(201).json({ researches: acceptedStudents });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "Internal Server Error", message: error["message"] });
  }
};
