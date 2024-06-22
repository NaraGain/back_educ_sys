import { NextFunction, Request ,Response } from "express";
import { messageInstance } from "../model/message";
import { userInstance } from "../model/user";
import { generateIdRandomId } from "../message/generateRandomId";
import { participantInstance } from "../model/participants";
import { conversationInstance } from "../model/conversation";
import { userInfoInstance } from "../model/userInfo";


export class messageController {

    async createNewMessage (req:Request , res:Response){
        try {
            const messageId:string = await generateIdRandomId(14)
            const response = await messageInstance.create({
                messageId : messageId,
                senderId : req.body.userid,
                conversationId : req.body.conversationId,
                content : req.body.content,
            })
            res.status(200).json({
                message : `find message in group ${req.body}`,
                success : true,
                result : response
            })
        } catch (error) {
            res.status(500).json({
                message : "error internal server",
                succuess : false,
                error : error,
            })
        }
    }

    async getMessage (req:Request, res:Response , next:NextFunction) {
            try {

                 const response = await conversationInstance.findOne({
                    where : {
                        conversationId: req.body.conversationId
                    },
                    order: [[messageInstance, 'created_at', 'ASC']],
                    include: [
                        {
                            model: participantInstance,
                            include : [{
                                model : userInstance,
                                attributes: ['userid', 'username'],
                                required : true,
                                include : [{
                                    model : userInfoInstance,
                                    attributes : ['infoid', 'profile_url'],
                                    required : false
                                }]
                            }]
                        },
                        {
                        model: messageInstance,
                        order: [['created_at', 'ASC']],
                        include :[{
                            model : userInstance,
                            attributes: ['userid', 'username'],
                            required : true,
                            include : [{
                                model : userInfoInstance,
                                attributes : ['infoid', 'profile_url'],
                                required : false
                            }]
                        }],
                    }],
                 
                 })
                

                res.status(200).json({
                    message : `find message in converstion ${req.params.groupId}`,
                    success : true,
                    result : response,
                })
            } catch (error) {
                res.status(500).json({
                message : "error internal server",
                succuess : false,
                error : error,
            })
            }
    }

    async messageList (req:Request, res:Response , next:NextFunction){
       try {
        
      const user = await userInstance.findAll({
        include : [{
            model : messageInstance,
            as : "sender",
            where : { receiverId : req.body.userId },
            required : false,
            limit : 1,
            order : [['created_at', 'DESC']]
        }, 
        {
            model: messageInstance,
            as: 'receiver',
            where: { senderId: req.body.userId },
            required: false,
            limit: 1,
            order: [['created_at', 'DESC']]  
        }
    ]
      })

     
 
            res.status(200).json({
                message : "success query messageList",
                success : true,
                result : user
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