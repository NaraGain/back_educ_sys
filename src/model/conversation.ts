import { DataTypes, Model } from "sequelize";
import { sequelize } from "../connection";
import { messageInstance } from "./message";
import { participantInstance } from "./participants";

interface IConversation {
    conversationId: string,
    name: string | null,
    isGroup?: boolean,
    created_at?: Date,
    updated_at?: Date
}

export class conversationInstance extends Model<IConversation>{}


conversationInstance.init({
    conversationId:{
        type : DataTypes.STRING(36),
        primaryKey : true,
        allowNull : false,
    },
    name : {
        type: DataTypes.STRING(128),
        defaultValue : null,
    },
    isGroup:{
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    created_at: {
        type: 'TIMESTAMP',
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
    },
    updated_at: {
        type: 'TIMESTAMP',
       
    },
},{sequelize, tableName:'conversation', timestamps:false})


conversationInstance.hasMany(messageInstance, {foreignKey:'conversationId', onDelete: 'CASCADE'})
messageInstance.belongsTo(conversationInstance, {foreignKey : 'conversationId', onDelete: 'CASCADE'})

conversationInstance.hasMany(participantInstance, {foreignKey : 'conversationId', onDelete:'CASCADE'})
participantInstance.belongsTo(conversationInstance, {foreignKey: 'conversationId', onDelete:'CASCADE'})


sequelize.sync({alter : false}).then((result)=> {
    console.log(`executing conversation in model`)
}).catch((error)=> {
    console.log("in task Model" ,error)
})