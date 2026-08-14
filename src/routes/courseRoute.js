import express from 'express';
import { createCourse, getCourses, getCourse, updateCourse, deleteCourse } from '../controllers/courseController.js'
import { courseValidation } from '../middlewares/validation.js';


const router = express.Router()

router.post('/', courseValidation, createCourse)
router.get('/', getCourses)


router.route('/:id')
.get(getCourse)
.patch(updateCourse)
.delete(deleteCourse)


export default router;