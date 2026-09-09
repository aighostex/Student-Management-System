import mongoose from "mongoose";

const termSchema = new mongoose.Schema({
    // school: {
    //    type: mongoose.Schema.Types.ObjectId,
    //    ref: "School",
    //    required: true,
    // },
    academicSession: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "AcademicSession",
        required: true
    },

    name: {
        type: String,
        enum: ['First', 'Second', 'Third'],
        required: true
    },

    startDate: {
        type: Date,
        required: true,
    },

    endDate: {
        type: Date,
        required: true,
    },

    status: {
        type: String,
        enum: [
            "upcoming",
            "active",
            "completed",
        ],
        default: "upcoming",
    },


})

const Term = mongoose.model("Term", termSchema)

export default Term