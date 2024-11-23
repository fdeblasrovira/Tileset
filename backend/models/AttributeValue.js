const { DataTypes } = require('sequelize');

exports.model = {
  name: "AttributeValue",
  paranoid: true,
  model: {
    // Model attributes are defined here
    attributeId:{
      type: DataTypes.STRING,
      allowNull: false,
    },
    value: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }
}