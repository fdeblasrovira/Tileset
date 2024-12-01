const { DataTypes } = require('sequelize');

exports.model = {
  name: "FormGeneralInfo",
  paranoid: true,
  model: {
    version: {
      type: DataTypes.INTEGER.UNSIGNED,
      defaultValue: 1,
      allowNull: false,
    }
  }
}