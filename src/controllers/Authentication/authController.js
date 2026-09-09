import bcrypt from 'bcryptjs'
import User from "../../models/User.js";
import Student from '../../models/Student.js';
import jwt from 'jsonwebtoken'
// import generateToken from '../../utils/generateToken.js';
import { generateToken, generateRefreshToken } from '../../utils/generateToken.js';

export const register = async (req, res) => {
    try {
        const {firstName, lastName, email, password, role, school } = req.body;
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(409).json({ message: 'User already exists' });
        }
        const hashPassword = await bcrypt.hash(password, 12);

        const newUser = new User({firstName, lastName, email, password: hashPassword, role, school});
        await newUser.save();

        const token = await generateToken(newUser)
        // const refreshToken = await generateRefreshToken(newUser)
        res.status(201).json({
            token,
            success: true,
            message: "User has been created!"
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
};


export const login = async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email}).select('+password');

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }

        if (!user) {
            return res.status(404).json({success: false, message: `User ${userName} not found`})
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(404).json({
                success: false,
                message: "Invalid Credentials!"
            })
        }

        const token = await generateToken(user)
        res.status(200).json({ token, message:'Login Successfull'  })
    } catch (error) {
        res.status(401).json({
            success: false,
            message: ' Login Failed'
        })
    }
}

export const users = async (req, res) => {
    try {
        const users = await User.find().select("-password").sort({createdAt: -1});
        res.status(200).json({
            success: true,
            count: users.length,
            data: users,
        });
        } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}


export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// creating a studdent
export const createStudentUser = async (req, res) => {
  try {
    const { studentId, email, password } = req.body;
    if (!studentId || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Student ID, email and password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    if (student.user) {
      return res.status(409).json({
        success: false,
        message: "This student already has a user account",
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "A user with this email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      firstName: student.firstName,
      lastName: student.lastName,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: "student",
    });

    student.user = user._id;
    await student.save();

    return res.status(201).json({
      success: true,
      message: "Student account created successfully",
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
        },
        student: {
          id: student._id,
          firstName: student.firstName,
          lastName: student.lastName,
        },
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};