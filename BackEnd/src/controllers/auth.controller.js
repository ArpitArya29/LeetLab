import bcrypt from "bcryptjs"
import {db} from "../libs/db.js"
import { UserRole } from "../generated/prisma/index.js";
import jwt from "jsonwebtoken"

export const register = async(req, res)=>{
    // get email, passowrrd and name
    const {email, password, name} = req.body;

    // go into database
    try {
        // check for existing user
        const existingUser = await db.user.findUnique({
            where:{
                email
            }
        })


        if (existingUser){
            return res.status(400).json({
                error: "User already exists"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // creating the new user
        const newUser = await db.user.create({
            data:{
                email,
                name,
                password : hashedPassword,
                role: UserRole.USER
            }
        })


        // creating a token
        const token = jwt.sign(
            {id:newUser.id},
            process.env.JWT_SECRET,
            {expiresIn:"7d"}
        )

        res.cookie("jwt", token,{
            httpOnly:true,
            sameSite:"strict",
            secure:process.env.NODE_ENV!=="development",
            maxAge:1000*60*60*24*7 // 7 days
        })

        res.status(201).json({
            success:true,
            message: "User created successfully",
            user:{
                id:newUser.id,
                email: newUser.email,
                name: newUser.name,
                role: newUser.role,
                image:newUser.image
            }
        })

    } catch (error) {
        console.log("Error creating user: ", error);

        res.status(500).json({
            error: "Error creating user"
        })
        
    }
}


export const login = async(req, res)=>{
    // fetch email and password form request
    const {email, password} = req.body;

    try {
        // fetch user based on provided email
        const user = await db.user.findUnique({
            where:{
                email
            }
        })

        // if user does not exit, throw not fount status
        if(!user){
            return res.status(401).json({
                error: "User not found"
            })
        }

        // compare the given password with the actual hashed password
        const isMatched = await bcrypt.compare(password,user.password);

        // if password does not match, throw error status
        if(!isMatched){
            return res.status(401).json({
                error:"Invalid Credentials"
            })
        }

        // create a login token
        const token = jwt.sign(
            {id:user.id},
            process.env.JWT_SECRET,
            {expiresIn:"7d"}
        )

        // save the token in cookie
        res.cookie("jwt",token,{
            httpOnly:true,
            sameSite:"strict",
            secure:process.env.NODE_ENV!=="development",
            maxAge:1000*60*60*24*7 // 7days
        })

        // send success status
        res.status(201).json({
            success:true,
            message: "User Loggen in successfully",
            user:{
                id:user.id,
                email:user.email,
                name:user.name,
                role: user.role,
                image:user.image
            }
        })
    } catch (error) {
        console.log("Error Logging user: ", error);

        res.status(500).json({
            error: "Error creating user"
        })
    }
}


export const logout = async(req, res)=>{
    try {
        // clear the saved cookie
        res.clearCookie("jwt",{
            httpOnly:true,
            sameSite:"strict",
            secure:process.env.NODE_ENV!=="development",
        })

        // send 204(no content) status code
        res.status(200).json({
            success:true,
            message: "User Logged-out Successfully"
        })
    } catch (error) {
        return res.status(404).json({
            error:"Failed to logging-out the user"
        })
    }
}


export const check = async(req, res)=>{
    try {
        res.status(200).json({
            success:true,
            message:"User Authenticated Successfully",
            user:req.user
        })
    } catch (error) {
        res.status(500).json({
            message:"Error checking user"
        })
    }
}