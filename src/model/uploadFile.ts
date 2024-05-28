import { DataTypes, Model } from "sequelize";
import { sequelize } from "../connection";

export interface IUploadFileAttributes {
    upload_id : string,
    post_id : string,
    upload_url : string,
    created_at : string,
    updated_at : string,
}


export class uploadFile extends Model<IUploadFileAttributes> {}


uploadFile.init({
    upload_id : {
        type : DataTypes.STRING(36),
        allowNull : false,
        primaryKey : true,
    },
    post_id : {
        type : DataTypes.STRING(36),
        allowNull : false,
    },
   upload_url: {
    type : DataTypes.STRING(128),
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
    
},{sequelize, tableName: "uploadPosts", timestamps:false})

sequelize.sync({alter : false}).then((result)=> {
    console.log(`executing sql uploadFile Model`)
}).catch((error)=> {
    console.log("in task Model" ,error)
})