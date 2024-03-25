import { Request ,Response } from "express";
import userModel from "../model/user";
import { connection } from "../connection";
import { randomUUID } from "crypto";
import userRepositories from "../repositories/userRepositories";
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken'
import dotenv from "dotenv"
dotenv.config()



export const createUser = async  (req: Request, res: Response) => {
    try {

        const user: userModel = req.body
        const check_user = await userRepositories
        .retrieveByType({Type: "username" , data: req.body.username})
        if(check_user.length > 0){
            return res.status(401).json({
                message : "current username is have been exist.",
                sucess : false
            })
        }
        if(user.password !== user.confirmPassword){
            return res.status(400).json({
                message : "Password do not match",
                success : false,
            })
        }
        user.userid = randomUUID()
        const salt = await bcrypt.genSalt(10)
        const hashpassword = await bcrypt.hash(req.body.password, salt)
        user.password = hashpassword
        //insert user into db
        const create_user = await userRepositories.createUser(user)
        if(!create_user){
            return res.status(401).json({
                message : "could create new user",
                success: false
            })
        }
        res.status(200).json({
            message : "register successfully",
            success : true,
        })     
    } catch (error) {
        res.status(500).json({
            message: "error internal server",
            success : false,
            error : error
        })
    }
}   


export const loginUser = async (req:Request , res:Response) =>{
    // try {
        const {identifier }= req.body
        const query = identifier.includes('@') ?
         await userRepositories.retrieveByType({Type : 'email' , data:identifier})
         : await userRepositories.retrieveByType({Type : 'username' , data:identifier}) 
        

        if(query.length === 0){
            return res.status(401).json({
                message : "not found users",
                success : false
            })
        }
       
        const user = query[0]
        const vailPassword = await bcrypt.compare(
            req.body.password
             ,user.password
             )
        
        if (!vailPassword){
            return res.status(401).json({
                message : "invaild user credentails",
                success : false,
            })
        }

        const token = jwt.sign({
            userId : user.userId ,
            name : user.username,
        }, `${process.env.JWT_SCRECT_KEY}` , {
            expiresIn : '1d'
        })

        res.status(200).json({
            message : "user login successfully",
            success: true,
            username : identifier,
            token : token
        })
        

    // } catch (error) {
    //     res.status(500).json({
    //         message: "error internal server",
    //         success : false,
    //         error : new Error()
    //     })
    // }
}

export const getUser = async (req:Request ,res:Response) => {
    try {
        let usernames = typeof req.query.username === "string" ? req.query.username: "";
        const findAllUser = await userRepositories.retrieveAll()


        if(!findAllUser){
            return res.status(401).json({
                message: "error response",
                succuss : false,
            })
        }
        return res.status(200).json({
            message : "get all user sucessfully",
            success : true,
            result : findAllUser,
        })     
    } catch (error) {
        res.status(500).json({
            message : "error internal server",
            succuess : false,
            error : error,
        })
    }
   
}


export const getUserByType = async (req:Request , res:Response)=>{
    try {
        const userByType = await userRepositories.retrieveByType({Type: req.body.type , data:req.body.data})

        if(!userByType){
            return res.status(401).json({
                message: "error response",
                succuss : false,
            })
        }
        
        res.status(200).json({
            message : "get all user sucessfully",
            success : true,
            result : userByType,
        })

    } catch (error) {
        res.status(500).json({
            message : "error internal server",
            succuess : false,
            error : error,
        })
    }
}

export const updateUser = async (req:Request, res:Response) =>{
    try {
        const userId = req.params.user_id
        const new_data = req.body
        const updateUser = await connection.query('UPDATE users SET ? WHERE user_id = ?', [new_data])

        if(!updateUser){
            return res.status(401).json({
                message: "error response",
                succuss : false,
            })
        }

        res.status(200).json({
            message : " user update sucessfully",
            success : true,
            result : updateUser,
        })
    } catch (error) {
        res.status(500).json({
            message : "error internal server",
            succuess : false,
            error : error,
        })
    }
}

export const deleteUser = async (req:Request , res:Response)=>{

    try {
        const userId = req.params.user_id

        const deleteUser = await connection.query(`DELETE FROM users WHERE user_id = ?`, [userId])
    
        if(!deleteUser){
            return res.status(401).json({
                message: "error response",
                succuss : false,
            })
        }
        res.status(200).json({
            message : " user delete sucessfully",
            success : true,
            result : updateUser,
        })
    
    } catch (error) {
        res.status(500).json({
            message : "error internal server",
            succuess : false,
            error : error,
        })
    }
  
}