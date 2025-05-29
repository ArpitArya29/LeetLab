import { db } from "../libs/db.js";
import { getLanguageName, pollBatchResults, submitBatch } from "../libs/judge0.lib.js";

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

        // Analyze the test case result
        let allPassed = true;

        const detailedResults = results.map( (result,i)=>{
            const ret_output = result.stdout.trim();
            const expected_output = expected_outputs[i].trim();

            const passed = ret_output===expected_output

            if(!passed) allPassed = false;

            return {
                testCase:i+1,
                passed,
                stdout:ret_output,
                expected:expected_output,
                stderr:result.error || null,
                compileOutput:result.compile_output || null,
                status:result.status.description,
                memory:result.memory?`${result.memory} KB`:undefined,
                time:result.time?`${result.time} s`:undefined
            }
            
        })
        console.log("detailed result");
        
        console.log(detailedResults);

        // store the submission summery
        const submission = await db.submission.create({
            data: {
                userId,
                problemId,
                sourceCode:source_code,
                language:getLanguageName(language_id),
                stdin:stdin.join("\n"),
                stdout:JSON.stringify(detailedResults.map( (r)=>r.stdout)),
                stderr:detailedResults.some( (r)=>r.stderr )
                ? JSON.stringify(detailedResults.map( (r)=>r.stderr))
                : null,
                compileOutput:detailedResults.some( (r)=>r.compile_output )
                ? JSON.stringify(detailedResults.map( (r)=>r.compile_output))
                : null,
                status: allPassed? "Accepted" : "Wrong Answer",
                memory:detailedResults.some( (r)=>r.memory )
                ? JSON.stringify(detailedResults.map( (r)=>r.memory))
                : null,
                time:detailedResults.some( (r)=>r.time )
                ? JSON.stringify(detailedResults.map( (r)=>r.time))
                : null,
            },
        })

        console.log("Submission done");
        

        // if all passed, mark the problem "solved" for that user

        if(allPassed){
            await db.problemSolved.upsert({
                where:{
                    userId_problemId:{
                        userId,
                        problemId
                    }
                },
                update:{},
                create:{
                    userId,
                    problemId
                }
                
            })
        }

        console.log("AllPassed");
        


        // save individual testcase results using detailed-results
        const testCaseResults = detailedResults.map( (result)=>({
            submissionId:submission.id,
            testcase:result.testCase,
            passed:result.passed,
            stdout:result.stdout,
            expected:result.expected,
            compileOutput:result.compile_output,
            status:result.status,
            memory:result.memory,
            time:result.time,
        }))
        console.log("TestCaseResults");
        

        await db.testcaseResult.createMany({
            data:testCaseResults,
        });
        console.log("TestcaseResult created");
        
        
        console.log(submission.id);
        
        const submissionWithTestCase = await db.submission.findUnique({
            where:{
                id:submission.id
            },
            include:{
                testcases:true
            }
        })
        console.log("Submission with testcase");
        

        res.status(200).json({
            success:true,
            message:"All testCases executed succesfully",
            submission:submissionWithTestCase,
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