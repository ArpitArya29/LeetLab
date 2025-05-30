import { db } from "../libs/db.js";

export const getAllSubmission = async(req,res) => {
    try {
        // get the userid of currently logged-in user
        const userId = req.user.id;
        
        const submissions = await db.submission.findMany({
            where:{
                userId
            }
        })

        res.status(200).json({
            success:true,
            message:"Submissions fetched successfully",
            submissions
        })
    } catch (error) {
        console.log(error);
        
        return res.status(500).json({
            success:false,
            error:"Failed to fetched submissions",
        })
    }
}

export const getSubmissionsForProblem = async(req,res) => {
    try {
        const userId = req.user.id;

        const problemId = req.params.problemId;

        const submissions = await db.submission.findMany({
            where:{
                userId,
                problemId
            }
        })

        res.status(200).json({
            success:true,
            message:"Submissions with problem-id fetched successfully",
            submissions
        })
    } catch (error) {
        console.log(error);
        
        return res.status(500).json({
            success:false,
            error:"Failed to fetched submissions",
        })
    }
}

export const getAllSubmissionCountsForProblem = async(req,res) => {
    try {

        const problemId = req.params.problemId;

        const submissionCount = await db.submission.count({
            where:{
                problemId
            }
        })

        res.status(200).json({
            success:true,
            message:"All submission count fetched for the problem",
            count:submissionCount
        })
    } catch (error) {
        console.log(error);
        
        return res.status(500).json({
            success:false,
            error:"failed to fetched submission count",
        })
    }
}