const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ActionMetadata = sequelize.define('ActionMetadata', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    action_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'action_items',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    key: {
        type: DataTypes.STRING,
        allowNull: false
    },
    value: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: 'action_metadata',
    timestamps: false,
    indexes: [
        { fields: ['action_id'] },
        { fields: ['key'] }
    ]
});

module.exports = ActionMetadata;
