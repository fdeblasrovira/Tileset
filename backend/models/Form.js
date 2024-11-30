const { DataTypes } = require('sequelize');

exports.model = {
  name: "Form",
  paranoid: true,
  model: {
    visibility: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    version: {
      type: DataTypes.INTEGER.UNSIGNED,
      defaultValue: 1,
      allowNull: false,
    }
  }
}