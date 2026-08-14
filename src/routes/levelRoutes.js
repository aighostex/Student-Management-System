import express from "express";
import { createLevel, getLevels, getLevel, updateLevel, deleteLevel } from "../controllers/levelController.js";

const router = express.Router();

router.post('/', createLevel);
router.get('/', getLevels);


router.get('/:id', getLevel);
router.patch('/:id', updateLevel);
router.delete('/:id', deleteLevel);

export default router;