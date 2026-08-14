import mongoose from "mongoose";

const classSchema = new mongoose.Schema(
  {
    level: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Level",
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    capacity: {
      type: Number,
      min: 1,
      max: 50,
      default: 30,
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

classSchema.index({ level: 1, name: 1, },{ unique: true, } );

const Class = mongoose.model("Class", classSchema);

export default Class;