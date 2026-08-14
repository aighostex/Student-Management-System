import PromotionRule from "../models/PromotionRule.js";
import Level from "../models/Level.js";


// Create promotion rule
export const createPromotionRule = async (req, res) => {
  try {
    const {
      fromLevel,
      toLevel,
      minimumAverage,
      maximumFailedCourses,
      requiresApproval,
    } = req.body;

    if (!fromLevel || !toLevel) {
      return res.status(400).json({
        success: false,
        message: "From level and to level are required",
      });
    }

    if (fromLevel === toLevel) {
      return res.status(400).json({
        success: false,
        message:
          "From level and to level cannot be the same",
      });
    }

    const sourceLevel = await Level.findById(fromLevel);

    if (!sourceLevel) {
      return res.status(404).json({
        success: false,
        message: "Source level not found",
      });
    }

    const destinationLevel =
      await Level.findById(toLevel);

    if (!destinationLevel) {
      return res.status(404).json({
        success: false,
        message: "Destination level not found",
      });
    }

    // Prevent multiple active rules for same source level
    const existingRule =
      await PromotionRule.findOne({
        fromLevel,
        active: true,
      });

    if (existingRule) {
      return res.status(409).json({
        success: false,
        message:
          "An active promotion rule already exists for this level",
      });
    }

    if (
      minimumAverage !== undefined &&
      (minimumAverage < 0 || minimumAverage > 100)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Minimum average must be between 0 and 100",
      });
    }

    if (
      maximumFailedCourses !== undefined &&
      maximumFailedCourses < 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Maximum failed courses cannot be negative",
      });
    }

    const rule = await PromotionRule.create({
      fromLevel,
      toLevel,
      minimumAverage,
      maximumFailedCourses,
      requiresApproval:
        requiresApproval ?? false,
      active: true,
    });

    const populatedRule =
      await PromotionRule.findById(rule._id)
        .populate("fromLevel", "name code")
        .populate("toLevel", "name code");

    return res.status(201).json({
      success: true,
      message: "Promotion rule created successfully",
      data: populatedRule,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Get all promotion rules
export const getPromotionRules = async (req, res) => {
  try {
    const filter = {};

    if (req.query.fromLevel) {
      filter.fromLevel = req.query.fromLevel;
    }

    if (req.query.toLevel) {
      filter.toLevel = req.query.toLevel;
    }

    if (req.query.active !== undefined) {
      filter.active = req.query.active === "true";
    }

    const rules = await PromotionRule.find(filter)
      .populate("fromLevel", "name code")
      .populate("toLevel", "name code")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: rules.length,
      data: rules,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Get one promotion rule
export const getPromotionRule = async (req, res) => {
  try {
    const rule = await PromotionRule.findById(
      req.params.id
    )
      .populate("fromLevel", "name code")
      .populate("toLevel", "name code");

    if (!rule) {
      return res.status(404).json({
        success: false,
        message: "Promotion rule not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: rule,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Update promotion rule
export const updatePromotionRule = async (req, res) => {
  try {
    const {
      fromLevel,
      toLevel,
      minimumAverage,
      maximumFailedCourses,
      requiresApproval,
      active,
    } = req.body;

    const rule = await PromotionRule.findById(
      req.params.id
    );

    if (!rule) {
      return res.status(404).json({
        success: false,
        message: "Promotion rule not found",
      });
    }

    if (
      minimumAverage !== undefined &&
      (minimumAverage < 0 || minimumAverage > 100)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Minimum average must be between 0 and 100",
      });
    }

    if (
      maximumFailedCourses !== undefined &&
      maximumFailedCourses < 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Maximum failed courses cannot be negative",
      });
    }

    if (fromLevel) {
      const exists = await Level.findById(fromLevel);

      if (!exists) {
        return res.status(404).json({
          success: false,
          message: "Source level not found",
        });
      }
    }

    if (toLevel) {
      const exists = await Level.findById(toLevel);

      if (!exists) {
        return res.status(404).json({
          success: false,
          message: "Destination level not found",
        });
      }
    }

    const updatedRule =
      await PromotionRule.findByIdAndUpdate(
        req.params.id,
        {
          ...(fromLevel && { fromLevel }),
          ...(toLevel && { toLevel }),
          ...(minimumAverage !== undefined && {
            minimumAverage,
          }),
          ...(maximumFailedCourses !== undefined && {
            maximumFailedCourses,
          }),
          ...(requiresApproval !== undefined && {
            requiresApproval,
          }),
          ...(active !== undefined && { active }),
        },
        {
          returnDocument: "after",
          upsert: true,
        }
      )
        .populate("fromLevel", "name code")
        .populate("toLevel", "name code");

    return res.status(200).json({
      success: true,
      message: "Promotion rule updated successfully",
      data: updatedRule,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// Delete promotion rule
export const deletePromotionRule = async (req, res) => {
  try {
    const rule = await PromotionRule.findByIdAndDelete(
      req.params.id
    );

    if (!rule) {
      return res.status(404).json({
        success: false,
        message: "Promotion rule not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Promotion rule deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};