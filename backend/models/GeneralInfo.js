const { DataTypes } = require('sequelize');

exports.model = {
    name: "GeneralInfo",
    paranoid: true,
    model: {
        formName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING(2048),
            allowNull: false,
        },
        imageUrl: {
            type: DataTypes.STRING(512),
        }
    }
}