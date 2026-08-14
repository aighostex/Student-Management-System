import PromotionHistory from "../models/PromotionHistory.js";


// Get all promotion history
export const getPromotionHistories = async (req, res) => {
  try {
    const filter = {};

    if (req.query.student) {
      filter.student = req.query.student;
    }

    if (req.query.academicSession) {
      filter.academicSession =
        req.query.academicSession;
    }

    if (req.query.status) {
      filter.status = req.query.status;
    }

    const histories = await PromotionHistory.find(filter)
        .populate("student", "name idNumber")
        .populate("fromLevel", "name code")
        .populate("toLevel", "name code")
        .populate(
          "academicSession",
          "name startDate endDate"
        ).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: histories.length,
      data: histories,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Get one promotion history
export const getPromotionHistory = async (req, res) => {
  try {
    const history = await PromotionHistory.findById(req.params.id)
        .populate("student", "name idNumber")
        .populate("fromLevel", "name code")
        .populate("toLevel", "name code")
        .populate(
          "academicSession",
          "name startDate endDate"
        );

    if (!history) {
      return res.status(404).json({
        success: false,
        message: "Promotion history not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: history,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};