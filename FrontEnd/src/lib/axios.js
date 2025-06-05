import axios from "axios"

// we use axios for the communication with backend
export const axiosInstance = axios.create({
    baseURL: import.meta.env.MODE==="development"?"http://localhost:8080/api/v1":"/api/v1",
    withCredentials:true
});