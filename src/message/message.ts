

interface message {
    message? : string,
    success? : Boolean,
    data? : String,
    error?: String,
}


export const message = async (message : message) =>{
    return {
        message : message.message,
        success : message.success,
        data :  message.data,
        error : message.error
    }
}