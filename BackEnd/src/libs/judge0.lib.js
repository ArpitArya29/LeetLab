import axios from "axios"

export const getJudge0LanguageId = (language) =>{
    const languageMap = {
        "PYTHON":71,
        "JAVA":62,
        "JAVASCRIPT":63,
    }

    return languageMap[language.toUpperCase()] || null;
}

export const getLanguageName = (languageId)=>{
    const languageById = {
        71:"PYTHON",
        62:"JAVA",
        63:"JAVASCRIPT",
    }

    return languageById[languageId] || null;
}


export const submitBatch = async (submissions)=>{
    const {data} = await axios.post(`${process.env.JUDGE0_API_URL}/submissions/batch?base64_encoded=false`,{
        submissions
    })

    console.log("Submission results: ", data);

    return data; // [{token},{token},{token}]
    

}


// for checking after ms/1000 sec
const sleep = (ms)=> new Promise((resolve)=>setTimeout(resolve,ms))
export const pollBatchResults = async (tokens)=>{
    while(true){
        const {data} = await axios.get(`${process.env.JUDGE0_API_URL}/submissions/batch`, {
            params:{
                tokens:tokens.join(","),
                base64_encoded:false,
            }
        })

        const results = data.submissions;

        const isAllDone = results.every(
            // 1 for queue, 2 for processing
            (r)=>r.status.id!==1 && r.status.id!==2
        )

        if(isAllDone) return results

        await sleep(1000)
    }
}