import express from "express"
import { authmiddleware, checkAdmin } from "../middleware/auth.middleware.js";
import { createProblem, deleteProblem, getAllProblems, getAllProblemsSolvedByUser, getProblemById, updateProblem } from "../controllers/problems.controller.js";

const problemRoutes = express.Router();

problemRoutes.post("/create-problem", authmiddleware, checkAdmin,  createProblem);

problemRoutes.get("/get-all-problems", authmiddleware, getAllProblems);

problemRoutes.get("/get-problem/:id", authmiddleware, getProblemById);

problemRoutes.put("/update-problem/:id", authmiddleware, checkAdmin, updateProblem);

problemRoutes.delete("/delete-problem/:id", authmiddleware, checkAdmin, deleteProblem);

problemRoutes.get("/get-solved-problems", authmiddleware, getAllProblemsSolvedByUser);




export default problemRoutes;