const { DataTypes } = require('sequelize');

exports.model = {
  name: "BlacklistToken",
  paranoid: false,
  model: {
    // Model attributes are defined here
    token: {
      type: DataTypes.STRING(512),
      primaryKey: true,
      allowNull: false,
    },
    expirationDate: {
      type: DataTypes.DATE,
      validate: {
        isDate: true
      }
    }
  }
}