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
          enum: ["pending", "accepted", "rejected"],
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
        isCredit: {
          type: Boolean,
        },
      },
    ],

    researchQuestion: {
      type: String,
      required: true,
    },
    hand: {
      type: [String],
      enum: ["left", "right", "notRelevant"],
      required: false,
    },

    language: {
      type: [String],
      enum: ["arabic", "english", "hebrew", "notRelevant"],
      required: false,
    },
    vision: {
      type: [String],
      enum: ["normal", "notNormal", "notRelevant"],
      required: false,
    },
    hearingNormal: {
      type: [String],
      enum: ["yes", "no", "notRelevant"],
      required: false,
    },
    origin: {
      type: [String],
      enum: ["israel", "usa", "notRelevant"],
      required: false,
    },
    ADHD: {
      type: [String],
      enum: ["yes", "no", "notRelevant"],
      required: false,
    },
    musicalBackground: {
      type: [String],
      enum: ["yes", "no", "notRelevant"],
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
      type: String,
      required: false,
    },
    description: {
      type: String,
      default: "",
    },
    newRequest: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

exports.Research = mongoose.model("Research", researchSchema);
