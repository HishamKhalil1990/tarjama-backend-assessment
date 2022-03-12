'use strict';

import { Model, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';

module.exports = (sequelize : any, DataTypes : any) => {
  class Expenses extends Model<InferAttributes<Expenses>, InferCreationAttributes<Expenses>> {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    declare id : CreationOptional<number>;
    declare user_id : number;
    declare category_id : number;
    declare spending_date : string;
    declare amount : number;
    static associate(models : any) {
      // define association here
      Expenses.belongsTo(models.User,{foreignKey: 'user_id', targetKey: 'id'});
      Expenses.belongsTo(models.Category,{foreignKey: 'category_id', targetKey: 'id'});

    }
  }
  Expenses.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    user_id:{
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    category_id:{
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    spending_date: {
      type: DataTypes.STRING,
      allowNull: false
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Expenses',
  });
  return Expenses;
};