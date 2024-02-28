const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema.Types;

const MessageSchema = new Schema(
  {
    user: {
      type: ObjectId,
      ref: "User",
    },
    research: {
      type: ObjectId,
      ref: "Research",
      required: false,
      default: null,
    },

    title: {
      type: String,
      default: "",
    },
    body: {
      type: String,
      default: null,
    },
    image: {
      type: String,
      default: null,
    },
    type: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

exports.Message = mongoose.model("Message", MessageSchema);
