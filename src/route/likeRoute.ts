import express from 'express'
import likeController from '../controller/likeController'


const route = express.Router()
const likePostInstance = new likeController()


route.post('/create', likePostInstance.create)
route.get('/count/:postid', likePostInstance.totalPostLikeAndComment)
route.get('/:postid', likePostInstance.findAllUserLikePost)
route.post('/highlight', likePostInstance.checkUserLikePost)

export default route