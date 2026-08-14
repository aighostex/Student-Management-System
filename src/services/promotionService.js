import Enrollment from "../models/Enrolment.js";
import Result from "../models/Result.js";
import PromotionRule from "../models/PromotionRule.js";
import PromotionHistory from "../models/PromotionHistory.js";
import AcademicSession from "../models/Session.js";
import Student from "../models/Student.js";
import Class from "../models/Class.js";





export const runPromotion = async (sessionId) => {
    const session = await AcademicSession.findById(sessionId);  // get academic session

    if (!session) {
        throw new Error("Academic session not found");
    }

    // check if session is ended
    if (new Date() < session.endDate) {
        throw new Error("Academic session has not ended");
    }

    // check if promotion is done
    if (session.promotionStatus === "completed") {
        throw new Error(
            "Promotion has already been completed for this session"
        );
    }


    const enrollments = await Enrollment.find({ academicSession: sessionId  }) //get enrollments
        .select("student level class")
        .lean();

    if (!enrollments.length) {
        throw new Error(
            "No levels student enrollments found for this session"
        );
    }

   
    const levelIds = [
        ...new Set(
            enrollments.map(
                (enrollment) =>
                    enrollment.level.toString()
            )
        ),
    ];


    // this array saves results of promotion
    const promotionResults = [];

   //for each level get all the classes in that level
    for (const levelId of levelIds) {
        let classes = await Class.find({ level: levelId }).select("_id name level").lean();  // used .lean() to get light json data

        if (!classes.length) {
            const defaultClass =
                await Class.findOneAndUpdate({ level: levelId, name: "Class A" },
                    {
                        $setOnInsert: {
                            level: levelId,
                            name: "Class A",
                        },
                    },
                    {
                        upsert: true,
                        returnDocument: "after",
                    }
                ).lean();

            classes = [defaultClass];
        }

        const classIds = classes.map((classItem) => classItem._id);

       //get the promotion rule
        const rule = await PromotionRule.findOne({ fromLevel: levelId, active: true})

        if (!rule) {
            throw new Error(
                `No promotion rule has been configured for level ${levelId}, set Promotion rule to continue`
            );
        }

        // get enrollments in that level
        const levelEnrollments = enrollments.filter((enrollment) => enrollment.level.toString() === levelId.toString());



        // this creates batch based on students in class
        const getBatchSize = (totalStudents) => {
            if (totalStudents <= 100) return totalStudents;
            if (totalStudents <= 1000) return 100;
            if (totalStudents <= 5000) return 250;
            if (totalStudents <= 10000) return 500;

            return 1000;
        };

        const BATCH_SIZE = getBatchSize(levelEnrollments.length);

        if (!levelEnrollments.length) {
            continue;
        }


        // process starts in batches
        for (
            let start = 0; start < levelEnrollments.length; start += BATCH_SIZE) {
            const batch = levelEnrollments.slice( start, start + BATCH_SIZE );

            const studentIds = batch.map(
                (enrollment) => enrollment.student
            );

            const enrollmentIds = batch.map((enrollment) => enrollment._id );

            // gets the resulst for this batch 
            const results = await Result.find({ student: { $in: studentIds }, enrollment: { $in: enrollmentIds }})
                .populate( "course", "courseTitle passMark" ).lean();

            // maps results and group to each student
            const resultsByStudent = new Map();

            for (const result of results) {
                const studentId =
                    result.student.toString();

                if (
                    !resultsByStudent.has(
                        studentId
                    )
                ) {
                    resultsByStudent.set(
                        studentId,
                        []
                    );
                }

                resultsByStudent.get(studentId).push(result);
            }

           

            // these arrays saves the evaluation, history and enrollment to be carried out for a batch
            const studentOperations = [];
            const historyDocuments = [];
            // const newEnrollmentDocuments = [];



            //evaluate each stuent in the bacth by iterating
            for (const enrollment of batch) {
                const studentId = enrollment.student.toString();

                const studentResults = resultsByStudent.get( studentId ) || [];

                

                // for student with no result, it sends error
                if (!studentResults.length) {
                    promotionResults.push({
                        student: enrollment.student,
                        level: levelId,
                        status: "no_results",
                     });

                    continue;
                }

                let totalScore = 0;
                let failedCourses = 0;

                

                // calculation of result, total score and failed courses
                for (const result of studentResults) {
                    const score =
                        Number(result.score) || 0;

                    totalScore += score;

                    const passMark = result.course?.passMark ?? rule.defaultPassMark;

                    if (score < passMark) {
                        failedCourses++;
                    }
                }

                const average = totalScore / studentResults.length;

                

                // evaluate student promotion criteria
                const qualifies = average >= rule.minimumAverage && failedCourses <= rule.maximumFailedCourses;

                
                if (qualifies) {
                    // pushes to studenOps array
                    studentOperations.push({
                        updateOne: {
                            filter: { _id: enrollment.student },
                            update: {
                                $set: {
                                    level: rule.toLevel,
                                    status:  "promoted",
                                },
                            },
                        },
                    });

                    // pushes to histrydoc
                    historyDocuments.push({
                        student: enrollment.student,
                        academicSession: sessionId,
                        fromLevel: rule.fromLevel,
                        toLevel: rule.toLevel,
                        status: "promoted",
                        average,
                        failedCourses,
                        reason:
                            "He passed",
                    });

                    // this willl work if I have a nextSession
                    // if (session.nextSession) {
                    //     newEnrollmentDocuments.push({
                    //         student: enrollment.student,
                    //         academicSession: session.nextSession,
                    //         level: rule.toLevel,
                    //         class: null,
                    //     });
                    // }

                    promotionResults.push({
                        student: enrollment.student,
                        status: "promoted",
                        average,
                        failedCourses,
                        fromLevel: rule.fromLevel,
                        toLevel: rule.toLevel,
                    });
                } else {

                    // repeated student
                    studentOperations.push({
                        updateOne: {
                            filter: { _id: enrollment.student },
                            update: {
                                $set: { status: "repeated" },
                            },
                        },
                    });

                    historyDocuments.push({
                        student: enrollment.student,
                        academicSession: sessionId,
                        fromLevel: rule.fromLevel,
                        toLevel: null,
                        status: "repeated",
                        average,
                        failedCourses,
                        reason: "Student is to repeat!",
                    });


                    // if (session.nextSession) {
                    //     newEnrollmentDocuments.push({
                    //         student: enrollment.student,
                    //         academicSession: session.nextSession,
                    //         level: rule.fromLevel,
                    //         class: null,
                    //     });
                    // }

                    promotionResults.push({
                        student: enrollment.student,
                        status: "repeated",
                        average,
                        failedCourses,
                        fromLevel: rule.fromLevel,
                        toLevel: null,
                    });
                }
            }

           
            if (studentOperations.length) { await Student.bulkWrite( studentOperations )} // this bulk updates students in that batch

            if (historyDocuments.length) { await PromotionHistory.insertMany( historyDocuments )} // sends history of the batch

            // if ( newEnrollmentDocuments.length) { await Enrollment.insertMany( newEnrollmentDocuments );}
        }
    }

    // finally promotion is completed
    session.promotionStatus = "completed";
    await session.save();
     return { 
        sessionId,
        totalStudents: promotionResults.length,
        results: promotionResults,
    };
};
