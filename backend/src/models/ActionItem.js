const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const ActionItem = sequelize.define('ActionItem', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        },
        onDelete: 'CASCADE'
    },
    type: {
        type: DataTypes.ENUM('reminder', 'email', 'calendar', 'priority'),
        allowNull: false,
        defaultValue: 'reminder'
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    priority: {
        type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
        defaultValue: 'medium'
    },
    status: {
        type: DataTypes.ENUM('pending', 'in_progress', 'completed', 'cancelled'),
        defaultValue: 'pending'
    },
    due_at: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    tableName: 'action_items',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
        { fields: ['user_id'] },
        { fields: ['status'] },
        { fields: ['due_at'] },
        { fields: ['priority'] }
    ]
});

module.exports = ActionItem;
