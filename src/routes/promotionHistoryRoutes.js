import express from "express";
import { getPromotionHistories, getPromotionHistory } from "../controllers/promotionHistoryctrl.js";

const router = express.Router();

router.get("/", getPromotionHistories);
router.get("/:id", getPromotionHistory);

export default router;