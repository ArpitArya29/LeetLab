import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";


export const useExecutionStore = create( (set)=>({
    isRunning:false,
    isSubmitting:false,
    submission:null,

    runCode:async( source_code, language_id, stdin, expected_outputs, problemId)=>{
        try {
            set({isRunning:true});

            const res = await axiosInstance.post("/execute-code/run", {source_code, language_id, stdin, expected_outputs, problemId});

            set({submission:res.data.executeResult});

            toast.success(res.data.message || "Code Executed");

        } catch (error) {
            console.log("Error executing code", error);
            toast.error("Error executing code");
        }
        finally{
            set( {isRunning:false} )
        }
    },

    submitCode:async( source_code, language_id, stdin, expected_outputs, problemId)=>{
        try {
            set({isSubmitting:true});

            const res = await axiosInstance.post("/execute-code/submit", {source_code, language_id, stdin, expected_outputs, problemId});

            set({submission:res.data.executeResult});

            toast.success(res.data.message || "Code Executed");

        } catch (error) {
            console.log("Error executing code", error);
            toast.error("Error executing code");
        }
        finally{
            set( {isSubmitting:false} )
        }
    }
}))