import { Request ,Response } from "express";
import userModel, { IuserAttributes, userInstance } from "../model/user";
import { v4 as uuidv4 } from 'uuid';
import userRepositories from "../repositories/userRepositories";
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken'
import dotenv from "dotenv"
import  { userInfoInstance } from "../model/userInfo";
dotenv.config()
import fs from 'fs'
import { uploadFile } from "../model/uploadFile";
import { PostInstance } from "../model/post";
import { Op } from "sequelize";



class userContorller{

    async create (req: Request, res: Response) {
        try {
    
            const user:IuserAttributes = req.body
            const checkExistUser = await userInstance.
            findOne({where: { username : req.body.username}})

            if(checkExistUser){
                return res.status(401).json({
                    message : "current username is have been exist.",
                    sucess : false,
                    result : checkExistUser.dataValues.username
                })
            }

            //check user passowr confirm
            if(user.password !== req.body.confirmPassword){
                return res.status(400).json({
                    message : "Password do not match",
                    success : false,
                })
            }
            const uuid:string = uuidv4()
            user.userid = uuid
            user.isActive = true
            const salt = await bcrypt.genSalt(10)
            const hashpassword = await bcrypt.hash(req.body.password, salt)
            user.password = hashpassword
             //insert user into db
            const create_user = await userInstance.create(user)
            await create_user.save()
            if(!create_user){
                return res.status(404).json({
                    message : "could create new user",
                    success: false
                })
            }
            // new user profile_url
            const infoid:string = uuidv4()
            const userProfile = await userInfoInstance.create({
                infoid : infoid as string,
                userid : user.userid,
                profile_url : `https://ui-avatars.com/api/?name=${user.username})}&background=random`
            })
            await userProfile.save()
            if(!userProfile){
                return res.status(401).json({
                    message : "error",
                    success : false
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

    async changeProfile (req:Request ,res:Response) {
        try {
            if(!req.file){
                return res.status(404).json({
                    message : "error no file request",
                    sucess : false
                })
            }
            const filename = req.file.filename
            const changeUserProfile =  await userInfoInstance.update({
                    profile_url : `/uploads/${filename}`
            }, {
             where : {userid : req.body.userid}
            }).catch((error)=> {
                const profile_url = `public/uploads/${filename}`
                fs.unlink(profile_url , (err)=> {
                    console.log(err)
                })
            })

            //remove old file linke
            fs.unlink(`public${req.body.url}` , (error)=> {
                console.log(`can't remove old file ${req.body.url}`, error)
            })

            if(!changeUserProfile) {
                return res.status(401).json({
                    message : `error`,
                    success : false,
                })
            }
           
            res.status(200).json({
                message : "successfully upload",
                sucess : true,
            })
        } catch (error) {
            res.status(500).json({
                message: "error internal server",
                success : false,
                error : new Error()
            })
        }
    }
    
    async login (req:Request , res:Response){
        try {
            const { identifier,password }= req.body

            if(identifier.length === 0){
                return res.status(401).json({
                    message : "input is empty",
                    success : false,
                    result : identifier,
                })
            }
            const query = identifier.includes('@') ?
             await userInstance.findOne({where : {email : identifier}})
             : await userInstance.findOne({where : {username : identifier}}) 
            
            if(!query){
                return res.status(401).json({
                    message : "not found users",
                    success : false
                })
            }
           
           
            const vailPassword = await bcrypt.compare(
                  password
                 ,query.dataValues.password as string
                 )
            
            if (!vailPassword){
                return res.status(401).json({
                    message : "invaild user credentails",
                    success : false,
                })
            }
    
            const token = jwt.sign({
                userId : query.dataValues.userid ,
                name : query.dataValues.username,
            }, `${process.env.JWT_SCRECT_KEY}` , {
                expiresIn : '1d'
            })
    
            res.status(200).json({
                message : "user login successfully",
                success: true,
                userId : query.dataValues.userid,
                username : identifier,
                token: token,
                
            })
            
    
        } catch (error) {
            res.status(500).json({
                message: "error internal server",
                success : false,
                error : new Error()
            })
        }
    }

    async searchAllUser (req:Request, res:Response) {
        // try {
            
            const users = await userInstance.findAll({
                attributes: ['userid','username','firstname', 'lastname', 'email'],
                where : {
                    username : {
                        [Op.like] : `%${req.query.search}%`
                    }
                },
                include : [{
                    model : userInfoInstance,
                    attributes : ['infoid', 'profile_url']
                }]
            })

            if(!users.length){
                return res.status(204).json({
                    message : "non file user",
                    success : false,
                })
            }

            res.status(200).json({
                message : "user found",
                success : true,
                result : users,
            })

        // } catch (error) {
        //     res.status(500).json({
        //         message: "error internal server",
        //         success : false,
        //         error : new Error()
        //     })
        // }
    }

    async findAll (req:Request ,res:Response)  {
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

    async findOne (req:Request , res:Response){
        try {
            const userProfile = await 
            userInstance.findOne(
                {where :  req.body.userId ? 
                        {userid : req.body.userId} 
                        : {username : req.body.username},
                include : [{
                    model : userInfoInstance,
                    attributes : ["infoid", "profile_url", "bio"]
                }],
                attributes : ["userid" ,"firstname", "lastname", "username","email"]
            }    
            )
            if(!userProfile){
                return res.status(204).json({
                    message: "error response",
                    succuss : false,
                })
            }
            
            res.status(200).json({
                message : `sucessfully ${userProfile?.dataValues.username}`,
                success : true,
                result : userProfile,
            })
    
        } catch (error) {
            res.status(500).json({
                message : "error internal server",
                succuess : false,
                error : error,
            })
        }
    }

    async findUserFile (req:Request , res:Response){
        try {

            const file = await userInstance.findAll(
                {where : {userid : req.body.userid},
                attributes : ['userid'],
                include : [{
                    model : PostInstance,
                    attributes : ['postid'],
                    include : [{
                        model : uploadFile
                    }]
                }],
            })

            const userFile = await userRepositories.queryUserFile({userid : req.body.userid})
            if(userFile.length === 0) {
                return res.status(401).json({
                    message : "no file found",
                    suceess : false
                })
            }

            res.status(200).json({
                message : "sucessfully to query user file",
                sucess : true,
                result : userFile,
                test : file,
            })



        } catch (error) {
            res.status(500).json({
                message : "error internal server",
                succuess : false,
                error : error,
            })
        }
    }
    
    async userDescription(req:Request , res:Response){
        try {
            
                const updateUserInfo = await userInfoInstance.update(
                    { bio: req.body.bio },
                    {
                      where: {
                        infoid: req.body.infoId,
                      },
                    },
                  )

                  if(!updateUserInfo){
                        return res.status(401).json({
                            message : "error to update",
                            success : false
                        })
                  }
            

            res.status(200).json({
                message : "successfully response for user info",
                success : true
            })

        } catch (error) {
            
        }
    }

    async update (req:Request, res:Response) {
        try {
            const new_data:userModel = req.body
            // const salt = await bcrypt.genSalt(10)
            // const hashpassword = await bcrypt.hash(req.body.password, salt)
            // new_data.password = hashpassword
            const updateUser = await userRepositories.update(new_data)
          
            if(updateUser.changedRows === 0){
                return res.status(401).json({
                    message: `cannot update user with
                     id ${new_data.userid}, maybe something error`,
                    succuss : false,
                    info : updateUser.info,
                    error : updateUser.changedRows
                })
            }
    
            res.status(200).json({
                message : ` update sucessfully 
                users with id = ${new_data.userid}`,
                success : true,
                result : new_data,
            })
        } catch (error) {
            res.status(500).json({
                message : "error internal server",
                succuess : false,
                error : error,
            })
        }
    }

    async delete (req:Request , res:Response){
        try {
            const userId:string = req.params.userid
             
            const deleteUser = await userRepositories.delete(userId)
        
            if(!deleteUser){
                return res.status(401).json({
                    message: "error response",
                    succuss : false,
                })
            }
            res.status(200).json({
                message : " user delete sucessfully",
                success : true,
                result : deleteUser,
            })
        
        } catch (error) {
            res.status(500).json({
                message : "error internal server",
                succuess : false,
                error : error,
            })
        }
      
    }


    async deleteAll (req:Request ,res:Response){
        try {
            const num = await userRepositories.deleteAll();
            if(num !==1){
                return res.status(401).json({
                    message : `could't delete all users ${num}`,
                    success : false
                })
            }

            res.status(200).json({
                message : `${num} Delete all user successfully`,
                success : true,
            })

        } catch (error) {
            res.status(500).json({
                message : "error internal server",
                succuess : false,
                error : error,
            })
        }
    }


    

}




export default userContorller

   










