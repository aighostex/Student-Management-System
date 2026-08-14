import mongoose from "mongoose";

const promotionHistorySchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    academicSession: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AcademicSession",
      required: true,
    },

    fromLevel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Level",
      required: true,
    },

    toLevel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Level",
      default: null,
    },
    fromClass: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Class",
        default: null,
    },

    promotionRule: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PromotionRule",
      required: true,
    },

    status: {
      type: String,
      required: true,
      enum: [ "promoted", "repeated", "pending", "graduated" ],
    },

    average: {
      type: Number,
      min: 0,
      max: 100,
    },

    failedCourses: {
      type: Number,
      min: 0,
      default: 0,
    },

    reason: {
      type: String,
      trim: true,
      default: null,
    },

    promotedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const PromotionHistory = mongoose.model( "PromotionHistory", promotionHistorySchema );

export default PromotionHistory;