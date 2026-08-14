import express from 'express'
import { createDepartment, getDepartments, getDepartment, updateDepartment, deleteDepartment } from '../controllers/departmentController.js'


const router = express.Router()

router.post('/', createDepartment)
router.get('/', getDepartments)

router.get('/:id', getDepartment)


export default router