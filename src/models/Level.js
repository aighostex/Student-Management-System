import mongoose from "mongoose";


const levelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    code: {
      type: String,
      trim: true,
      uppercase: true,
    },

    description: {
      type: String,
      trim: true,
    },

    isGraduatingLevel: {
      type: Boolean,
      default: false,
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
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

levelSchema.index({ name: 1, }, { unique: true, } );

const Level = mongoose.model("Level", levelSchema);

export default Level;