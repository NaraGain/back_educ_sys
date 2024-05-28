import express from 'express'

import { authenticate } from '../authenticate/authenticate'
import userContorller from '../controller/userController'
import multer from 'multer'
import fs from 'fs'
const route = express.Router()


const userInstants =  new userContorller

//handle fileupload 
const storage = multer.diskStorage({
    destination:function(req,file,cb){
        const uploadDir = "./public/uploads"
        if(!fs.existsSync(uploadDir)){
        fs.mkdirSync(uploadDir , {recursive:true})
    }
    cb(null ,uploadDir)
},
filename:function(req, file ,cb){
    cb(null, `u-${Date.now()}-${Math.floor(Math.random()* 1000)}.png`)
}
})

//upload to with multer functin
const upload = multer({
    storage : storage,
    limits : {
        fileSize : 5 * 1024 * 1024
    },
    fileFilter: (req,file ,cb)=> {
        if(file.mimetype.startsWith('image/')){
            cb(null ,true)
        }else{
            cb(new Error('Invalid file type. Only images are allowed.'));
        }
    }
})

route.get('/', userInstants.findAll)
route.post('/', userInstants.create)
route.post('/changeProfile', upload.single('profile'), userInstants.changeProfile)
route.post('/login', userInstants.login)
route.post('/profiles', userInstants.findOne)
route.post('/update' ,userInstants.update)
route.post('/userInfo', userInstants.userDescript)
route.post('/userFile', userInstants.findUserFile)
route.delete('/:userid', userInstants.delete)
export default route