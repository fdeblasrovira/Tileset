const { DataTypes } = require('sequelize');

exports.model = {
  name: "InputQuestion",
  paranoid: true,
  model: {
    order: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    label: {
      type: DataTypes.STRING(2048),
      allowNull: false,
    },
    formVersion: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    }
  }
}