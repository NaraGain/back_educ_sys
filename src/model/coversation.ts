import { DataTypes, Model } from "sequelize";
import { sequelize } from "../connection";


interface IConversation {
    conversationId: string,
    title : string,
    isGroup: boolean,
    created_at?: Date,
    updated_at?: Date,
}


export class conversationInstance extends Model<IConversation>{}

conversationInstance.init({
    conversationId : {
        type: DataTypes.STRING(36),
        primaryKey : true,
        allowNull : false
    },
    title:{
        type: DataTypes.STRING(100),
    },
    isGroup:{
        type: DataTypes.BOOLEAN,
    },
    created_at : {
        type: 'TIMESTAMP',
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
    },
    updated_at: {
        type: 'TIMESTAMP',
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
    }
}, {sequelize , tableName:'coversation', timestamps: false})


sequelize.sync({alter:true}).then((result)=>{
    console.log(`excute model conversation`)
}).catch((error)=>{
    console.log(`error from converstion model`, error)
})