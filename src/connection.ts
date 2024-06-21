import mysql from "mysql2"
import dotenv from "dotenv"
import { Sequelize } from "sequelize"
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


export const sequelize = new Sequelize(
    `${process.env.MYSQL_DATABASE}`,
    `${process.env.MYSQL_USER}`,
    `${process.env.MYSQL_PASSWORD}`,
    {
    logging : false,
    host : process.env.MYSQL_HOSTNAME,
    dialect: 'mysql',
    
    })


 export const testConnection = async () => {
    try {
        await sequelize.authenticate();  
        console.log(`Connection has bee established successfully.`)
    } catch (error) {
        console.log(`Unable to connection to database:`, error)
    }
 }

