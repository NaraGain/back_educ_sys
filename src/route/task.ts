import { Router ,Request ,Response } from "express";
import { Task } from "../model/task";



const router = Router()

let tasks: Task[] = [];

router.post('/' , (request:Request, response:Response) => {
    try {
        const task:Task= {
            id: tasks.length,
            title: request.body.title,
            description: request.body.description,
            completed: false,
    
        }      
    } catch (error) {
        response.status(500).json({
            
        })
    }
  
})


router.get('/:id', (request:Request ,response:Response)=> {
    try {

        const task = tasks.find((item)=> item.id == parseInt(request.params.id))

        if(!task){
            response.status(401).json({
                message: "request not found",
                succuss : false,
            })
        }

        response.status(200).json({
            message : "hello task api",
            result:task,
            success: true,
        })
    } catch (error) {
        response.status(500).json({
            message : 'error internal server',
            success: false
        })
    }
})


module.exports = router;
