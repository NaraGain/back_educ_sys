import express, {Request, Response , NextFunction} from "express"
import dotenv from "dotenv"
import userRoute from "./route/userRoute"
import commentRoute from "./route/commentRoute"
import postRoute from "./route/postRoute"
import likeRoute from "./route/likeRoute"
import friendRoute from "./route/friendRoute"
import connectionString, { connection, sequelize, testConnection } from "./connection";
import cors from "cors";
import path from "path";
import { Socket,Server } from "socket.io"
import http from 'http'
import { EventEmitter } from "stream"
import bodyParser from "body-parser"
import { v4 as uuidv4 } from "uuid"
import { TaskInstance } from "./model/task"
import { userInfoInstance } from "./model/userInfo"
import { userInstance } from "./model/user"
import { PostInstance } from "./model/post"
import Message from "./model/message"

dotenv.config();


const onlineUser = new Set()
const app = express()
const server = http.createServer(app)
const io = new Server(server, {
  cors : {
    origin : 'http://localhost:3000',
    methods : ['GET',"POST","UPDATE","DELETE"]
  }
})

app.use(cors());
//app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended : false}))
app.use(express.static("./public/html"))
app.use('/uploads', express.static("./public/uploads"))


app.post('/message', async(req , res)=>{
  const {content , userId , groupId} = req.body
})

io.on('connection', (socket)=> {
  console.log("New Client connected", socket.id)

  //
  socket.on('sendMessage', async (messageData)=> {
      const {userId , groupId , content} = messageData
      console.log(messageData)
      // const message = await Message.create({userId , groupId , content})
      io.to(groupId.toString()).emit('receiveMessage', messageData)
  });

  //
  socket.on("join", (grouId)=>{
     socket.join(grouId.toString())
  });

  socket.on('discount', ()=>{
    console.log('Client disconnected')
  })

})


//route
app.use(`/api/v1/user`, userRoute)
app.use('/api/v1/post', postRoute)
app.use('/api/v1/comment',commentRoute)
app.use("/api/v1/like", likeRoute)
app.use('/api/v1/friend', friendRoute)
__dirname = path.resolve()
if(process.env.NODE_ENV === 'production'){
    app.use(express.static(path.join(__dirname , 'client/build')))
    app.get('*' ,(req,res)=>{
        res.sendFile(path.resolve(__dirname ,'client','build', 'index.html'))
    })
}

const start = async () => {
    try {
        await testConnection()
        await connectionString()
        server.listen(process.env.PORT ,()=>{
            console.log(`server runing on PORT ${process.env.PORT}`)
        })
    } catch (error) {
        console.log("something error happen" ,error)
    }
}

start()