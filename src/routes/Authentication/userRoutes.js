import express from "express";
import { createStudentUser } from "../../controllers/Authentication/authController.js";
import {
  getMe,
  updateMe,
  changePassword,
  getUsers,
  getUser,
  createTeacher,
  deactivateUser,
} from '../../controllers/Authentication/userController.js';
import { protect, authorize, } from "../../middlewares/authMiddleware.js";



const router = express.Router();

// Authenticated user
router.get("/me", protect, getMe);
router.patch("/me", protect, updateMe);
router.patch("/me/password", protect, changePassword );

// Admin only
router.get("/", protect, authorize("admin"), getUsers );
router.get("/:id", protect, authorize("admin"), getUser );
router.post( "/teachers", protect, authorize("admin"), createTeacher );
router.patch( "/:id/deactivate", protect, authorize("admin"), deactivateUser );
router.post("/students", protect, authorize("admin"), createStudentUser );

export default router;