import { BelongsTo, DATE, DataTypes, Model } from "sequelize";
import { sequelize } from "../connection";
import { timeStamp } from "console";
import { userInstance } from "./user";


export default interface userInfoModel {
     infoid : string,
     userid: string,
     profile_url?:string,
     address?:string,
     bio?:string,
     phone?:string,
     create_at?:string,
     update_at?:string,
}


export interface IUserInfoAttributes {
     infoid : string,
     userid: string,
     profile_url?:string,
     address?:string,
     bio?:string,
     phone?:string,
     created_at?:string,
     updated_at?:string,
}

export class userInfoInstance extends Model<IUserInfoAttributes> {}

userInfoInstance.init({
     infoid : {
          type : DataTypes.STRING(36),
          primaryKey : true,
          allowNull : false
     },
     userid : {
           type : DataTypes.STRING(36),
           allowNull : false
           
     },
     profile_url : {
          type : DataTypes.STRING(256)
     },
     address : {
          type : DataTypes.TEXT
     },
     bio : {
        type : DataTypes.TEXT
     },
     phone: {
          type : DataTypes.STRING(100)
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
{sequelize, tableName : "userInfo", timestamps: false})




sequelize.sync({alter: false}).then((result)=> {
     console.log(`executing model userInfo table`)
}).catch((error)=> {
     console.log(error)
})

