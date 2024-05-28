import { DataTypes, Model } from "sequelize";
import { sequelize } from "../connection";
import { userInstance } from "./user";

export default interface commentPosts {
    commentid : string,
    userid :string |  null,
    postid:string,
    comment:string,
    create_at? : string,
    update_at? : string,
}

export interface ICommentAttributes {
    commentid : string,
    userid :string | null,
    postid:string,
    comment:string,
    created_at? : string,
    updated_at? : string,
}

export class CommentInstance extends Model<ICommentAttributes> {}

CommentInstance.init({
    commentid : {
        type : DataTypes.STRING(36),
        allowNull : false,
        primaryKey: true
    },
    postid : {
        type : DataTypes.STRING(36),
        allowNull: false,
    },
    userid :{
        type : DataTypes.STRING(36),
        allowNull : false
    },
    comment : {
        type : DataTypes.TEXT,
        allowNull : false
    },
    created_at : {
        type: 'TIMESTAMP',
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
    },
    updated_at : {
        type: 'TIMESTAMP',
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false
    },
}, 
    
{sequelize , tableName : "commentPosts", timestamps : false})

//create relationship between comment and user
// userInstance.belongsTo(CommentInstance, {foreignKey : 'userid'})
//CommentInstance.belongsTo(userInstance, {foreignKey : "userid"})



sequelize.sync({alter : false}).then(()=> {
    console.log(`executing comment model`)
}).catch((error)=>{
    console.log("error", error)
})