const { DataTypes } = require('sequelize');

exports.model = {
  name: "Attribute",
  model: {
    // Model attributes are defined here
    leftLabel: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    rightLabel: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    minValue: {
      type: DataTypes.INTEGER,
    },
    maxValue: {
      type: DataTypes.INTEGER,
      validate: {
        isGreaterThanMinValue(value) {
          if (parseInt(value) < parseInt(this.minValue)) {
            throw new Error('Max Value is smaller than min value');
          }
        }
      }
    },
    defaultValue: {
      type: DataTypes.INTEGER,
      validate: {
        isBetweenMinAndMax(value) {
          if (parseInt(value) < parseInt(this.minValue) || parseInt(value) > parseInt(this.maxValue)) {
            throw new Error('Default value must be between min and max value');
          }
        }
      }
    },
    leftColor: {
      type: DataTypes.STRING(8),
      allowNull: false,
    },
    rightColor: {
      type: DataTypes.STRING(8),
      allowNull: false,
    },
    order: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
  }
}