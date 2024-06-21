import { Op, QueryTypes } from "sequelize";
import { sequelize } from "../connection";
import { conversationInstance } from "../model/conversation";
import { messageInstance } from "../model/message";
import { Request, Response } from "express";
import { generateIdRandomId } from "../message/generateRandomId";
import { RoleParticipant, participantInstance } from "../model/participants";
import { userInstance } from "../model/user";
import { userInfoInstance } from "../model/userInfo";

export class conversationController {
    async createGroup (req:Request , res:Response) {
        try {
            const conversationId:string = generateIdRandomId(18)
            const response = await conversationInstance.create({
                conversationId: conversationId as string,
                name : req.body.name
            })

            res.status(200).json({
                message: 'message success',
                success : true,
                result: response
            })
        } catch (error) {
            res.status(500).json({
                message : "error internal server",
                succuess : false,
                error : error,
            })
        }
    }
    async findGetAllUserConversation (req:Request , res:Response){
        try {
            const findUser = await userInstance.findOne({
                where : {username : req.body.username}
             })

             const conversation = await conversationInstance.findAll({
                include: [
                    {
                        model : participantInstance,
                        where : {userId : findUser?.dataValues.userid},
                        attributes : ['role'],
                        include: [
                            {
                                model: userInstance,
                                required: false,
                                attributes : ['userid', 'username'],
                                include : [
                                    {
                                        model : userInfoInstance,
                                        attributes : ['infoid','profile_url'],
                                        required : false,
                                       
                                    }
                                ]
                            }
                        ]
                    },
                ],
                attributes : {
                    include : [
                        [sequelize.literal(`(SELECT 
                            content FROM message inner join conversation on
                             message.conversationId = conversation.conversationId
                              WHERE message.conversationId =
                               conversation.conversationId
                                ORDER BY message.created_at DESC LIMIT 1)`), 'lastmessage'],
                        [sequelize.literal(`(SELECT message.created_at FROM message inner join conversation on 
                            conversation.conversationId = message.conversationId WHERE message.conversationId = 
                            conversation.conversationId ORDER BY message.created_at DESC LIMIT 1)`), 'lastMessageTime']
                    
                    ]
                },
                order: [[sequelize.literal('lastMessageTime'), 'DESC']]
               
             })

             res.status(200).json({
                message: 'response successfully',
                success : true,
                result : conversation,
             })

        } catch (error) {
            res.status(500).json({
                message : "error internal server",
                succuess : false,
                error : error,
            })
        }
    }

    async findConverstion (req:Request , res:Response) {
        try {
            
             const findUser = await userInstance.findOne({
                where : {username : req.body.username}
             })

            const findConverstion = await conversationInstance.findOne({
                attributes : ['conversationId', 'name', 'isGroup'],
                include: [{
                    model: participantInstance,
                    where : {userId : findUser?.dataValues.userid}
                }]
            })
           
            if(!findConverstion) {
                const conId:string = await generateIdRandomId(18)
                const participantId:string = await generateIdRandomId(18)

                const createNewConversation = await conversationInstance.create({
                    conversationId : conId as string,
                    name : req.body.name,
                   
                })

                const createAParticipant = await participantInstance.create({
                    participantId : participantId,
                    userId : findUser?.dataValues?.userid as string,
                    role : RoleParticipant.admin,
                    conversationId : conId as string,
                })

                if(!createNewConversation){
                    return res.status(404).json({
                        message : 'not create new conversation',
                        success : false
                    })
                }
                if(!createAParticipant){
                    return res.status(404).json({
                        message : `not create new participant `,
                        success : false
                    })
                }

                return res.status(404).json({
                    message : 'create new conversation and participantion',
                    success : true,
                    result : 1,
                })
            }else{
                const conversation = await conversationInstance.findOne({
                    include : [
                        {
                            model : participantInstance,
                            where : {userId : findUser?.dataValues?.userid},
                            include : [{
                                model: userInstance,
                                attributes :  ['userid','username']
                            }]
                        }
                    ]
                })

               res.status(200).json({
                    message: 'response successfully',
                    success : true,
                    result : conversation,
                    test : findConverstion,
                })
            }

         
            

        } catch (error) {
            console.error('Error fetching conversations:', error);
            res.status(500).json({ error: 'An error occurred while fetching conversations.' });
        }
    }

}