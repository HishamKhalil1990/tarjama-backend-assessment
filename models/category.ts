'use strict';

import { Model, InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize';

module.exports = (sequelize : any, DataTypes : any) => {
  class Category extends Model<InferAttributes<Category>, InferCreationAttributes<Category>> {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    declare id : CreationOptional<number>;
    declare user_id : number;
    declare name : string;
    static associate(models : any) {
      // define association here
      Category.belongsTo(models.User,{foreignKey: 'id', targetKey: 'user_id'});
      Category.hasMany(models.Expenses,{foreignKey: 'id', sourceKey: 'category_id'});
    }
  }
  Category.init({
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    user_id:{
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'Category',
  });
  return Category;
};