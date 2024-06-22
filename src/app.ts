import express, {Request, Response , NextFunction} from "express"
import dotenv from "dotenv"
import userRoute from "./route/userRoute"
import commentRoute from "./route/commentRoute"
import postRoute from "./route/postRoute"
import groupRoute from "./route/groupRoute"
import likeRoute from "./route/likeRoute"
import friendRoute from "./route/friendRoute"
import messageRoute from "./route/messageRoute"
import connectionString, { connection, sequelize, testConnection } from "./connection";
import cors from "cors";
import path from "path";
import { Server } from "socket.io"
import http from 'http'
import { EventEmitter } from "stream"
import bodyParser from "body-parser"
import { v4 as uuidv4 } from "uuid"
import { generateIdRandomId } from "./message/generateRandomId"


dotenv.config();

interface User {
  userId: string;
  socketId: string;
}

const users:User[] = []
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
  socket.on('login', (userId:string)=> {
      users.push({userId , socketId:socket.id})
      io.emit('users', users)
  });
  socket.on('sendMessage', async (messageData)=> {
      const {userId , groupId , content} = messageData
      const mid:string = uuidv4()
      const id = generateIdRandomId(18)
      io.to(groupId.toString()).emit('receiveMessage', messageData)
    
  });

  //
  socket.on("join", (grouId)=>{
     socket.join(grouId.toString())
  });

  socket.on('discount', ()=>{
    const index = users.findIndex((user)=> user.socketId === socket.id)
    if(index !== -1){
      console.log(`${users[index].userId} disconnected`)
      users.splice(index , 1)
    }
    io.emit('users',users)
    console.log('Client disconnected')
  })

})


//route
app.use(`/api/v1/user`, userRoute)
app.use('/api/v1/post', postRoute)
app.use('/api/v1/comment',commentRoute)
app.use("/api/v1/like", likeRoute)
app.use('/api/v1/friend', friendRoute)
app.use('/api/v1/group', groupRoute)
app.use('/api/v1/message', messageRoute )
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