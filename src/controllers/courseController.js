import Course from "../models/Course.js";

//create course
export const createCourse = async(req, res)=>{
    try {
        const{ courseTitle, courseCode, passMark, department } = (req.body)

        const existingCourse = await Course.findOne({ courseCode
        })

        if (existingCourse) {
            return res.status(409).json({
                success: false,
                message: "Course with this course code already exists"
            });
        }

        const course = await Course.create({
            courseTitle, courseCode, passMark, department: department || null
        })

        res.status(201).json({
            success: true,
            message: 'Course Created',
            data: course,
        })
    } catch (error) {
        if (error.code === 11000) {
        res.status(409).json({
            success: false,
            message: error.message
        })
      }
    }
}

//get all courses
export const getCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate( "courseTitle courseCode").sort({ courseTitle: 1})
      res.status(200).json({
      success: true,
      count: courses.length,
      data: courses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//get a single course
export const getCourse = async (req,res) => {
    try {
        const course = await Course.findOne(
            {_id: req.params.id}
        )

        if (!course) {
            return res.status(404).json({
                success: false,
                message: 'Course does not exist'
            })
        }

        res.status(200).json({
            success: true,
            message:'Successfull',
            data: course
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
        
    }
}


//update a course by id
export const updateCourse = async (req, res) => {
    try {
        const course = await Course.findByIdAndUpdate(req.params.id, req.body,
            {
                returnDocument: "after",
                upsert: true
            }
        )
        if (!course) {
            return res.status(404).json({success: false, message: 'Course not found'})
        }

        res.status(200).json({success: true, message: 'Course updated!', data: course})
    } catch (error) {
        res.status(500).json({ success: false, message: error.message,});
    }
}


//delete a course by id
export const deleteCourse = async (req, res) => {
    try {
        const course = await Course.findByIdAndDelete(req.params.id)

        if (!course) {
            return res.status(404).json({success: false, message: 'Course not found'})
        }
        res.status(200).json({ success: true, message: 'Course has been deleted!'})
    } catch (error) {
        res.status(500).json({ success: false, message: error.message,});
    }
}


/*
Checklist
Create Course
get course
get courses
update course
delete course
 */