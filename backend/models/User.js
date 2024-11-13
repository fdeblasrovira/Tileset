const { DataTypes } = require('sequelize');

exports.model = {
  name: "User",
  model: {
    // Model attributes are defined here
    fullName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {msg: "Must be a valid email address"}
      }
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastConnectionAt: {
      type: DataTypes.DATE,
      validate: {
        isDate: true
      }
    }
  }
}