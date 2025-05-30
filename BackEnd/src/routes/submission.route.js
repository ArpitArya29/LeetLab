import express from "express"
import { authmiddleware } from "../middleware/auth.middleware.js";
import { getAllSubmission, getAllSubmissionCountsForProblem, getSubmissionsForProblem } from "../controllers/submission.controller.js";

const submissionRoutes = express.Router();

submissionRoutes.get("/get-all-submissions", authmiddleware, getAllSubmission);

submissionRoutes.get("/get-submission/:problemId", authmiddleware, getSubmissionsForProblem);

submissionRoutes.get("/get-submission-count/:problemId", authmiddleware, getAllSubmissionCountsForProblem);

export default submissionRoutes;