import express from 'express'
import { messageController } from '../controller/messageController'

const route = express.Router()


const messageControllerInstance = new messageController


route.post(`/find_message`, messageControllerInstance.getMessage)
route.post(`/message_list`, messageControllerInstance.messageList)
route.post(`/create`, messageControllerInstance.createNewMessage)

export default route