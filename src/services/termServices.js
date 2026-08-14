import Term from "../models/Term.js";
import AcademicSession from "../models/Session.js";

export const createTermsForSession = async ( sessionId,terms) => {

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


export const getActiveTerm = async (sessionId) => {

    const term = await Term.findOne({
        academicSession: sessionId,
        status: "active",
    });

    if (!term) {
        throw new Error(
            "There is no active term for this academic session"
        );
    }

    return term;
};


export const startTerm = async (termId) => {

    const term = await Term.findById(termId);

    if (!term) {
        throw new Error("Term not found");
    }

    const session = await AcademicSession.findById( term.academicSession );

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
        status: "active",
    });

    if (activeTerm) {
        throw new Error(
            `The ${activeTerm.name} term is currently active`
        );
    }

    // check for previous term
    const previousTerm = await Term.findOne({
        academicSession: term.academicSession,
        name: {
            $in: term.name === "Second" ? ["First"] : term.name === "Third" ? ["Second"] : [],
        },
    });

    if (
        previousTerm &&
        previousTerm.status !== "completed"
    ) {
        throw new Error(
            `The ${previousTerm.name} term must be completed first`
        );
    }

    term.status = "active";

    await term.save();

    return term;
};


export const endTerm = async (termId) => {

    const term = await Term.findById(termId);

    if (!term) {
        throw new Error("Term not found");
    }

    if (term.status !== "active") {
        throw new Error(
            "Only an active term can be ended"
        );
    }

    if (new Date() < term.endDate) {
        throw new Error(
            "The term has not reached its end date"
        );
    }

    term.status = "completed";

    await term.save();

    return term;
};



export const completeSession = async (sessionId) => {

    const session = await AcademicSession.findById(
        sessionId
    );

    if (!session) {
        throw new Error(
            "Academic session not found"
        );
    }

    const thirdTerm = await Term.findOne({
        academicSession: sessionId,
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


