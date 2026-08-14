import express from 'express'
import { createSession, getAcademicSessions, getAcademicSession, updateAcademicSession, deleteSession  } from '../controllers/sessionController.js'


const router = express.Router();


router.post('/', createSession)
router.get('/', getAcademicSessions)
router.get('/:id', getAcademicSession)
router.patch('/:id', updateAcademicSession)
router.delete('/:id', deleteSession)



export default router;
