import { DataTypes, Model } from "sequelize";
import { sequelize } from "../connection";

export interface IMessage {
    messageId: string,
    conversationId: string,
    senderId: string,
    content: string,
    created_at?: Date,
    updated_at?: Date
}



export  class messageInstance extends Model<IMessage>{}

messageInstance.init({
    messageId: {
        type: DataTypes.STRING(36),
        allowNull: true,
        primaryKey: true
    },
    conversationId:{
        type: DataTypes.STRING(36),
        allowNull: false
    },
    senderId:{
        type: DataTypes.STRING(36),
        allowNull: false
    },
    content:{
        type: DataTypes.STRING(256),
    },
    created_at:{
    type: 'TIMESTAMP',
    defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    allowNull: false
    },
    updated_at:{
    type: 'TIMESTAMP',
    }
}, {sequelize , tableName:'message', timestamps:false})


sequelize.sync({alter : false}).then((result)=> {
    console.log(`executing mysql schema`)
}).catch((error)=> {
    console.log("in task Model" ,error)
})