import { DataTypes, Model } from "sequelize";
import { sequelize } from "../connection";



interface IGroupMember {
    groupMemberId : string,
    groupId : string,
    userid : string,
    joinGroup : Date,
    leaveGroup : Date,
}


class GroupMember extends Model<IGroupMember> {}



GroupMember.init({
    groupMemberId : {
        type: DataTypes.STRING(36),
        allowNull : false,
        primaryKey : true,
    },
    groupId : {
        type : DataTypes.STRING(36),
        allowNull : false,
      
    },
    userid : {
        type : DataTypes.STRING(36),
        allowNull : false,
    },
    joinGroup : {
        type: 'TIMESTAMP',
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
    },
    leaveGroup : {
        type: 'TIMESTAMP',
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
    }


}, {sequelize , tableName: "groupmember", timestamps: false})


sequelize.sync().then(()=> {
    console.log(`groupmember executing mysql schema`)
}).then(error =>  console.log(`in groupmember model `, error))