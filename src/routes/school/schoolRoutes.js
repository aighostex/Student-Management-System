import express from 'express'
import { createSchool } from "../../controllers/school/schoolController.js";

const router = express.Router()

router.post('/', createSchool)

export default router