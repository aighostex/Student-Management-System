import express from "express";
import { runPromotionController } from "../controllers/promotionController.js";

const router = express.Router();

router.post( "/:sessionId", runPromotionController );

export default router;