import mysql from "mysql2"
import dotenv from "dotenv"
dotenv.config()


export const connection = mysql.createPool({
    host : process.env.MYSQL_HOSTNAME,
    user : process.env.MYSQL_USER,
    password :  process.env.MYSQL_PASSWORD,
    database : process.env.MYSQL_DATABASE,
    waitForConnections : true,
    connectionLimit : 10,
})


export default async function connectionString () {
    try {
        if(connection){
            console.log(`connection database sucessfully`)
        }else{
            console.log(`connection faild `, connection)
        }
        return connection
    } catch (error) {
        console.log('connection faild', error)
    }
  
}


