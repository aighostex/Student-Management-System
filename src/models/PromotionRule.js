import mongoose from "mongoose";

const promotionRuleSchema = new mongoose.Schema(
  {
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

    defaultPassMark: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
      default: 65,
    },

    minimumAverage: {
      type: Number,
      min: 0,
      max: 100,
      default: null,
    },

    maximumFailedCourses: {
      type: Number,
      min: 0,
      default: null,
    },

    minimumAttendance: {
      type: Number,
      min: 0,
      max: 100,
      default: null,
    },

    requiresApproval: {
      type: Boolean,
      default: false,
    },

    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const PromotionRule = mongoose.model( "PromotionRule", promotionRuleSchema );

export default PromotionRule;