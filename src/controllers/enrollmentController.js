import Enrollment from "../models/Enrolment.js";
import Student from "../models/Student.js";
import AcademicSession from "../models/Session.js";
import Level from "../models/Level.js";
import Class from "../models/Class.js";
// import { data } from "react-router-dom";




//get all enrollments 
export const getEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find().populate({
        path: "student",
        populate: {
          path: "level",
        },
      });

    res.status(200).json({
      success: true,
      count: enrollments.length,
      data: enrollments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



//get a student's enrolled courses
export const getStudentCourses = async (req, res) =>{
    // console.log(res.body)
    // console.log('endpoin hit')
    try {
        const enrollments = await Enrollment.find({
            student: req.params.id
        }).populate('course').populate('student');

        res.status(200).json({ success: true, count: enrollments.length, data: enrollments })

    } catch (error) {
        res.status(500).json({ success: false, message: error.message,});
    }
}


//gets student enrolled to a course
export const getCourseStudents = async (req, res) => {
    console.log(req.body)
    try {
        const enrollments = await Enrollment.find(
            { course: req.params.id }
        ).populate('student').populate('course')

        res.status(200).json({success: true, count: enrollments.length , data: enrollments})
    } catch (error) {
        res.status(500).json({ success: false, message: error.message,});
    }
}


//updates enrollment of a student to a course
export const updateEnrolment = async (req, res) => {
    try {
        const update = await Enrollment.findOneAndUpdate(
            {_id: req.params.id }, req.body, {
                returnDocument: "after",
                upsert: true
            }
        )
        res.status(200).json({success: true, message: 'course updated', data: update})
    } catch (error) {
        res.status(500).json({ success: false, message: error.message,});
    }
}


//deletes enrollment of a student
export const deleteEnrolment = async (req, res) => {
    try {
        const enrolment = await Enrollment.findByIdAndDelete(req.params.id)

        if (!enrolment) {
            return res.status(404).json({success: false, message: 'enrollment not found'})
        }
        res.status(200).json({success: true, message: 'Enrollment deleted', data: deleteEnrolment})
    } catch (error) {
        res.status(500).json({ success: false, message: error.message,});
    }
}
/*
Checklist
enroll student
get student courses
get students in a course
update a course
delete a course
 */


// Create enrollment
export const createEnrollment = async (req, res) => {
  try {
    const { student, academicSession, level, class: classId } = req.body;

    // if (!student || !academicSession || !level) {
    //   return res.status(400).json({
    //     success: false,
    //     message:
    //       "Student, academic session and level are required",
    //   });
    // }

    const studentExists = await Student.findById(student);

    if (!studentExists) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const sessionExists = await AcademicSession.findById(academicSession);

    if (!sessionExists) {
      return res.status(404).json({
        success: false,
        message: "Academic session not found",
      });
    }

    const levelExists = await Level.findById(level);

    if (!levelExists) {
      return res.status(404).json({
        success: false,
        message: "Level not found",
      });
    }

    if (classId) {
      const classExists = await Class.findById(classId);

      if (!classExists) {
        return res.status(404).json({
          success: false,
          message: "Class not found",
        });
      }
    }

    // cheks if student has been enrolled
    const existingEnrollment = await Enrollment.findOne({ student, academicSession });

    if (existingEnrollment) {
      return res.status(409).json({
        success: false,
        message:
          "Student is already enrolled for this academic session",
      });
    }

    const enrollment = await Enrollment.create({ student, academicSession,level, class: classId || null });

    const populatedEnrollment = await Enrollment.findById(enrollment._id).populate("student", "name idNumber")
        .populate(
          "academicSession",
          "name startDate endDate"
        )
        .populate("level", "name code")
        .populate("class", "name");

    return res.status(201).json({
      success: true,
      message: "Student enrolled successfully",
      data: populatedEnrollment,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
