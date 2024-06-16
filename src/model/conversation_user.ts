import { DataTypes, Model } from "sequelize";
import { sequelize } from "../connection";

interface IConversationUser {
   coversationUserId: string,
    coversationId: string,
    userId: string,
    created_at?: Date,
    updated_at?: Date,
}

export class converstationUserInstance extends Model<IConversationUser>{}


converstationUserInstance.init({
    coversationUserId: {
        type: DataTypes.STRING(36),
        allowNull :false,
        primaryKey: true,
    },
    coversationId:{
        type: DataTypes.STRING(36),
        allowNull : false,
    },
    userId:{
        type: DataTypes.STRING(36),
        allowNull: false
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
},{sequelize, tableName:'conversation_user', timestamps:false})

sequelize.sync({alter:true}).then((result)=>{
    console.log(`excuting`)
})