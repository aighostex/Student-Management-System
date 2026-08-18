// import { data } from "react-router-dom";
import Student from "../models/Student.js"



//controller to create student
export const addStudent = async (req, res) => {
    // req.method = 'POST'
    try {
        const student = await Student.create(req.body);
        res.status(201).json({
            success: true,
            message: "Student created",
            data: student,
        })
    } catch (error) {
        if (error.code === 11000) {
            res.status(409).json({
            success: false,
            message: error.message,
            });
        }
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
};

export const findStudent = async(req, res)=>{
    try {
        const student = await Student.findOne(
            {_id: req.params.id}
        );

        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found!'
            })
        }

        res.status(200).json({
            success: true,
            message:'Successfull',
            data: student
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

//get a list of all students LIFO
export const getStudents = async (req,  res)=>{
    try {
        const student = await Student.find().sort({createdAt: -1})
        res.status(200).json({
            success: true,
            data: student
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
        
    }
}


//update student by id
export const updateStudent = async(req, res)=>{
    try {
       const student = await Student.findOneAndUpdate(
        {_id: req.params.id}, req.body, { returnDocument: "after", upsert: true }
       );
       
       res.status(200).json({
        success: true,
        message: 'Student Updated Successfully',
        data: student
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
        
    }
}



//delete a student by id
export const deleteStudent = async(req, res)=>{
    try {
        const student = await Student.findOneAndDelete(
            {_id: req.params.id}
        );
        if (!student) {
            return res.status(400).json({
                success: false,
                message: 'student not found'
            })
        }
        res.status(200).json({
            success: true,
            message: "Student has been deleted"
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}