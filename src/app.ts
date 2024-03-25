import express, {Request} from "express"
import dotenv from "dotenv"
import userRoute from "./route/userRoute"
import connectionString from "./connection";
import cors from "cors";
import bodyParser, { json } from "body-parser";
dotenv.config();

const app = express()



app.use(cors());
app.use(json())
//route
app.use('/api/v1/user', userRoute)

const start = async () => {
    try {
        await connectionString()
        app.listen(process.env.PORT ,()=>{
            console.log(`server runing on PORT ${process.env.PORT}`)
        })
    } catch (error) {
        console.log("something error happen" ,error)
    }
}

start()