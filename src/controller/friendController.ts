import { Request,Response } from "express"
import { FriendInstance } from "../model/friend"
import { userInstance } from "../model/user"
import { userInfoInstance } from "../model/userInfo"
import { Op } from "sequelize"



class friendController {
    async create(req:Request , res:Response) {
        try {
            const friend = await FriendInstance.create({
                userid1: req.body.userid1,
                userid2: req.body.userid2,
            })

            if(!friend) {
                return res.status(401).json({
                    message : `error make friend`,
                    success : false
                })
            }

            res.status(200).json({
                message : "successful make friend",
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

    async unFriend (req:Request , res:Response) {
        try {
            // const unFriend = await FriendInstance.update
        } catch (error) {
            res.status(500).json({
                message: "error internal server",
                success : false,
                error : error
            })
        }
    }

    async countTotalFriend (req:Request , res:Response) {
        try {
           
            if(req.body.userid1 == undefined) {
                return res.status(204).json({
                    message : "There is no content to send for this request",
                    success : false
                })
            }

            const countFollowing =  await FriendInstance.count({
                where : {userid1 : req.body.userid1}
            })

            const countFollower = await FriendInstance.count({
                where : {userid2 : req.body.userid1}
                
            })
        
            const checkUserFollowing = await FriendInstance.findOne({
                where : {
                    [Op.and] : [
                        {userid1 : req.body.currentUser},
                        {userid2 : req.body.userid1},
                        {status : "following"}
                    
                    ]
                }
            })     
            
            const checkUserFollower = await FriendInstance.findOne({
                where : {
                    [Op.and] : [
                        {userid1 : req.body.userid1},
                        {userid2 : req.body.currentUser},
                        {status : "following"}
                    
                    ]
                }
            })
            
            res.status(200).json({
                message : "found following users",
                success : true,
                result : {
                    following: countFollowing ,
                    follower : countFollower,
                    achivments : 0,
                   
                },
                checkFollowing: checkUserFollowing ? true : false,
                checkFollower : checkUserFollower ? true : false
            })

        } catch (error) {
            res.status(500).json({
                message: "error internal server",
                success : false,
                error : error
            })
        }
    }

    async findAllUserFriend (req:Request , res:Response){
        try {
            const findUserFollowing = await FriendInstance.findAll({
                where : {userid1 : req.body.userid},
                attributes : ['userid2', 'requested_at', 'accepted_at'],
                include: [{
                    model : userInstance,
                    as: "Receiver",
                    attributes : ["username", "userid"],
                    include : [{
                        model : userInfoInstance,
                        attributes : ['infoid', 'profile_url']
                    }]
                }]
            })

            const findUserFollower = await FriendInstance.findAll({
                where:{userid2 : req.body.userid},
                attributes : ['userid2','userid1', 'requested_at', 'accepted_at'],
                include: [{
                    model : userInstance,
                    attributes : ["username", "userid"],
                    required : true,
                    as : "Initiator",
                    include : [{
                        model : userInfoInstance,
                        attributes : ['infoid', 'profile_url'],
                        required: true
                    }]
                }]
            })

             if(findUserFollowing == null || findUserFollower == null){
                return res.status(204).json({
                    message : "There is no content to send for this request",
                    success : false
                })
             }   

             res.status(200).json({
                message: "successful response",
                success : true,
                result : {
                    following : findUserFollowing,
                    follower : findUserFollower,
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
}


export default friendController