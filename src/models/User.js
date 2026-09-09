import mongoose from "mongoose";


const userScehma = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        unique: true
    },

    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },


    password:{
        type: String, 
        required: true,
        select: false,
        minlength: 6,
        // match: [/^(?=.*[A-Z])(?=.*[a-z])(?=.*[\d])[A-Za-z0-9]{6,}$/, 'Password must contain Uppercase, lowercase, a number and must be more tha 6 characters']
    },

    role:{
        type: String,
        required: true,
        enum: ["admin", "teacher", "student"]
    },

     school: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "School",
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

},{
    timestamps: true,
}
)

const User = mongoose.model('User', userScehma);

export default User