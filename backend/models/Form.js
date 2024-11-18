const { DataTypes } = require('sequelize');

exports.model = {
  name: "Form",
  paranoid: true,
  model: {
    // Model attributes are defined here
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(2048),
    },
    imageUrl: {
      type: DataTypes.STRING(512),
      defaultValue: "urltoTILESETlogo",
    },
    visibility: {
      type: DataTypes.BOOLEAN,
    },
    version: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    }
  }
}