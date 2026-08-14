import express from 'express';
import { addStudent, updateStudent, findStudent,getStudents, deleteStudent } from '../controllers/studentController.js';
import { studentValidation } from '../middlewares/validation.js';

const router = express.Router()


router.post('/', studentValidation, addStudent)
router.get('/', getStudents)



router.route('/:id')
.get(findStudent)
.patch(updateStudent)
.delete(deleteStudent)

export default router;