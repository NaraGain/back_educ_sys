import express from 'express'
import { conversationController } from '../controller/conversationControll'


const route = express.Router()



const conversationControllerInstance = new conversationController



route.post('/', conversationControllerInstance.findConverstion)
route.post('/conversation', conversationControllerInstance.findGetAllUserConversation)

export default route