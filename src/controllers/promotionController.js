import { runPromotion } from "../services/promotionService.js";

export const runPromotionController = async (req, res) => {
    try {
        const { sessionId } = req.params;

        const result = await runPromotion(sessionId);

        return res.status(200).json({
            success: true,
            message: "Promotion completed successfully",
            data: result,
        });
    } catch (error) {
        // console.error("Promotion error:", error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};