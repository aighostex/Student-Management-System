import Term from "../models/Term.js";
import { createTermsForSession, getActiveTerm,  startTerm, endTerm, completeSession } from "../services/termServices.js";

export const createTerms = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const { terms } = req.body;

        const createdTerms = await createTermsForSession( 
            // req.user.school,
            sessionId,
            terms
        );

        res.status(201).json({
            success: true,
            message: "Academic session terms created",
            data: createdTerms,
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



export const activeTerm = async (req, res) => {
    try {
        const { sessionId } = req.params;

        const term = await getActiveTerm( 
            // req.user.school,
            sessionId,
            
         );

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





export const activateTerm = async (req, res) => {
try {
    const { termId } = req.params;

    const term = await startTerm(
        // req.user.school,
        termId,
    );

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
    return res.status(409).json({
        success: true,
        message: error.message
    })
}
}


export const concludeTerm = async (req, res) => {
    try {
        const { termId } = req.params
        const term = await endTerm(
            termId,
            // req.user.school
        );

        if (!term) {
            return res.status(409).json({
                success: true,
                message: 'Term does not exist!'
            })
        }

        res.status(200).json({
            success: true,
            message: "Term has been ended successfully",
            data: term,
        })
    } catch (error) {
        return res.status(409).json({ success: false, message: error.message, });
    }
}


export const endSession = async (req, res) => {
    try {
        const { id } = req.params;

        // console.log("PARAMS:", req.params);
        // console.log("SESSION ID:", id);

        const session = await completeSession(
            id,
            // req.user.school
        )

        res.status(200).json({
            success: true,
            message: "Academic session completed successfully",
            data: session
        })
    } catch (error) {
        res.status(400).json({ success: false, message: error.message})
    }
}


export const terms = async (req, res) => {
    try {
        const terms = await Term.find()

        res.status(200).json({
            success: true,
            data: terms
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}