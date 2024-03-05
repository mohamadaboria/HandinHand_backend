const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { ObjectId } = mongoose.Schema.Types;

const gradeSchema = new Schema(
  {
    student: {
      type: ObjectId,
      ref: "User",
    },
    research: {
      type: ObjectId,
      ref: "Research",
      required: false,
      default: null,
    },

    researcher: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },

    isSuccess: {
      type: Boolean,
    },
    status: {
      type: String,
      enum: ["active", "inActive", "hidden", "deleted"],
      default: "active",
    },
  },
  { timestamps: true }
);

exports.Grade = mongoose.model("Grade", gradeSchema);
