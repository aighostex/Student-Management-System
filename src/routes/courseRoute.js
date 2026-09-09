import express from 'express';
import { createCourse, getCourses, getCourse, updateCourse, deleteCourse } from '../controllers/courseController.js'
import { courseValidation } from '../middlewares/validation.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';


const router = express.Router()

router.post('/', protect, authorize('admin'), createCourse)
router.get('/', protect, authorize('admin', 'teacher'), getCourses)

router.get('/:id', protect, authorize('admin', 'teacher'), getCourse)
router.route('/:id', protect, authorize('admin'),)
.patch(updateCourse)
.delete(deleteCourse)


export default router;