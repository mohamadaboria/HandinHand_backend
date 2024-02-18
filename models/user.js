const mongoose = require("mongoose");
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    mobile: {
      type: String,
      required: [true, "mobile is required "],
      unique: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      // required:[true,"email is required "]
    },
    type: {
      type: String, // student - researcher /professor
      required: true,
    },
    image: {
      type: String,
      default: null,
    },

    status: {
      type: String,
      enum: ["active", "inActive", "hidden", "deleted"],
      default: "active",
    },

    birthDate: {
      type: Date,
      required: false,
    },

    gender: {
      //male // female
      type: String,
      required: false,
    },

    password: {
      type: String,
      required: true,
    },

    hand: {
      type: String,
      enum: ["left", "right"],
      required: false,
    },
    language: {
      type: String,
      enum: ["arabic", "english", "hebrew"],
      required: false,
    },
    version: {
      type: String,
      enum: ["normal", "notNormal"],
      required: false,
    },
    hearingNormal: {
      type: String,
      enum: ["yes", "no"],
      required: false,
    },
    origin: {
      type: String,
      enum: ["israel", "usa"],
      required: false,
    },
    ADHD: {
      type: String,
      enum: ["yes", "no"],
      required: false,
    },
    musicalBackground: {
      type: String,
      enum: ["yes", "no"],
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

exports.User = mongoose.model("User", userSchema);
