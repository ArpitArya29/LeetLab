import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";

export const useProblemStore = create( (set)=>({
    problems:[],
    problem:null,
    solvedProblems:[],
    isProblemsLoading:false,
    isProblemLoading:false,

    getAllProblems: async()=>{
        try {
            set({isProblemsLoading:true})

            const res = await axiosInstance.get("/problems/get-all-problems");

            set({problems:res.data.problems});


        } catch (error) {
            console.log("Error in fetching problem", error);

            toast.error("Error in fetching problems");
        }
        finally{
            set({isProblemsLoading:false})
        }
    },

    getProblemById: async(id)=>{
        try {
            set({isProblemLoading:true})

            const res = await axiosInstance.get(`/problems/get-problem/${id}`);

            set({problem:res.data.problem});

            toast.success(res.data.message);
        } catch (error) {
            toast.error("error in getting problem")
            console.log("error in getting problem", error);
        }
        finally{
            set({isProblemLoading:false})
        }
    },

    getSolvedProblemByUser: async()=>{
        try {
            const res = await axiosInstance.get("/problems/get-solved-problem");

            set({solvedProblems:res.data.problems});

        } catch (error) {
            toast.error("Error in fetching solved problem")
            console.log("error in getting solved problem", error);
            
        }
    },
}))