import express from 'express'
import { authenticate } from '../authenticate/authenticate'
import commentController from '../controller/commentController'


const commentInstants = new commentController




const route = express.Router()


route.post('/create', commentInstants.create)
route.post('/findComment', commentInstants.findCommentByPostId)
route.post("/deleteComment", commentInstants.deleteComment)
export default route