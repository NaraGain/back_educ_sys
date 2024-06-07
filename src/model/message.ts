import { Model, DataTypes, TEXT } from 'sequelize';
import { sequelize } from '../connection';


interface IMessage {
    messageId : string,
    from_userId : string,
    to_userId : string,
    content : string,

}


class Message extends Model {
  public id!: number;
  public userId!: number;
  public groupId!: number;
  public content!: string;
}

Message.init({
  messageId: {
    type: DataTypes.STRING(36),
    autoIncrement: true,
    primaryKey: true,
  },
  userId : {
    type : DataTypes.STRING(36),
    allowNull : false
  },
  from_number: {
    type: DataTypes.STRING(36),
    allowNull: false,
  },
  to_number: {
    type: DataTypes.STRING(36),
    allowNull: false,
  },
  content: {
    type: TEXT,
    allowNull: false,
  },
}, {
  sequelize,
  tableName: 'messages',
});


sequelize.sync()
.then((result)=>{
    console.log(`friends executing mysql schema`)})
.catch(error=> console.log(`ìn friends modole`, error))

export default Message;
