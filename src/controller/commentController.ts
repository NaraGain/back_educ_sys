import { NextFunction, Request ,Response } from "express";
import commentPosts, { CommentInstance } from "../model/comments";
import commentRepository from "../repositories/commentRepositories";
import { v4 as uuidv4 } from "uuid";
import userRepositories from "../repositories/userRepositories";
import { userInstance } from "../model/user";
import { PostInstance } from "../model/post";
import { userInfoInstance } from "../model/userInfo";
import { Op } from "sequelize";


class commentController {
    async create (req:Request , res:Response) {
        try {

            const comment:commentPosts = req.body
            const comment_id:string = uuidv4()
            
            const newComment = await CommentInstance.create({
                commentid : comment_id ,
                userid : req.body.userid ,
                postid : req.body.postid ,
                comment : req.body.comment 
            })
            

            if(!newComment){
                return res.status(404).json({
                    message : "could not post comment",
                    success: false
                })
            }

            res.status(200).json({
                message : "post comment",
                success : true,
                commentid  : comment_id
            })
        } catch (error) {
            res.status(500).json({
                message: "error internal server",
                success : false,
                error : error
            })
        }
    }

    async findCommentByPostId (req:Request ,res:Response) {
        try {
           
            const findComments = await CommentInstance.findAll(
                {where : {postid : req.body.postid},
                include : [{
                    model : userInstance,
                    attributes : ['userid' ,'username'],
                    required : true,
                    include : [{
                        model : userInfoInstance,
                        attributes : ["infoid", 'profile_url']
                    }]
                }]
            })

            res.status(200).json({
                message : "find comment found",
                sucess : true,
                result : findComments,
            })

        } catch (error) {
            res.status(500).json({
                message: "error internal server",
                success : false,
                error : error
            })
        }
    }

   async deleteComment (req:Request, res:Response, next:NextFunction) {
        try {

            if(!req.body){
                return res.status(401).json({
                    message : "request can not be null",
                    success : false,
                })
            }

        const findUserInComment = await CommentInstance.findByPk(req.body.commentid)
        if(findUserInComment?.dataValues.userid !== req.body.userid) {
            return res.status(400).json({
                message : "could not delete post unauthorized delete comment",
                success : false,
            })
        }
        const deleteComment = await CommentInstance.destroy({
            where : {[Op.and] :
                [{commentid : req.body.commentid}, {userid : req.body.userid}]
             }})
         next()
        if(!deleteComment){
            return res.status(401).json({
                message : "error delete comment",
                success : false,
            })
        }  
        
        res.status(200).json({
            message : "delete comment",
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


}

export default commentController