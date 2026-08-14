import express from "express";
import { createResult, getResults, getResult, deleteResult } from "../controllers/resultController.js";

const router = express.Router();

router.post("/", createResult);
router.get("/", getResults);
router.get("/:id", getResult);
// router.put("/:id", updateResult);
router.delete("/:id", deleteResult);

export default router;