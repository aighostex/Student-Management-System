import Enrollment from "../models/Enrolment.js";
import Result from "../models/Result.js";
import PromotionRule from "../models/PromotionRule.js";
import PromotionHistory from "../models/promotionHistory.js";
import AcademicSession from "../models/Session.js";
import Student from "../models/Student.js";
import Level from "../models/Level.js";
import Class from "../models/Class.js";
import Term from "../models/Term.js";


const getBatchSize = (studentCount) =>{
    if(studentCount <= 0) return 0;
    if(studentCount <= 50) {
        return studentCount
    }
    return 50;
}

const annualAverage = (first, second, third) =>{
    return (first+second+third)/3
}

export const runPromotion = async (sessionId) => {
    const session = await AcademicSession.findById(sessionId);
    if(!session){
        throw new Error("Academic session not found");
    }

    //check if session has ended
    // if(new Date() < session.endDate){
    //     throw new Error("Session has not ended");
    // }
    if (session.status !== 'completed') {
        throw new Error("Session has not ended");
        
    }

    // if(session.promotionStatus === "completed"){
    //     throw new Error("Promotion has been done");
        
    // }


    //get the terms
    const terms = await Term.find({academicSession: sessionId}).sort({name: 1})
    if(terms.length !== 3){
        throw new Error("There must be three terms");
    }

    const firstTerm = terms.find((term)=> term.name === 'First')
    const secondTerm = terms.find((term)=> term.name === 'Second')
    const thirdTerm = terms.find((term)=> term.name === 'Third')
     
    if(!firstTerm || !secondTerm || !thirdTerm){
        throw new Error("First, Second, and third terms are needed");
    }

    //we get all the levels
    const levels = await (await Level.find({})).sort({order: -1})
    if(!levels.length){throw new Error("No levels for this session");
    }

    //start promotion
    session.promotionStatus = 'processing'
    await session.save();

    const promotionResults = [];

    for (const level of levels) {
        const enrollments = await Enrollment.find({
            level: level._id,
            academicSession: session._id
        }).populate("student");
        // get the enrollment of graduating level
        if (level.isGraduatingLevel) {
        for (const enrollment of enrollments) {
            const student = enrollment.student;
            student.status = "graduated"; // 
            await student.save();
            // optionally create graduation history here
        }
            continue;
        }
        //gets promotion rule set for each level
        const rule = await PromotionRule.findOne({fromLevel:level._id});
            if(!rule){throw new Error(`No existing rule for ${level.name}`);
        }

        //get classes in levels
        let classes = await Class.find({level:level._id})
    
        //checks enrollment in each presesnt class and gets student    
        for (const currentClass of classes) {
            const enrollment = await Enrollment.find({
                academicSession: sessionId,
                level: level._id,
                class: currentClass._id,
            }).populate('student')

            if(!enrollment.length){continue}

            const batchSize = getBatchSize(enrollment.length) //bacth size takes the number of student in a class to process
            // loops through each enrollemnt of a student and maps erollemnt to student ids
            for (let i = 0; i < enrollment.length; i += batchSize) {
                const batch = enrollment.slice(i, i+batchSize);
                const enrollmentIds = batch.map((enrollment)=>{
                    enrollment._id
                });
                
                //now we get the result for each term
                const results = await Result.find({
                    enrollment: {$in: enrollmentIds},
                    term: {$in: [firstTerm._id, secondTerm._id, thirdTerm._id]}
                }).populate("course", "courseTitle courseCode passMark")    
                
                //map student to their result
                const resultMap = new Map();
                for(let result of results) {
                  const key = `${result.enrollment}_${result.course._id}`;
                  if (!resultMap.has(key)) {
                    resultMap.set(key, {
                        enrollment: result.enrollment,
                        course: result.course, first: null, second: null, third: null
                    })
                  }

                  const courseResult = resultMap.get(key)
                  if (result.term.toString()=== firstTerm._id.toString()) { courseResult.first = result.score }
                  if (result.term.toString()=== secondTerm._id.toString()) { courseResult.second = result.score }
                  if (result.term.toString()=== thirdTerm._id.toString()) { courseResult.third = result.score }

                }

                //arrays to save student operations befor push
                const studentUpdates = [];
                const enrollmentCreates = [];
                const historyCreates = [];

                for (const enrollment of batch) {
                    const student = enrollment.student
                    const studentCourses = [...resultMap.values()].filter((item)=> item.enrollment.toString() === enrollment._id.toString())

                    if (!studentCourses.length) {
                        historyCreates.push({
                            student:student._id,
                            academicSession: sessionId,
                            fromLevel: level._id,
                            toLevel: null,
                            fromClass: currentClass._id,
                            status:"pending",
                            average:0,
                            failedCourses:0,
                            reason: "No result for this session"
                        })
                        continue
                    }

                    const annualScores = []

                    let failedCourses = 0
                    for (const courseResult of studentCourses) {
                        if (courseResult.first === null || courseResult.second === null || courseResult.third === null) {
                            continue
                        }
                        const annualScore = annualAverage(courseResult.first, courseResult.second, courseResult.third);
                        annualScores.push(annualScore);
                        const passMark = courseResult.course.passMark ?? rule.defaultPassMark;
                        if (annualScore < passMark) {
                            failedCourses ++
                        }
                    }
                    if (!annualScores.length) {
                        historyCreates.push({
                            student: student._id,
                            academicSession: sessionId,
                            fromLevel: level._id,
                            toLevel: null,
                            fromClass: currentClass._id,
                            status: 'pending',
                            average: 0, 
                            failedCourses: 0,
                            reason: 'no complete result'
                        })
                        promotionResults.push({
                            student: student._id,
                            status: "pending",
                            reason: "Incomplete results"
                        })
                        continue
                    }
                    const total = annualScores.reduce((sum, score) => sum + score, 0)
                    const average = total/annualScores.length
                    const qualifies = average >= rule.minimumAverage && failedCourses <= rule.maximumFailedCourses;

                    if (qualifies) {
                        studentUpdates.push({
                            updateOne: {
                                filter: {_id: student._id },
                                update: {$set: {
                                    level: rule.toLevel,
                                    status: "promoted"
                                }}
                            }
                        })
                        enrollmentCreates.push({
                            student: student._id,
                            academicSession: sessionId,
                            level: rule.toLevel,
                            class: null,
                        })
                        historyCreates.push({
                            student: student._id,
                            academicSession: sessionId,
                            fromLevel: level._id,
                            toLevel: rule.toLevel,
                            fromClass: currentClass._id,
                            status: 'promoted',
                            average,
                            failedCourses,
                            reason: 'Student Passed',
                            requiresApproval: rule.requiresApproval,
                            approved: !rule.requiresApproval,
                        })

                        promotionResults.push({
                            student:student._id,
                            status: "promoted",
                            average,
                            failedCourses,
                            fromLevel: level._id,
                            toLevel: rule.toLevel,
                        })
                    } else {
                        studentUpdates.push({
                            updateOne: {
                                filter: { _id: student._id },
                                update: { $set: { status: "repeated" }}
                            }
                        });

                        enrollmentCreates.push({
                            student: student._id,
                            academicSession: sessionId,
                            level: level._id,
                            class: null,
                        });


                        historyCreates.push({
                            student: student._id,
                            academicSession: sessionId,
                            fromLevel: level._id,
                            toLevel:  null,
                            fromClass: currentClass._id,
                            status:  "repeated",
                            average,
                            failedCourses,
                            reason: "Student did not meet promotion requirements",
                            requiresApproval: rule.requiresApproval,
                            approved: false,
                        });

                        promotionResults.push({
                            student: student._id,
                            status: "repeated",
                            average,
                            failedCourses,
                        });
                    }
                }
                if (studentUpdates.length) {
                    await Student.bulkWrite(studentUpdates)
                }                
                if (enrollmentCreates.length) {
                    await Enrollment.insertMany(enrollmentCreates)
                }
                if (historyCreates.length) {
                    await PromotionHistory.insertMany(historyCreates)
                }
            }
        }
    }
    session.promotionStatus = "completed"
    await session.save();
    return promotionResults
}