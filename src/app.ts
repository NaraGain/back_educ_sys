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
import { EventEmitter } from "stream"
import bodyParser from "body-parser"
import { v4 as uuidv4 } from "uuid"
import { TaskInstance } from "./model/task"
import { userInfoInstance } from "./model/userInfo"
import { userInstance } from "./model/user"
import { PostInstance } from "./model/post"
dotenv.config();



const app = express()



app.use(cors());
//app.use(express.json())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended : false}))
app.use(express.static("./public/html"))
app.use('/uploads', express.static("./public/uploads"))




//sever-send-events 


app.get('/status', (req:Request, res:Response) => {
     res.json({clients: clients.length , clientsid 
      : clients.map((client:clinetType)=> client.id)})
}
    );

type clinetType = {
    id : string | number,
    res : Response,
}

type factsType = {
    id : string | null ,
    facts : string | undefined,
}

let clients:clinetType[] = [];
let facts:factsType[] = [];


// ...

function eventsHandler(req:Request, res:Response, next:NextFunction) {
    const headers = {
      'Content-Type': 'text/event-stream',
      'Connection': 'keep-alive',
      'Cache-Control': 'no-cache'
    };
    res.writeHead(200, headers);
  
    const data = `data: ${JSON.stringify(facts)}\n\n`;
  
    res.write(data);
  
    const clientId = Date.now().toString();
  
    const newClient:clinetType = {
      id: clientId as string,
      res
    };
  
    clients.push(newClient as clinetType);
  
    req.on('close', () => {
      console.log(`${clientId} Connection closed`);
      clients = clients.filter((client:clinetType) => client.id !== clientId);
    });
  }
  
  app.get('/events', eventsHandler);

// ...

function sendEventsToAll(newFact:factsType) {
    clients.forEach(client => client.res.write(`data: ${JSON.stringify(newFact)}\n\n`))
  }
  
  async function addFact(req:Request, res:Response, next:NextFunction) {
    const newFact:factsType = req.body;
    newFact.id = Date.now().toString()
    
    facts.push(newFact);
    res.json(newFact)
    return sendEventsToAll(newFact);
  }

  app.post('/fact', addFact);
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
        app.listen(process.env.PORT ,()=>{
            console.log(`server runing on PORT ${process.env.PORT}`)
        })
    } catch (error) {
        console.log("something error happen" ,error)
    }
}

start()