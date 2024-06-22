import { DataTypes, Model } from "sequelize";
import { sequelize } from "../connection";
interface IParticipants {
    participantId : string,
    userId: string,
    conversationId: string,
    role? : string,
    join_date?: Date,
    leave_date?: Date,
}

export const RoleParticipant = Object.freeze({
    admin : 'admin',
    member: 'member'
})



export class participantInstance extends Model <IParticipants>{}

participantInstance.init({
    participantId: {
        type:DataTypes.STRING(36),
        primaryKey : true,
        allowNull : false
    },
    userId: {
        type: DataTypes.STRING(36),
        allowNull:false
    },
    conversationId:{
        type: DataTypes.STRING(36),
        allowNull : false,
    },
    role: {
        type: DataTypes.ENUM,
        values:Object.values(RoleParticipant),
        defaultValue : RoleParticipant.admin
    },
    join_date: {
        type: 'TIMESTAMP',
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
    },
    leave_date : {
        type: 'TIMESTAMP',
    }
}, 
{sequelize, tableName:'participant', timestamps:false})


sequelize.sync({alter : false}).then((result)=> {
    console.log(`executing mysql schema`)
}).catch((error)=> {
    console.log("in task Model" ,error)
})