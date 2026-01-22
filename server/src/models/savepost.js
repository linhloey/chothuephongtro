'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SavePost extends Model {
    static associate(models) {
      SavePost.belongsTo(models.User, { foreignKey: 'userId', targetKey: 'id', as: 'userData' });
      SavePost.belongsTo(models.Post, { foreignKey: 'postId', targetKey: 'id', as: 'postData' });
    }
  }
  SavePost.init({
    userId: DataTypes.STRING, 
    postId: DataTypes.STRING, 
  }, {
    sequelize,
    modelName: 'SavePost',
  });
  return SavePost;
};