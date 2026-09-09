import express from 'express';
import { addStudent, updateStudent, findStudent,getStudents, deleteStudent } from '../controllers/studentController.js';
import { studentValidation } from '../middlewares/validation.js';
import { authorize, protect } from '../middlewares/authMiddleware.js';

const router = express.Router()


router.post('/', protect, authorize("admin"), addStudent)
router.get('/', getStudents)



router.route('/:id')
.get(findStudent)
.patch(updateStudent)
.delete(deleteStudent)

export default router;