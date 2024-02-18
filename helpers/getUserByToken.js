const { verifyJwt } = require("../helpers/jwt");
const { User } = require("../model/user");
const secret = process.env.secret;

module.exports.getUserByToken = async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  let createdBy = verifyJwt(token, secret);
  console.log("user", createdBy);
  if (createdBy == "Invalid token") return null;

  // console.log("createdBy");
  // console.log(createdBy);
  const user = await User.findById(createdBy.userId).populate("level");

  return user;
};
