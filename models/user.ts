'use strict';

import { Model, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';

module.exports = (sequelize : any, DataTypes : any) => {
  class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
    */
    declare id : CreationOptional<number>;
    declare name : string;
    declare email : string;
    declare password : string;
    declare last_login : CreationOptional<Date>;
    static associate(models : any) {
      // define association here
      User.hasMany(models.Category,{foreignKey: 'user_id', sourceKey: 'id'});
      User.hasMany(models.Expenses,{foreignKey: 'user_id', sourceKey: 'id'});
    }
  }
  User.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    last_login: {
      type: DataTypes.DATE,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};