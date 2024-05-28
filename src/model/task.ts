import { DataTypes, Model } from "sequelize";
import { sequelize } from "../connection";



interface ITaskAttributes {
    id : string,
    title : string,
    user : string,
    completed : boolean,
}


export class TaskInstance extends Model<ITaskAttributes> {}

TaskInstance.init({
    id: {
        type: DataTypes.STRING,
        allowNull : false,
        primaryKey: true
    },
    title:{
        type : DataTypes.STRING,
    },
    user: {
        type: DataTypes.STRING,
    },
   completed:  {
    type : DataTypes.BOOLEAN,
    defaultValue : false
    },

}, {sequelize , tableName:"todo"})


//set alter to true have something chage
sequelize.sync({alter : false}).then((result)=> {
    console.log(`executing mysql schema`)
}).catch((error)=> {
    console.log("in task Model" ,error)
})