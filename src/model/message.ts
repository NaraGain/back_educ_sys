import { DataTypes, Model } from "sequelize";
import { sequelize } from "../connection";
interface IMessage {
    messageId : string,
    userId : string,
    content : string,
    created_at: Date,
    updated_at:Date,
}

export class messageInstance extends Model<IMessage> {}


messageInstance.init({
    messageId : {
        type :DataTypes.STRING(36),
        allowNull : false,
        primaryKey : true,
    },
    userId : {
        type:DataTypes.STRING(36),
        allowNull : false,
    },
    content : {
        type : DataTypes.STRING(256),
        allowNull : false,
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

}, {sequelize, tableName:'message', timestamps:false})