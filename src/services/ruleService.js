import PromotionRule from '../models/PromotionRule.js';
import AcademicSession from '../models/Session.js';
import Level from '../models/Level.js';

export const createPromotionRules = async (rules) => {
  if (!rules || rules.length === 0) {
    throw new Error("At least one promotion rule is required");
  }
  const session = rules.map(r => r.academicSession)
  const fromLevels = rules.map(r => r.fromLevel);
  const toLevels = rules.map(r => r.toLevel);
  const allLevelIds = [...fromLevels, ...toLevels];

//   const sessionFind = await AcademicSession.find({_id: {$in: session}})
  const foundLevels = await Level.find({ _id: { $in: allLevelIds } });
//   if (foundLevels.length !== allLevelIds.length) {
//     throw new Error("One or more levels not found");
//   }

//   const existingRules = await PromotionRule.find({
//     fromLevel: { $in: fromLevels },
//     active: true,
//   });

//   if (existingRules.length > 0) {
//     throw new Error("An active promotion rule already exists for one or more levels");
//   }

  const createdRules = await PromotionRule.insertMany(
    rules.map((rule) => ({
    academicSession: rule.academicSession,
      fromLevel: rule.fromLevel,
      toLevel: rule.toLevel,
      minimumAverage: rule.minimumAverage || null,
      maximumFailedCourses: rule.maximumFailedCourses || null,
      requiresApproval: rule.requiresApproval ?? false,
      active: true,
    }))
  );

  return createdRules;
}