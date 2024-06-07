import express from 'express'
import friendController from '../controller/friendController'
const route = express.Router()

const friendControllerInstance = new friendController()

route.post('/create', friendControllerInstance.create)
route.post('/getCount', friendControllerInstance.countTotalFriend)
route.post('/userFriend', friendControllerInstance.findAllUserFriend)
route.post('/remove', friendControllerInstance.removeFriend)
export default route