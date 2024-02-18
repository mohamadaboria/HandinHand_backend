const { string } = require("joi");
const mongoose = require("mongoose");
const researchSchema = mongoose.Schema(
  {
    researher: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },

    studentsStatus: [
      {
        status: {
          type: String,
          default: "pending",
          enum: ["pending", "accepted", "notAccepted"],
        },
        student: {
          type: mongoose.Types.ObjectId,
          ref: "User",
          required: true,
        },
        updateTime: {
          type: Date,
          default: new Date(),
        },
      },
    ],

    researchQuestion: {
      type: String,
      required: true,
    },
    hand: {
      type: Array,
      enum: ["left", "right"],
      required: false,
    },

    language: {
      type: Array,
      enum: ["arabic", "english", "hebrew"],
      required: false,
    },
    vision: {
      type: Array,
      enum: ["normal", "notNormal"],
      required: false,
    },
    hearingNormal: {
      type: Array,
      enum: ["yes", "no"],
      required: false,
    },
    origin: {
      type: Array,
      enum: ["israel", "usa"],
      required: false,
    },
    ADHD: {
      type: Array,
      enum: ["yes", "no"],
      required: false,
    },
    musicalBackground: {
      type: Array,
      enum: ["yes", "no"],
      required: false,
    },
    Credits: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inActive", "hidden", "deleted"],
      default: "active",
    },
    approvment: {
      type: string,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

exports.Research = mongoose.model("Research", researchSchema);
