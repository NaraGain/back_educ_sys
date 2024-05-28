import express from 'express'
import { createPost, detelePost, findPostOne, findUserPost, publicPost, uploadPhoto } from '../controller/postController'
import { authenticate } from '../authenticate/authenticate'
import multer from 'multer'
import path from 'path'
import fs from "fs"
const route = express.Router()



const storage = multer.diskStorage({
    destination:function(req , file ,cb){
        const uploadDir = "./public/uploads"
        if(!fs.existsSync(uploadDir)){
        fs.mkdirSync(uploadDir,{recursive:true})
        }
     
        cb(null, uploadDir);
    },
    filename:function(req, file ,cb){
        cb(null , 
            `p-${Date.now()}-${Math.floor(Math.random()* 1000)}.png`) ;
    }
})

// const storage = multer.memoryStorage()
const upload = multer({
    storage: storage,
    limits:{
        fileSize: 5 * 1024 * 1024
    },
    fileFilter:(req ,file,cb)=>{
        if(file.mimetype.startsWith('image/')){
            cb(null, true)
        }else{
            cb(new Error('Invalid file type. Only images are allowed.'));
        }  
    },

})

route.post('/', createPost)
route.get('/', publicPost)
route.post('/userfeed', findUserPost)
route.post('/findOne', findPostOne)
route.post('/upload', upload.array('images',5), uploadPhoto)
route.post('/delete' , detelePost)

export default route