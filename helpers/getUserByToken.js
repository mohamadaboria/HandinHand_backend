const { User } = require("../models/user");
const jwt = require("jsonwebtoken");
const secret = process.env.secret;

const verifyJwt = (token, secretKey) => {
  try {
    const user = jwt.verify(token, secretKey);
    return user;
  } catch (err) {
    return "Invalid token";
    // throw new Error('Invalid token');
  }
};

module.exports.getUserByToken = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  let createdBy = verifyJwt(token, secret);
  // console.log("user", createdBy);
  if (createdBy == "Invalid token") return null;

  // console.log("createdBy");
  // console.log(createdBy);
  const user = await User.findById(createdBy.userId);
  // console.log("user");
  // console.log(user);
  return user;
};
