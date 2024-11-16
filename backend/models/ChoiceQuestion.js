const { DataTypes } = require('sequelize');

exports.model = {
  name: "ChoiceQuestion",
  paranoid: true,
  model: {
    order: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    label: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  }
}