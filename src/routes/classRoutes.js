import express from 'express'
import { createClass, getClasses, getClass, updateClass, deleteClass } from '../controllers/classController.js'
import { classValidation } from '../middlewares/validation.js'

const router = express.Router()

router.post('/', classValidation, createClass)
router.get('/', getClasses)

router.get('/:id', getClass)
router.patch('/:id', updateClass)
router.delete('/:id', deleteClass)

export default router
