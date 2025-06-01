import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser"
import authRoutes from "./routes/auth.routes.js";
import problemRoutes from "./routes/problem.routes.js";
import executionRoute from "./routes/executeCode.route.js";
import submissionRoutes from "./routes/submission.route.js";
import playlistRoutes from "./routes/playlist.routes.js";

dotenv.config();

const port = process.env.PORT || 8080;


const app = express();


app.use(express.json());
app.use(cookieParser());


app.get('/',(req,res)=>{
    res.send("Welcome users, to leetlab 🐦‍🔥")
})

// authentication related routes
app.use("/api/v1/auth", authRoutes);

// problem related routes
app.use("/api/v1/problems", problemRoutes);

// code-execution related routes
app.use("/api/v1/execute-code", executionRoute);

// submission related routes
app.use("/api/v1/submission", submissionRoutes);

// playlist related routes
app.use("/api/v1/playlist", playlistRoutes);

app.listen(port,()=>{
    console.log(`server is running at port http://localhost:${port}`);
})