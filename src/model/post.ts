import { DataTypes, Model } from "sequelize";
import { sequelize } from "../connection";
import { uploadFile } from "./uploadFile";
import { CommentInstance } from "./comments";
export default interface postModel {
    postid: string,
    userid: string | undefined,
    content: string | null,
    upload_id : string | undefined,
    upload_url: string | [] | undefined,
    create_at?: string ,
    update_at?:string,
}


export  interface IPostAttributes {
    postid: string,
    userid: string | undefined,
    content: string ,
    created_at?: string ,
    updated_at?:string,
}


export class PostInstance extends Model<IPostAttributes> {}

PostInstance.init({
    postid : {
        type : DataTypes.STRING(36),
        allowNull : false,
        primaryKey : true
    },
    userid : {
        type : DataTypes.STRING(36),
        allowNull : false
    },
    content : {
        type : DataTypes.TEXT
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

{sequelize , tableName: "posts" , timestamps:false})

//create relative postinstall with uploadPostInstace
PostInstance.hasMany(uploadFile, {foreignKey : "post_id"})
PostInstance.hasMany(CommentInstance, {
    foreignKey : "postid",
    onDelete: 'CASCADE', 
})
// and uploadPostInstance is belong to postinstance
uploadFile.belongsTo(PostInstance, {
    foreignKey : "post_id"
})

CommentInstance.belongsTo(PostInstance, {
    foreignKey : "postid",
    onDelete: 'CASCADE',
    

})

sequelize.sync({alter : false}).then(()=>{
    console.log('executing post model')
}).catch((error)=> {
    console.error(error)
})