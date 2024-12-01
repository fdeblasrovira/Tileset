const { DataTypes } = require('sequelize');

exports.model = {
  name: "FormChoiceQuestion",
  paranoid: true,
  model: {
    version: {
      type: DataTypes.INTEGER.UNSIGNED,
      defaultValue: 1,
      allowNull: false,
    }
  }
}