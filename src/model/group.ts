import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../connection';


interface IGroup {
 groupId : string,
 groupName : string,
 created_at : Date,
 updated_at : Date,
 
}

class Group extends Model<IGroup> {}

Group.init({
  groupId: {
    type: DataTypes.STRING(36),
    autoIncrement: true,
    primaryKey: true,
  },
  groupName: {
    type: new DataTypes.STRING(128),
    allowNull: false,
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
  }
}, {
  sequelize,
  tableName: 'groups',
  timestamps : false
});


sequelize.sync().then((result)=>{
  console.log(`group executing mysql schema`)})
.catch(error=> console.log(`ìn friends modole`, error))

export default Group;
