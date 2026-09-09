import Term from "../models/Term.js";
import AcademicSession from "../models/Session.js";

export const createTermsForSession = async ( sessionId,terms) => {

    const session = await AcademicSession.findOne({ _id: sessionId });

    if (!session) { 
        throw new Error("Academic session not found"); 
    }

    const existingTerms = await Term.countDocuments({ academicSession: sessionId });

    if (existingTerms > 0) {
        throw new Error(
            "Terms already exist for this academic session"
        );
    }

    if (!terms || terms.length !== 3) {
        throw new Error(
            "An academic session must have three terms"
        );
    }

    const createdTerms = await Term.insertMany(
        terms.map((term) => ({
            academicSession: sessionId,
            name: term.name,
            startDate: term.startDate,
            endDate: term.endDate,
            status: "upcoming",
        }))
    );

    return createdTerms;
};


export const getActiveTerm = async (sessionId, schoolId) => {

    const term = await Term.findOne({
        academicSession: sessionId,
        school: schoolId,
        status: "active",
    });

    if (!term) {
        throw new Error(
            "There is no active term for this academic session"
        );
    }

    return term;
};


export const startTerm = async (termId, schoolId) => {

    const term = await Term.findById({
        _id:termId,
        // school: schoolId.toString()
});

    if (!term) {
        throw new Error("Term not found");
    }

    const session = await AcademicSession.findById({ 
        _id: term.academicSession,
        school: schoolId
     });

    if (!session) {
        throw new Error("Academic session not found");
    }

    if (session.status !== "active") {
        throw new Error(
            "Academic session is not active"
        );
    }

    if (term.status === "active") {
        throw new Error("Term is already active");
    }

    if (term.status === "completed") {
        throw new Error(
            "A completed term cannot be started again"
        );
    }

    const activeTerm = await Term.findOne({
        academicSession: term.academicSession,
        // school: schoolId,
        status: "active",
    });

    if (activeTerm) {
        throw new Error(
            `The ${activeTerm.name} term is currently active`
        );
    }
    //checks for trhe previous term
    let previousTermName = null;

    if (term.name === "Second") { 
        previousTermName = "First"; 
    }

    if (term.name === "Third") { 
        previousTermName = "Second"; 
    }

    if (previousTermName) { 
        const previousTerm = await Term.findOne({ 
            academicSession: term.academicSession, 
            school: schoolId, 
            name: previousTermName, 
        });

        if ( previousTerm && previousTerm.status !== "completed" ) {
             throw new Error( `The ${previousTerm.name} term must be completed first` );
        } 
    }

    term.status = "active";

    await term.save();

    return term;
};


export const endTerm = async (termId, schoolId) => {

    const term = await Term.findById({_id: termId, school: schoolId});

    if (!term) {
        throw new Error("Term not found");
    }

    if (term.status !== "active") {
        throw new Error(
            "Only an active term can be ended"
        );
    }

    // if (new Date() < term.endDate) {
    //     throw new Error(
    //         "The term has not reached its end date"
    //     );
    // }

    term.status = "completed";

    await term.save();

    return term;
};



export const completeSession = async (sessionId ) => {

    const session = await AcademicSession.findById(sessionId );

    if (!session) {
        throw new Error(
            "Academic session not found"
        );
    }

    const thirdTerm = await Term.findOne({
        academicSession: sessionId,
        // school: schoolId,
        name: "Third",
    });

    if (!thirdTerm) {
        throw new Error(
            "Third term not found"
        );
    }

    if (thirdTerm.status !== "completed") {
        throw new Error(
            "Third term must be completed before the academic session can end"
        );
    }

    session.status = "completed";
    await session.save();
    return session;
};


