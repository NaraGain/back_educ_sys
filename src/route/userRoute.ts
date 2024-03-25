import express from 'express'
import { createUser, getUser, getUserByType, loginUser } from '../controller/userController'
import { authenticate } from '../authenticate/authenticate'
const route = express.Router()

route.get('/', getUser)
route.post('/', createUser)
route.post('/login', loginUser)
route.post('/type', authenticate, getUserByType)

export default route