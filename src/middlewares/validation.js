import { body, validationResult } from "express-validator";

export const validate = (req, res, next) =>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        })
    }
    next();
}

export const studentValidation = [
    body('firstName').notEmpty().withMessage('Name is required').trim(),
    body('lastName').notEmpty().withMessage('Name is required').trim(),
    body('middleName').notEmpty().withMessage('Name is required').trim(),
    validate
]

export const courseValidation = [
    body('courseTitle').notEmpty().withMessage('Course title is required').trim(),
    body('courseCode').notEmpty().withMessage('Please add course code').trim(),
    body('level').notEmpty().trim(),
    validate
]

export const classValidation = [
    body('capacity').notEmpty().isLength({min: 1, max: 50}).trim()
]