import express from "express"
import { authmiddleware } from "../middleware/auth.middleware.js";
import { runCode, submitCode } from "../controllers/executeCode.controller.js";


const executionRoute = express.Router();

executionRoute.post("/run", authmiddleware, runCode);

executionRoute.post("/submit", authmiddleware, submitCode);



export default executionRoute;