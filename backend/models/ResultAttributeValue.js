const { DataTypes } = require('sequelize');

exports.model = {
  name: "ResultAttributeValue",
  model: {
    // Model attributes are defined here
    attributeID:{
      type: DataTypes.STRING,
      allowNull: false,
    },
    value: {
      type: DataTypes.INTEGER,
      allowNull: false,
    }
  }
}