import express from 'express'
import { createClass, getClasses, getClass, updateClass, deleteClass } from '../controllers/classController.js'
import { classValidation } from '../middlewares/validation.js'
import { authorize, protect } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.post('/', protect, authorize('admin'), createClass)
router.get('/', protect, authorize('admin'), getClasses)

router.get('/:id',protect, authorize('admin', 'teacher'), getClass)
router.patch('/:id', protect, authorize('admin'), updateClass)
router.delete('/:id', protect, authorize('admin'), deleteClass)

export default router
