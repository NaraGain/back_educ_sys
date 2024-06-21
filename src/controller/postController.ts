import { Request ,Response } from "express";
import postModel, { PostInstance } from "../model/post";
import {v4 as uuidv4} from 'uuid'
import fs from 'fs'
import userModel, { userInstance } from "../model/user";
import userRepositories from "../repositories/userRepositories";
import postRepositories from "../repositories/postRepositories";
import { userInfoInstance } from "../model/userInfo";
import { uploadFile } from "../model/uploadFile";
import {Op} from 'sequelize'


export const createPost = async(req:Request , res:Response) =>{
    try {
       
        const post: postModel = req.body
        const finduser:userModel = await userRepositories
        .retrieveByQuery({username : req.body.username})

        if(finduser.length === 0){
            return res.status(200).json({
                meessage: "cloud not found user",
                sucess : false
            })
        }
        const post_id:string = uuidv4()
        post.postid = post_id
        post.userid = finduser[0]?.userid

        if(!post.content){
           return res.status(401).json({
                messsage : "cloud not empty",
                success : false
            })
        }
       
        const create_post = await postRepositories.createPost(post)
        if(!create_post){
            return res.status(401).json({
                messsage : "post faild miss something",
                success : false
            })
        }

        res.status(200).json({
            message : "post successfully",
            success : true,
            result: create_post
        })
    } catch (error) {
        res.status(500).json({
            message: "error internal server",
            success : false,
            error : error
        })
    }
}


export const uploadPhoto = async (req:Request ,res:Response)=> {
    //user can upload one picture or file only rigth now with fix it later...
   try {
    const files = req.files as Express.Multer.File[];
    const uploadDir = "./public/uploads/"
    const safeFileName = `${Date.now()}-${Math.floor(Math.random() * 1000)}.png`;
    if(files.length < 0){
        return res.status(401).json({
            message : "No file Upload",
            success : false
        })
       
    }

    if (!req.body.username) {
        files.forEach((file) => {
            const filePath = `${uploadDir}/${file.filename}`; // Fixed path concatenation
    
            fs.unlink(filePath, (error) => {
                if (error) {
                    return res.status(500).json({
                        message: "Error deleting file: " + filePath,
                        success: false
                    });
                }
            });
        });
    
        return res.status(200).json({
            message: "username not provdie",
            success: true
        });
    } 

   
  
    const finduser:userModel = await 
    userRepositories.retrieveByQuery({username : req.body.username})
    if(finduser.length < 0) {
        return res.status(401).json({
            message : "user not found",
            success : false
        })
    }
    
    if(!req.body.postid){
        const post:postModel = req.body
        const postid:string = uuidv4()
        post.postid = postid
        if(!req.body.content){
            post.content =  '0'
        }
       
      
        post.userid = finduser[0]?.userid
        //create post with null content
        post.content = req.body.content
        const create_post = await postRepositories.createPost(post)
        if(!create_post){
            return res.status(400).json({
                message : `could't create new post`
            })
        }

        
        let upload_post:any = ''

        files.forEach(async (file)=> {
            const upload_id:string = uuidv4()
        
            upload_post = await postRepositories
            .createPostFile({
                uploadid: upload_id ,
                postid : postid,
                upload_url : `/uploads/${file.filename}`
            }).catch((error)=> {
                res.status(400).json({
                    message : "upload error",
                    success : false
                })
            })
        })
       
    }
 
    res.status(200).json({
        message : "upload successfully ",
        success: true,
        result : req.body.file
    })

   } catch (error) {
    const uploadDir = "./public/uploads/"
    const files = req.files as Express.Multer.File[]
    files.forEach((file)=>{
        const filePath = `${uploadDir}/${file.filename}`; // Fixed path concatenation
        fs.unlink(filePath, (error) => {
            if (error) {
                return res.status(500).json({
                    message: "Error deleting file: " + filePath,
                    success: false
                });
            }
        });
    })

    res.status(500).json({
        message: "error internal server",
        success : false,
        error : new Error(),
    })
   }

}


