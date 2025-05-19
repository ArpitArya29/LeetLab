import { pollBatchResults, submitBatch } from "../libs/judge0.lib.js";

export const executeCode = async (req,res)=>{
    try {
        const {source_code, language_id, stdin, expected_outputs, problemId} = req.body;
    
        // from logged-in user
        const userId = req.user.id;

        // validate test cases
        if(!Array.isArray(stdin) || stdin.length===0 || !Array.isArray(expected_outputs) || expected_outputs.length!==stdin.length){
            return res.status(400).json({
                message:"Invalid or Missing test case"
            })
        }

        // prepare each testcase for judge0 batch submission
        const submissions = stdin.map((input)=>({
            source_code,
            language_id,
            stdin:input,
        }));

        // send this batch of submission to judge0
        const submitResponse = await submitBatch(submissions);

        const tokens = submitResponse.map((res)=>res.token);

        // pool judge0 for the results of all submitted test case
        const results = await pollBatchResults(tokens);

        console.log("Result------");
        console.log(results);

        res.status(200).json({
            success:true,
            message:"All testCases passes",
            results
        })
        
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Error while executing testcases",
            error
        })
    }
}