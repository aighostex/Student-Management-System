import Level from "../models/Level.js";
import Student from "../models/Student.js";
import Course from "../models/Course.js";


export const createLevel = async (req, res) => {
  try {
    const { name, code, description, isGraduatingLevel } = await Level.create(req.body);

    const existingLevel = await Level.findOne({ name })

    if (existingLevel) {
      return res.status(409).json({
        success: false,
        message: "Level already exists",
      });
    }

    const level = await Level.create({
      name, code, description, isGraduatingLevel
    })

    res.status(201).json({ success: true, message: "Level created successfully", data: level });
  } catch (error) {

    if (error.code === 11000) {
      res.status(409).json({
      success: false,
      message: error.message,
    });
    }

    // res.status(500).json({
    //   success: false,
    //   message: error.message,
    // });
  }
};


export const getLevels = async (req, res) => {
  try {
    const levels = await Level.find().sort({ name: 1 }).populate('course');

    res.status(200).json({
      success: true,
      count: levels.length,
      data: levels,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



export const getLevel = async (req, res) => {
  try {
    const level = await Level.findById(req.params.id);

    if (!level) {
      return res.status(404).json({
        success: false,
        message: "Level not found",
      });
    }

    // const students = await Student.find({ level: level._id });

    const courses = await Course.find({ level: level._id }).select('-level');

    res.status(200).json({
      success: true,
      data: level, courses });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const updateLevel = async (req, res) => {
  try {
    const level = await Level.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        returnDocument: "after",
        upsert: true,
      }
    );

    if (!level) {
      return res.status(404).json({
        success: false,
        message: "Level not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Level updated successfully",
      data: level,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// this deletes a level

export const deleteLevel = async (req, res) => {
  try {
    const level = await Level.findByIdAndDelete(req.params.id);

    if (!level) {
      return res.status(404).json({
        success: false,
        message: "Level not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Level deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};