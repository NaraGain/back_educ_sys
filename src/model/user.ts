import { RowDataPacket } from "mysql2";
import { DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import { sequelize } from "../connection";
import { userInfoInstance } from "./userInfo";
import { PostInstance } from "./post";
import { CommentInstance } from "./comments";
import { FriendInstance } from "./friend";

export default interface userModel extends RowDataPacket {
    userid?: string ,
    firstname?:string,
    lastname?:string,
    username?:string | null,
    password?:string,
    email?: string,
    phone?: string,
    isActive?:Boolean,
    token?: string | null,
    created_at?: Date,
}

export  interface IuserAttributes {
    userid?: string ,
    firstname?:string,
    lastname?:string,
    username?:string | null,
    password?:string,
    email?: string,
    phone?: string,
    isActive?:Boolean,
    token?: string | null,
    created_at?: Date,
    updated_at? : Date,
}


export class userInstance 
extends Model<IuserAttributes> {}

userInstance.init({
    userid : {
        type: DataTypes.STRING(36),
        allowNull: false,
        primaryKey : true
    },
    firstname :{
        type : DataTypes.STRING(36),
        allowNull : false,
    },
    lastname : {
        type : DataTypes.STRING(36),
        allowNull : false,
    },
    username : {
      type :  DataTypes.STRING,
      allowNull : false,
    },
    email:{
        type : DataTypes.STRING(128),
    },
    phone:{
        type : DataTypes.STRING(36)
    },
    password : {
        type : DataTypes.STRING(128),
        allowNull : false
    },  
    isActive : {
        type: DataTypes.BOOLEAN,
    },
    token : {
        type : DataTypes.STRING,
    },
    created_at: {
        type: 'TIMESTAMP',
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
      },
      updated_at: {
        type: 'TIMESTAMP',
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
      }

}, 
{sequelize, tableName : "users" , timestamps: false})




//define relationship
userInstance.hasOne(userInfoInstance ,{
    foreignKey : 'userid' 
})
userInfoInstance.belongsTo(userInstance,
     { foreignKey : "userid",
        onDelete : "CASCADE'",
     })

userInstance.hasMany(PostInstance, 
    {
        foreignKey : "userid",
        onDelete : "CASCADE"
        
    })

PostInstance.belongsTo(userInstance , {
    foreignKey : "userid",
    onDelete : "CASCADE"
})   

userInstance.hasMany(CommentInstance, {
    foreignKey : "userid",
    onDelete : "CASCADE",

})

userInstance.hasMany(FriendInstance , {
    foreignKey : 'userid1',
    onDelete : 'CASCADE',
    as: 'FriendshipsInitiated' 
})

userInstance.hasMany(FriendInstance ,{
    foreignKey : "userid2",
    onDelete : 'CASCADE',
    as: 'FriendshipsReceived'
   
})

CommentInstance.belongsTo(userInstance, {
    foreignKey : "userid",
    onDelete : "CASCADE"
})

FriendInstance.belongsTo(userInstance , {
    foreignKey : "userid1" , 
    onDelete : "CASCADE",
    as: 'Initiator'
   
})

FriendInstance.belongsTo(userInstance , {
    foreignKey : "userid2",
    onDelete : "CASCADE",
    as: 'Receiver'
  
})

//set alter to false if something change,
sequelize.sync({alter : false}).then((result)=> {
    console.log(`executing mysql schema`)
}).catch((error)=> {
    console.log("in task Model" ,error)
})