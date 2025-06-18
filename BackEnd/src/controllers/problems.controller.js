import { db } from "../libs/db.js"
import { getJudge0LanguageId, pollBatchResults, submitBatch } from "../libs/judge0.lib.js";



export const createProblem = async(req, res)=>{
    // fetch all the data from the req.body
    const {title, description, difficulty, tags, examples, constraints, testcases, codeSnippet, referenceSolution} = req.body;

    // check the user role, is ADMIN or not
    if(req.user.role!=="ADMIN"){
        return res.status(403).json({
            error:"You are not allowed to create problem"
        })
    }

    
    try {
        // console.log(req.body);
        
        for(const [language, solutionCode] of Object.entries(referenceSolution)){
            const languageId = getJudge0LanguageId(language)

            if(!languageId){
                return res.status(400).json({
                    error:`Language ${language} not supported`
                })
            }

            const submissions = testcases.map( ({input, output})=>({
                source_code:solutionCode,
                language_id:languageId,
                stdin:input,
                expected_output:output,
            }) )

            const submissionResults = await submitBatch(submissions);

            const tokens = submissionResults.map((res)=>res.token);

            const results = await pollBatchResults(tokens);

            // check for statusid==3 (for successful submission)
            for(let i=0; i<results.length; i++){
                const result = results[i];

                // console.log("Result:------------",result);
                
                if(result.status.id!==3){
                    return res.status(400).json({
                        error:`Testcase ${i+1} failed for language ${language}`
                    })
                }
            }

            // save the problem to the database
            const newProblem = await db.problem.create({
                data:{
                    title, 
                    description, 
                    difficulty, 
                    tags, 
                    examples, 
                    constraints, 
                    testcases, 
                    codeSnippet, 
                    referenceSolution, 
                    userId:req.user.id,
                }
            })

            return res.status(201).json({
                success:true,
                message:"Problem created successfully",
                problem:newProblem
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            error:"Error while creating problem",
        })
    }

}


export const getAllProblems = async(req, res)=>{
    try {
        const problems = await db.problem.findMany({
            include:{
                solvedBy:{
                    where:{
                        userId : req.user.id
                    }
                }
            }
        });

        if(!problems || problems.length===0){
            return res.status(404).json({
                message:"No any problems to display"
            })
        }

        res.status(200).json({
            success:true,
            message:"Problems Feutched successfully",
            problems
        })
    } catch (error) {
        return res.status(500).json({
            error:"Error while Ftching Problems"
        })
    }
}


export const getProblemById = async(req, res)=>{
    const {id} = req.params;
    // console.log(id);
    
    try {
        const problem = await db.problem.findUnique({
            where:{
                id
            }
        })

        if(!problem){
            return res.status(404).json({
                message:"Problem not found"
            })
        }

        res.status(200).json({
            success:true,
            message:"Problem found successfully",
            problem
        })
    } catch (error) {
        return res.status(500).json({
            error:"Error in fetching problem by their id"
        })
    }
}


export const updateProblem = async(req, res)=>{
    // get id from req.params
    // check for id, whether it is present or not
    // same as createProblem controller, but sql query will be update{where id, and then data}
}


export const deleteProblem = async(req, res)=>{
    const {id} = req.params;

    try {
        const problem = await db.problem.findUnique({
            where:{
                id
            }
        })
    
        if(!problem){
            return res.status(404).json({
                message:"Problem not found"
            })
        }

        await db.problem.delete({
            where:{
                id
            }
        })

        res.status(200).json({
            success:true,
            message:"Problem deleted successfully"
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Error while deleting problem",
            error
        })
    }
}


export const getAllProblemsSolvedByUser = async(req, res)=>{
    try {
        const userId=req.user.id;
        const problems = await db.problem.findMany({
            where:{
                solvedBy:{
                    // where solvedBy field is checks with the currently logged-in user
                    some:{
                        userId
                    }
                }
            },
            include:{
                solvedBy:{
                    where:{
                        userId
                    }
                }
            }
        })

        res.status(200).json({
            success:true,
            message:"Fetched all problems solved by the user",
            problems
        })
    } catch (error) {
        console.log(error);
        
        return res.status(500).json({
            success:false,
            error:"Failed to fetch the problems"
        })
    }
}