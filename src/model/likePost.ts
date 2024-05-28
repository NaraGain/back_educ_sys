import { DataTypes, Model } from "sequelize";
import { sequelize } from "../connection";
export default interface likePosts {
    likeid : string,
    userid : string,
    postid : string,
    created_at : Date,
    updated_at : Date,
}

export  interface ILikePostsAttributes {
    likeid : string,
    userid : string,
    postid : string,
    created_at : Date,
    updated_at : Date,
}

export class likePostInstance extends Model<ILikePostsAttributes>{}


likePostInstance.init({
  likeid :  {
    type : DataTypes.STRING(36),
    primaryKey : true,
    allowNull : false,

  },
  userid : {
        type :DataTypes.STRING(36),
        allowNull : false
  },
  postid : {
    type :DataTypes.STRING(36),
    allowNull : false
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

},{
    sequelize, tableName : "likePosts",timestamps : false
})

sequelize.sync({alter : false}).then((result)=> {
    console.log(`executing sql like Model`)
}).catch((error)=> {
    console.log("in task Model" ,error)
})