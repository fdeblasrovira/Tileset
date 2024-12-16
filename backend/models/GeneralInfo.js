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
        },
        questionsPerPage: {
            type: DataTypes.TINYINT.UNSIGNED,
            defaultValue: 1,
            allowNull: false,
            validate: {
                hasCorrectRange(value) {
                    if (parseInt(value) < 1 || parseInt(value) > 10) {
                        throw new Error('Wrong questions per page setting value');
                    }
                }
            },
        },
    }
}