import express from 'express'
import { createEnrollment, getEnrollments, getEnrollment, getStudentCourses, getCourseStudents, updateEnrolment, deleteEnrolment } from '../controllers/enrollmentController.js'
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

// router.get('/', getStudentCourses)
router.post('/', protect, authorize('admin'), createEnrollment)
router.get('/', protect, authorize('admin'),getEnrollments)

router.get('/:id', protect, authorize('admin', 'teacher'), getEnrollment )
router.get('/course/:id', getCourseStudents);
router.get('student/:id',getStudentCourses)
router.patch('/:id', protect, authorize('admin'), updateEnrolment)
router.delete('/:id', protect, authorize('admin'), deleteEnrolment)



export default router;
