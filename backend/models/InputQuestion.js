const { DataTypes } = require('sequelize');

exports.model = {
  name: "InputQuestion",
  paranoid: true,
  model: {
    type: {
      type: DataTypes.STRING(32),
      allowNull: false,
    },
    order: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    label: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    formVersion: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    }
  }
}