export const publicPost = async(req:Request ,res:Response) => {
        try {
      
        const page = parseInt(req.query.page as string, 4) || 1
        const limit = parseInt(req.query.limit as string , 4) || 4
        const offset = (page - 1) * limit
        
        

          const allpost = await PostInstance
          .findAll({order :[['created_at', 'DESC']] 
            ,include : [
            {
                model : uploadFile,
                attributes: ['upload_id', "upload_url", "post_id"]
            },
            {
            model : userInstance,
            attributes : ["userid" ,'username', "firstname", "lastname"],
            required : true,
            include : [
                {
                    model : userInfoInstance,
                    attributes : ['infoid', 'userid', 'profile_url'] 
                }
            ]
          }],
          limit,
          offset
        })
       
       
       const totalPage = Math.ceil(allpost.length / limit)
       console.log(`${totalPage} k: ${allpost.length}`)

            res.status(200).json({
                message : "public post",
                success : true,
                result : allpost,
                pagination:{
                    currentPage : totalPage / 1,
                   
                }
            })
            
        } catch (error) {
            res.status(500).json({
                message: "error internal server",
                success : false,
                error : error
            })
        }
}


export const findUserPost = async (req:Request , res:Response) => {
    try {
        const finduser:userModel = await
         userRepositories
         .retrieveByQuery({username : req.body.username})

         const userPost = await PostInstance.findAll({
            where : {userid : finduser[0].userid},
            include : [
                {
                    model : uploadFile,
                    attributes : ['upload_id', 'upload_url']
                },
                {
                model : userInstance,
                attributes :  ["username", "userid", "firstname", "lastname"],
                required : true,
                include : [{
                    model : userInfoInstance,
                    attributes : ['infoid', 'profile_url'],
                    required : true,
                }]
            }]
        }
        )

      
      
        res.status(200).json({
            message : `sucessfully fetch data user ${req.body.username}`,
            success : true,
            result : userPost,
        })
    } catch (error) {
        res.status(500).json({
            message: "error internal server",
            success : false,
            error : error
        })
    }
}

export const findPostOne = async (req:Request, res:Response) => {
    try {
       
        if(!req.body.postid){
            return res.status(200).json({
                message : "no postid",
                success : false
            })
        }
    
        const findOnePost = await PostInstance.
        findOne({where : {postid : req.body.postid} , include: [{
            model : userInstance,
            attributes : ["username"],
            required : true,
            include : [{
                model : userInfoInstance,
                attributes : ['infoid', 'profile_url'],
                required : true
            }]
        }, {
            model : uploadFile,
            attributes : ['post_id',"upload_id", "upload_url", "created_at"],
        }]
    
    })
        if(!findOnePost){
            return res.status(404).json({
                message : `could not find post`,
                sucess : false,
            })
        }

     

        res.status(200).json({
            message : "find post successfully",
            sucess : true,
            result : findOnePost,
           
        })

    } catch (error) {
        res.status(500).json({
            message: "error internal server",
            success : false,
            error : error
        })
    }
}


export const detelePost = async (req:Request ,res:Response) =>{
    try {
        if(!req.body){
            return res.status(401).json({
                message : "request can not be null",
                success : false,
            })
        }
        const findUserInPost = await PostInstance.findByPk(req.body.postid)
        if(findUserInPost?.dataValues.userid !== req.body.userid){
            return res.status(400).json({
                message : "could not delete post unauthorized delete post",
                success : false,
            })
        }
        const deleteFromPost = await PostInstance.destroy({where 
            : {[Op.and] : 
                [{postid : req.body.postid} , { userid : req.body.userid }] 
             }})
        if(!deleteFromPost){
            return res.status(401).json({
                message : "cannot delete post",
                success : false,
            })
        }
        // file for file storage
        if(req.body.filePath){
            req.body.filePath?.forEach((file:any)=> {
                fs.unlink(`./public${file.upload_url}`, (error)=> {
                    if (error) {
                     console.log(error)
                  }
    
                })
            })
            
         }
      
        
        res.status(200).json({
            message : "post have been remove",
            success : true
        })

    } catch (error) {
        res.status(500).json({
            message: "error internal server",
            success : false,
            error : error
        })
    }
}