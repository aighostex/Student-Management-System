import express from 'express'
import { createSession, getAcademicSessions, getAcademicSession, updateAcademicSession, deleteSession  } from '../controllers/sessionController.js'
import { endSession } from '../controllers/termController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';


const router = express.Router();


router.post('/', protect, authorize('admin'), createSession)
router.get('/',protect, authorize('admin', 'teacher'),getAcademicSessions)
router.get('/:id', protect, authorize('admin', 'teacher'), getAcademicSession)
router.patch('/:id', protect, authorize('admin'), updateAcademicSession)
router.delete('/:id', protect, authorize('admin'), deleteSession)
router.patch( "/:id/complete", protect, authorize("admin"), endSession);



export default router;
