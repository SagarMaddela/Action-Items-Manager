const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Notification = sequelize.define('Notification', {
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
    trigger_time: {
        type: DataTypes.DATE,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('pending', 'sent', 'failed'),
        defaultValue: 'pending'
    },
    error_message: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: 'notifications',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
        { fields: ['action_id'] },
        { fields: ['trigger_time'] },
        { fields: ['status'] }
    ]
});

module.exports = Notification;
