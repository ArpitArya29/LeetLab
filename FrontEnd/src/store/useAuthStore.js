import {create} from "zustand"
import { axiosInstance } from "../lib/axios.js"
import toast from "react-hot-toast";


export const useAuthStore = create( (set)=>({
    authUser:null,
    isSignedUp:false,
    isSigningUp:false,
    isLoggingIn:false,
    isCheckingAuth:false,


    // functions for all the routes of backend authentication
    checkAuth:async()=>{
        set( {isCheckingAuth:true} )
        try {
            const res = await axiosInstance.get("/auth/check");

            console.log("CheckAuth Response:", res.data);
            
            set({authUser:res.data.user}) // user from backend check response
            
        } catch (error) {
            console.log("Error checking auth:", error);
            set( {authUser:null} )
        }
        finally{
            // rebuild the state of isCheckingAuth to its initial state:false
            set( {isCheckingAuth:false} )
        }
    },


    signup:async(data)=>{
        set( {isSigningUp:true} )
        try {
            const res = await axiosInstance.post("/auth/register", data);

            set( {isSignedUp:true} );

            toast.success(res.data.message);
        } catch (error) {
            console.log("Error signing up ", error);
            toast.error("Error signing up");
        }
        finally{
            set( {isSigningUp:false} );
        }
    },


    login:async(data)=>{
        set( {isLoggingIn:true} );

        
        try {
            const res = await axiosInstance.post("/auth/login", data); 
    
            set( {authUser:res.data.user} );
    
            toast.success(res.data.message);
        } catch (error) {
            console.log("Error Logging in ",error);

            if(error.response.status===401){
                toast.error("Unauthorized login attempt")
            }
            else{
                toast.error("Error logging in")
            }
        }
        finally{
            set( {isLoggingIn:false} );
        }
    },


    logout:async()=>{
        try {
            await axiosInstance.post("/auth/logout")

            toast.success("User Logged out");
            set( {authUser:null} )
        } catch (error) {
            console.log("Error Logging out user");
            toast.error("Error Logging out user");
        }
    }
}))