

interface messageProps {
    message? : string,
    success? : Boolean,
    data? : String,
    error?: String,
}


export const message:messageProps = async (message , success , data , error) =>{
    return {
        message : message.message,
        success : message.success,
        data :  message.data,
        error : message.error
    }
}