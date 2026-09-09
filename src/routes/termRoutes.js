import express from 'express'
import { createTerms, activeTerm, activateTerm, concludeTerm, endSession, terms } from '../controllers/termController.js'
import { protect, authorize } from '../middlewares/authMiddleware.js'

const router = express.Router()

router.post('/:sessionId/create', protect, authorize('admin'), createTerms)
router.get('/', terms)
router.get('/:sessionId/active', protect, authorize('admin', 'teacher'), activeTerm)
router.patch( '/:termId/start', protect, authorize("admin"), activateTerm);
router.patch( '/:termId/end', protect, authorize("admin"), concludeTerm );


export default router