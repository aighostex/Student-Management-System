import mongoose from "mongoose";

const academicSessionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    // isCurrent: {
    //   type: Boolean,
    //   default: false,
    // },

    // isClosed: {
    //   type: Boolean,
    //   default: false,
    // },
    status: {
        type: String,
        enum: ["upcoming", "active", "completed"],
        default: "upcoming",
    },

    promotionStatus: {
        type: String,
        enum: ["pending", "processing", "completed"],
        default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

academicSessionSchema.index({ name: 1, }, { unique: true, } );

const AcademicSession = mongoose.model( "AcademicSession", academicSessionSchema );

export default AcademicSession;