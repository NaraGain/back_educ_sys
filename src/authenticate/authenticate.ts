import { Request,Response } from "express"
import Jwt  from "jsonwebtoken";


export const authenticate = async (req: Request, res:Response , next:Function)=>{
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(" ")[1];
    if(token == null){
        return res.status(401).json({
            message: "unauthorize user request",
            success : false
        })
    }  
    Jwt.verify(token, `${process.env.JWT_SCRECT_KEY}` , (err:any , user:any)=> {
        if(err){
            return res.status(403).json({
                message: "error token unable to response",
                success: false
            })
        }
            req.body.users = user;
            next()
    })
}