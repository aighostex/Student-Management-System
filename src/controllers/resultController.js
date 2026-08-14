import Result from "../models/Result.js";
import Enrollment from "../models/Enrolment.js";
import Course from "../models/Course.js";
import Term from "../models/Term.js";


// Create result
export const createResult = async (req, res) => {
  try {
    const { enrollment, course, score } = req.body;

    const enrollmentExists = await Enrollment.findById(enrollment);

    if (!enrollmentExists) {
      return res.status(404).json({
        success: false,
        message: "Enrollment not found",
      });
    }

    const courseExists = await Course.findById(course);

    if (!courseExists) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const activeTerm = await Term.findOne({
        academicSession: enrollmentExists.academicSession, status: "active"
    })

    if (!activeTerm) {
      return res.status(400).json({
        success: false,
        message: "There is no active term for this academic session",
      });
    }

    const existingResult = await Result.findOne({
      enrollment,
      course,
      term: activeTerm._id,
    });

    if (existingResult) {
      return res.status(409).json({
        success: false,
        message:
          "A result already exists for this course and term",
      });
    }

    const result = await Result.create({
      enrollment,
      course,
      score,
      term: activeTerm._id,
    });

    const populatedResult =
      await Result.findById(result._id)
        .populate(
          "enrollment",
          "student academicSession level class"
        )
        .populate(
          "course",
          "courseTitle courseCode passMark"
        )
        .populate(
            "term",
            "name startDate endDate status"
        );

    return res.status(201).json({
      success: true,
      message: "Result created successfully",
      data: populatedResult,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Get all results
export const getResults = async (req, res) => {
  try {
    const filter = {};

    if (req.query.enrollment) {
      filter.enrollment = req.query.enrollment;
    }

    if (req.query.course) {
      filter.course = req.query.course;
    }

    if (req.query.semester) {
      filter.semester = req.query.semester;
    }

    const results = await Result.find(filter)
      .populate(
        "enrollment",
        "student academicSession level class"
      )
      .populate(
        "course",
        "courseTitle courseCode passMark"
      )
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: results.length,
      data: results,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// gets. a  single result
export const getResult = async (req, res) => {
  try {
    const result = await Result.findById(req.params.id)
      .populate( "enrollment", "student academicSession level class")
      .populate( "course", "courseTitle courseCode passMark" );

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Result not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



// Delete result
export const deleteResult = async (req, res) => {
  try {
    const result = await Result.findByIdAndDelete( req.params.id );

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Result not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Result deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};