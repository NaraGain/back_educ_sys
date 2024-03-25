import { RowDataPacket } from "mysql2";


export default interface userModel extends RowDataPacket {
    userid?: String ,
    firstname?:String,
    lastname?:String,
    username?:String,
    password?:String,
    email?: String,
    phone?: String,
    isActive?:Boolean,
    token?: String | null,
    created_at?: Date,
}





