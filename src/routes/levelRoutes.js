import express from "express";
import { createLevel, getLevels, getLevel, updateLevel, deleteLevel } from "../controllers/levelController.js";
import { protect, authorize } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post('/', protect, authorize("admin"), createLevel);
router.get('/', getLevels);


router.get('/:id', getLevel);
router.patch('/:id', updateLevel);
router.delete('/:id', deleteLevel);

export default router;