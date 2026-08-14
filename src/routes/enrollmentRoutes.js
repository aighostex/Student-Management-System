import express from 'express'
import { createEnrollment, getEnrollments, getStudentCourses, getCourseStudents, updateEnrolment, deleteEnrolment } from '../controllers/enrollmentController.js'

const router = express.Router();

// router.get('/', getStudentCourses)
router.post('/', createEnrollment)
router.get('/', getEnrollments)


router.get('/course/:id', getCourseStudents);
router.get('student/:id',getStudentCourses)
router.patch('/:id', updateEnrolment)
router.delete('/:id', deleteEnrolment)



export default router;
