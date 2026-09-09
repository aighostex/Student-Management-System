import express from 'express'
import { register, login, users } from '../../controllers/Authentication/authController.js'
import { authorize, protect } from '../../middlewares/authMiddleware.js'




const router = express.Router()

router.post('/register', register)
router.post('/login', login)

// router.get('/users',protect, authorize('admin'), users)

export default router