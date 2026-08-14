import { createTermsForSession, getActiveTerm,  startTerm, endTerm } from "../services/termServices.js";

export const createTerms = async (req, res) => {
    try {
        const { sessionId } = req.params;

        const terms = await createTermsForSession( sessionId );

        res.status(201).json({
            success: true,
            message: "Academic session terms created",
            data: terms,
        })

    } catch (error) {

        if (error.code === 11000) {
            res.status(409).json({
                success: false,
                message: error.message
            })
        }
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};



export const getActiveTerm = async (req, res) => {
    try {
        const { sessionId } = req.params;

        const term = await getActiveTerm( sessionId );

        if (!term) {
            return res.status(404).json({
                success: false,
                message: "No active term",
            })
        }

        res.status(200).json({
            success: true,
            data: term,
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
};





export const startTerm = async (req, res) => {
try {
    const { sesssionId } = req.params;

    const term = await startTerm(termId);

    if (!term) {
        return res.status(404).json({
            success: false,
            message: "Term not foudn"
        })
    }

    res.status(200).json({
        success: true,
        message: 'Term has been activated'
    })
} catch (error) {
    return res.status(409).join({
        success: true,
        message: "Term is already activated!"
    })
}
}


export const endTerm = async (req, res) => {
    try {
        const term = await endTerm(termId);

        if (!term) {
            return res.status(409).json({
                success: true,
                message: 'Term does not exist!'
            })
        }

        res.status(200)
    } catch (error) {
        
    }
}