import { db } from "../libs/db.js"
import { getJudge0LanguageId } from "../libs/judge0.lib.js";



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
        for(const [language, solutionCode] of Object.entries(referenceSolution)){
            const languageId = getJudge0LanguageId(language)

            if(!languageId){
                return res.status(400).json({
                    error:`Language ${language} not supported`
                })
            }

            const submissions = testcases.map( ({input, output})=>{
                
            })
        }
    } catch (error) {
        
    }


    // loop through each reference solution for different languages


    // 
}


export const getAllProblems = async(req, res)=>{}


export const getProblemById = async(req, res)=>{}


export const updateProblem = async(req, res)=>{}


export const deleteProblem = async(req, res)=>{}


export const getAllProblemsSolvedByUser = async(req, res)=>{}