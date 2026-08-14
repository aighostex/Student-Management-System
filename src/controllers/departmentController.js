import Department from "../models/Department.js";

// to create a department

export const createDepartment = async (req, res) => {

    try {
        const { name, code, description } = req.body;

        const existingDepartment = await Department.findOne({ name });

        if (existingDepartment) {
            return res.status(409).json({
                success: false,
                message: "Department already exists",
            });
        }

        const department = await Department.create({
            name,
            code,
            description,
        });

    res.status(201).json({
      success: true,
      message: "Department created successfully",
      data: department,
    });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
    
}

//this is to get the list of all departments
export const getDepartments = async (req, res) => {
  try {
    const departments = await Department.find().sort({ name: 1 });

    res.status(200).json({
      success: true,
      data: departments,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


// this gets just one department
export const getDepartment = async (req, res) => {
  try {
    const department = await Department.findById(req.params.id);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: department,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


//this is to update the deartment
export const updateDepartment = async (req, res) => {
  try {
    const department = await Department.findByIdAndUpdate(
      req.params.id,
      req.body,
      { returnDocument: "after", upsert: true }
    );

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Department updated successfully",
      data: department,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


//this deletes a department
export const deleteDepartment = async (req, res) => {
  try {
    const department = await Department.findByIdAndDelete( req.params.id );

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Department deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};