import AcademicSession from "../models/Session.js";

export const createSession = async (req, res) => {
    try {
    const { name, startDate, endDate } = req.body;

    const existingSession = await AcademicSession.findOne({ name });

    if (existingSession) {
      return res.status(409).json({
        success: false,
        message: "Academic session already exists",
      });
    }

    const session = await AcademicSession.create({
      name,
      startDate,
      endDate,
    });

    res.status(201).json({
      success: true,
      message: "Academic session created successfully",
      data: session,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}


//this is rto get all sessions
export const getAcademicSessions = async (req, res) => {
  try {
    const sessions = await AcademicSession.find().sort({ startDate: -1, });

    res.status(200).json({
      success: true,
      data: sessions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// this is to get a singel session

export const getAcademicSession = async (req, res) => {
  try {
    const session = await AcademicSession.findById(req.params.id);

    if (!session) {
     return res.status(404).json({
        success: false,
        message: "Academic session not found",
      });
    }

    res.status(200).json({
      success: true,
      data: session,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


//to updatre a session

export const updateAcademicSession = async (req, res) => {
  try {
    const session = await AcademicSession.findByIdAndUpdate(
      req.params.id,
      req.body,
      { returnDocument: "after", upsert: true }
    );

    if (!session) {
      return res.status(404).json({
        success: false,
        message: "Academic session not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Academic session updated successfully",
      data: session,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//to delete a session 

export const deleteSession = async (req, res) => {
    try {
        const session = await AcademicSession.findByIdAndDelete( req.params.id )

        if (!session) {
            return res.status(404).json({
                success: false,
                message: "Academic session not found",
            });
        }

    res.status(200).json({
      success: true,
      message: "Academic session deleted successfully",
    });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message })
    }
    
}
