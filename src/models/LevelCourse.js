import mongoose from "mongoose";

const levelCourseSchema = new mongoose.Schema(
  {
    academicSession: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AcademicSession",
      required: true,
    },

    level: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Level",
      required: true,
    },

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    isCompulsory: {
      type: Boolean,
      default: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

levelCourseSchema.index({ academicSession: 1, level: 1, course: 1, },{unique: true,});

const LevelCourse = mongoose.model( "LevelCourse", levelCourseSchema );

export default LevelCourse;