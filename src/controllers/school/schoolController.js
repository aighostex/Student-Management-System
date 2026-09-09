import School from "../../models/School.js";


export const createSchool = async (req, res) => {
    try {
         const { name, code, email, phone, address } = req.body;

         if (!name || !code) {
            return res.status(400).json({
                success: false,
                message: "School name and code are required",
            });
        }

        const existingSchool = await School.findOne({name}, {code: code.toUpperCase()})

        if (existingSchool) {
            return res.status(409).json({
                success: false,
                message: "A school with this name and code already exists",
            });
        }

        const school = await School.create({
            name,
            code,
            email,
            phone,
            address,
        })

        res.status(201).json({
            success: true,
            message: "School created successfully",
            data: school,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to create school",
        });
    }
}