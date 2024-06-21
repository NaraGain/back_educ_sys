import { NextFunction, Request,Response } from "express"
import { FriendInstance, FriendStatus } from "../model/friend"
import { userInstance } from "../model/user"
import { userInfoInstance } from "../model/userInfo"
import { Op } from "sequelize"
import { participantInstance } from "../model/participants"
import { conversationInstance } from "../model/conversation"



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

    async removeFriend (req:Request , res:Response) {
        try {

            if(req.body.type === "Receiver"){
                //follower user remove
                // console.log(req.body)
                 await FriendInstance.destroy({where 
                    :{[Op.and]:
                    [
                        {userid1 :req.body.Receiver},
                        {userid2 : req.body.Initiator}
                    ]}})
                 res.status(200).json({
                    message : "",
                    success : true
                })

            }else if(req.body.type === "Initiator"){
                //following user unfollowing
                await FriendInstance.destroy({where :{ [Op.and]:[
                    {userid1 : req.body.Initiator },
                {
                    userid2 : req.body.Receiver
                }
            ]}})
                 res.status(200).json({
                    message : "",
                    success : true
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

            const checkUserFriend = await FriendInstance.findOne({
                where : {
                    [Op.and] : [
                        {userid1 : req.body.userid1},
                        {userid2 : req.body.currentUser},
                        {status : "friend"}
                    
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
                checkFollower : checkUserFollower ? true : false,
                checkFriend : checkUserFriend ? true : false,
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
                attributes : ['userid2', 'requested_at', 'accepted_at', 'status'],
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
                attributes : ['userid1', 'requested_at', 'accepted_at', 'status'],
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

    async acceptFriend (req:Request, res:Response){
        try {
            const accpted = await FriendInstance.update({
                status : FriendStatus.friend,
            },{
                where : {[Op.and]: [
                    {userid2 : req.body.receiverId} , 
                    {userid1 : req.body.requesterId}
                ]}
            })

            if(!accpted){
                return res.status(204).json({
                    message: "accepted Error",
                    success : false
                })
            }

            res.status(200).json({
                message : 'successfully accepted friend',
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

    async userContact (req:Request, res:Response){
        try {
            const findUserFollowing = await FriendInstance.findAll({
                where : {userid1 : req.body.userid},
                include: [{
                    model : userInstance,
                    as: "Receiver" 
                }]
            })

            const findUserFollower = await FriendInstance.findAll({
                where:{userid2 : req.body.userid},
                include: [{
                    model : userInstance,
                    required : true,
                    as : "Initiator",
                }]
            })

            const type = findUserFollowing.length && 'Receiver' 
            || findUserFollower.length && 'Initiator'

           if(!type) {
            return res.status(404).json({
                message : 'unmatch input data',
                success : false,
            })
        }
        const findFriend = await FriendInstance.findAll({
            where : {[Op.or]: [
                { userid1 : req.body.userid,},
                { userid2 : req.body.userid,},
        ], [Op.and] : [{
            status : 'friend'
        }]                   
            },
            include : [{
                as :  type as string,
                model : userInstance,
                attributes : ['username','userid'],
                required:true,
                include : [{
                    model : userInfoInstance,
                    required : true,
                    attributes : ['infoid', 'profile_url']
                },
                {
                    model: participantInstance,
                    include : [{
                        model : conversationInstance
                    }]
                },
                
            
            ]
            },
        ]
        
        })


        res.status(200).json({
            message : 'response sucessfully',
            success : true,
            result: findFriend
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