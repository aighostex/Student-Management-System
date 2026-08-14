import mongoose from "mongoose";

const resultSchema = new mongoose.Schema(
  {
    enrollment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Enrollment",
      required: true,
    },

    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    // semester: {
    //   type: String,
    //   enum: ["First", "Second"],
    //   required: true,
    // },
    term:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Term",
        required: true
    },

    score: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    remarks: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

resultSchema.index(
  {
    enrollment: 1,
    course: 1,
    student: 1,
    term: 1,
  },
  {
    unique: true,
  }
);

const Result = mongoose.model("Result", resultSchema);

export default Result;