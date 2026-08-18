import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    middleName: {
      type: String,
      trim: true,
      default: "",
    },

    dateOfBirth: {
      type: Date,
      required: true
    },

    gender: {
      type: String,
      enum: ["Male", "Female"],
    },

    address: {
      type: String,
      trim: true,
    },

    admissionDate: {
      type: Date,
      default: Date.now,
    },

    level: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Level",
          required: true,
    },

    status: {
      type: String,
      enum: ["active", "graduated", "withdrawn", "expelled"],
      default: "active",
    },
  },
  {
    timestamps: true,
  }
);


const Student = mongoose.model("Student", studentSchema);

export default Student;