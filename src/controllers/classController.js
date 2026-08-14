import Class from "../models/Class.js";

export const createClass = async (req, res) => {
  try {
    const { level, name, code, capacity } = req.body;

    const existingClass = await Class.findOne({ level, name });

    if (existingClass) {
      return res.status(409).json({
        success: false,
        message: "Class already exists in this level",
      });
    }

    const newClass = await Class.create({
      level,
      name,
      code,
      capacity,
    });

    res.status(201).json({
      success: true,
      message: "Class created successfully",
      count: newClass.length,
      data: newClass,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// get all clasess
export const getClasses = async (req, res) => {
  try {
    const filter = {};

    if (req.query.level) {
      filter.level = req.query.level;
    }

    const classes = await Class.find(filter)
      .populate("level", "name code")
      .sort({ name: 1 });

    return res.status(200).json({
      success: true,
      count: classes.length,
      data: classes,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


//get a single class
export const getClass = async (req, res) => {
  try {
    const classData = await Class.findById(req.params.id).populate("level", "name code");

    if (!classData) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: classData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// to update a class
export const updateClass = async (req, res) => {
  try {
    const classData = await Class.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        returnDocument: "after",
        upsert: true
      }
    ).populate("level", "name code");

    if (!classData) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Class updated successfully",
      data: classData,
    });
  } catch (error) {
    es.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// deletes a class
export const deleteClass = async (req, res) => {
  try {
    const classData = await Class.findByIdAndDelete( req.params.id );

    if (!classData) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Class deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};