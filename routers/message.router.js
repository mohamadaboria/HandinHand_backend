const express = require("express");
const router = express.Router();
const messageController = require("../controllers/message.controller");

//send notification to specific user
router.post("/user", messageController.sendMessage);

module.exports = router;
