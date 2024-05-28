import { Request,Response } from "express";
import likePosts, { likePostInstance } from "../model/likePost";
import userModel from "../model/user";
import userRepositories from "../repositories/userRepositories";
import likeRepositories from "../repositories/likeRepositories";
import { v4 as uuidv4 } from "uuid";
import { connection } from "../connection";
import { CommentInstance } from "../model/comments";


class likeController {
    async create(req:Request , res:Response){
        try {
            const likePost:likePosts = req.body

            const findUser:userModel = await 
            userRepositories.retrieveByQuery({username : req.body.username})
            if(!findUser){
                return res.status(404).json({
                    message : "user undefine",
                    success : false
                })
            }

            likePost.userid = findUser[0].userid as string
            const likeId:string = uuidv4()
            likePost.likeid = likeId
            //findlike exist on table
            const findLike = await likeRepositories.findUserLikePost({userid: likePost.userid 
            , postid:likePost.postid})
            //check if findis exist will go to unlike
            if(findLike.length > 0){
                await likeRepositories.unlikePost({userid: likePost.userid as string,
                     postid: likePost.postid as string})
                return res.status(200).json({
                    message : "unlike",
                    success : false
                })
            }else{
                // if not like exist with postid and userid will create new like
                const save_like = await likeRepositories.createLike(likePost)
                if(!save_like){
                    return res.status(404).json({
                        message : "uable to save like"
                    })
                }
                return res.status(200).json({
                    message : "lik post",
                    success : true,
                   
                })
            }
        } catch (error) {
            res.status(500).json({
                message: "error internal server",
                success : false,
                error : error
            })
        }
    }

    async totalPostLikeAndComment(req:Request , res:Response){
        try {
            const countPostLike = await likePostInstance.count({where : {postid : req.params.postid}})
            const countComment = await CommentInstance.count({where : {postid : req.params.postid}})
            
            res.status(200).json({
                message : "count like and comment",
                sucess : true,
                result : {
                    countLike : countPostLike,
                    countComment : countComment,
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
    
    async checkUserLikePost(req:Request ,res:Response) {
        try {
            const {postid ,userid} = req.body

         const getLike = await likeRepositories
         .checkUserLikePost({userid: userid , postid: postid})
            
            if(getLike.length === 0) {
                return res.status(200).json({
                   message : "no like",
                   success : false,
                   result : false,
               })
       }

            res.status(200).json({
                message : "lik post",
                sucess : true,
                result : true,
               
            })
        
        } catch (error) {
            res.status(500).json({
                message: "error internal server",
                success : false,
                error : error
            })
        }
    }
    
    async findAllUserLikePost(req:Request, res:Response){
        try {
            const getAllUserLikePost = 
            await likeRepositories.queryAllUserLikePost({postid : req.params.postid})

            res.status(200).json({
                message : "successfully query user like post",
                sucess : true,
                result : getAllUserLikePost,
            })

        } catch (error) {
            res.status(500).json({
                message: "error internal server",
                success : false,
                error : error
            })
        }
    }
}


export default likeController