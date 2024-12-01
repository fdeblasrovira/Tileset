const { DataTypes } = require('sequelize');

exports.model = {
  name: "FormResult",
  paranoid: true,
  model: {
    version: {
      type: DataTypes.INTEGER.UNSIGNED,
      defaultValue: 1,
      allowNull: false,
    }
  }
}