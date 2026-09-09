import express from "express";
import { createResult, getResults, getResult, deleteResult } from "../controllers/resultController.js";
import { protect, authorize } from "../middlewares/authMiddleware.js";


const router = express.Router();

router.post("/", protect, authorize("admin", "teacher"), createResult);
router.get("/", protect, authorize("admin", "teacher"), getResults);
router.get("/:id", protect, authorize("admin", "teacher"), getResult);
// router.put("/:id", updateResult);
router.delete("/:id", protect, authorize("admin"), deleteResult);

export default router;