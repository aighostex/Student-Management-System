import express from "express";
import { createPromotionRule, getPromotionRules, getPromotionRule, updatePromotionRule, deletePromotionRule } from "../controllers/promotionRule.js";

const router = express.Router();

router.post("/", createPromotionRule);
router.get("/", getPromotionRules);
router.get("/:id", getPromotionRule);
router.put("/:id", updatePromotionRule);
router.delete("/:id", deletePromotionRule);

export default router;