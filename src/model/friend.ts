import { DataTypes, Model } from "sequelize";
import { sequelize } from "../connection";

export interface IFriend {
   userid1 : string,
   userid2 : string,
   status? : string,
   requested_at? : Date,
   accepted_at? : Date
}

//select following from Ifrid where userid = '1'
//select follower from ifrid where userid = '1'

export class FriendInstance extends Model<IFriend> {}

export const FriendStatus = Object.freeze({
    friend: 'friend',
    following: 'following',
    follower : "follower",
    block : 'block'
  });


FriendInstance.init({
  userid1 : {
    type : DataTypes.STRING(36),
    allowNull : false,
    primaryKey : true
  },
  userid2:{
        type : DataTypes.STRING(36),
        allowNull : false,
        primaryKey : true
  },
  status : {
    type : DataTypes.ENUM,
    values : Object.values(FriendStatus),
    defaultValue : FriendStatus.following,
  },
  requested_at : {
    type: 'TIMESTAMP',
    defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    allowNull: false
  },
  accepted_at : {
    type: 'TIMESTAMP',
    defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    allowNull: false
  }
}, {sequelize , tableName:"friends" , timestamps : false})



//set alter to true if have something change init instance property
sequelize.sync({alter : false})
.then((result)=>{
    console.log(`friends executing mysql schema`)})
.catch(error=> console.log(`ìn friends modole`, error))