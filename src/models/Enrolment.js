import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema(
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

    level: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Level",
      required: true,
    },

    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },

    status: {
      type: String,
      enum: [ "active", "completed", "promoted", "repeated", "withdrawn",],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);

enrollmentSchema.index(
  {
    student: 1,
    academicSession: 1,
  },
  {
    unique: true,
  }
);

const Enrollment = mongoose.model( "Enrollment", enrollmentSchema );

export default Enrollment;