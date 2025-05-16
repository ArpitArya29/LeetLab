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
        console.log(req.body);
        
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

                console.log("Result:------------",result);
                
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


export const getAllProblems = async(req, res)=>{}


export const getProblemById = async(req, res)=>{}


export const updateProblem = async(req, res)=>{}


export const deleteProblem = async(req, res)=>{}


export const getAllProblemsSolvedByUser = async(req, res)=>{}