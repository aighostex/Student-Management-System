import mongoose from "mongoose";


const courseSchema = new mongoose.Schema({
    courseTitle: {
        type: String,
        required: true,
        trim: true
    },
    courseCode: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    passMark: {
        type: Number,
        min: 0,
        max: 100,
        default: null,
    },
    // semester:{
    //     type: String,
    //     required: false,
    //     enum: ['First', 'Second', 'Third']
    // },

    term: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Term",
        required: true
    },
    level: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Level",
        required: true,
      },
    ],
    department:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Deparment',
        default: null
    },
    isActive: {
      type: Boolean,
      default: true,
    },


}, {
    timestamps: true
});
// courseSchema.index( { courseCode: 1 }, { unique: true });

const Course = mongoose.model('Course', courseSchema)

export default Course;