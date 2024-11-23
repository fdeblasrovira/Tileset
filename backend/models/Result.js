const { DataTypes } = require('sequelize');

exports.model = {
  name: "Result",
  paranoid: true,
  model: {
    // Model attributes are defined here
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(2048),
      allowNull: false
    },
    imageUrl: {
      type: DataTypes.STRING(512),
      allowNull: false
    },
    order: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    formVersion: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    }
  }
}