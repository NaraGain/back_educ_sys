import { DataTypes, Model } from "sequelize";
import { sequelize } from "../connection";



interface IGroupMember {
    groupMemberId : string,
    conversationId : string,
    userId : string,
    join_date : Date,
    leave_date : Date
}

export class groupMemberInstance extends Model<IGroupMember>{}


groupMemberInstance.init({
 groupMemberId: {
    type : DataTypes.STRING(36),
    
 },
  conversationId: {
    type: DataTypes.STRING(36),
    allowNull : false,
  },
  userId:{
    type:DataTypes.STRING(36),
    allowNull: false
  },
  join_date:{
    type: 'TIMESTAMP',
    defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    allowNull: false
  },
  leave_date:{
    type: 'TIMESTAMP',
    defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    allowNull: false
  }
},  
{sequelize , tableName:'groupMember',timestamps:false})