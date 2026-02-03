const User = require('./User');
const ActionItem = require('./ActionItem');
const ActionMetadata = require('./ActionMetadata');
const Notification = require('./Notification');
const SyncLog = require('./SyncLog');

// Define associations
User.hasMany(ActionItem, { foreignKey: 'user_id', as: 'actions' });
ActionItem.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

ActionItem.hasMany(ActionMetadata, { foreignKey: 'action_id', as: 'metadata' });
ActionMetadata.belongsTo(ActionItem, { foreignKey: 'action_id', as: 'action' });

ActionItem.hasMany(Notification, { foreignKey: 'action_id', as: 'notifications' });
Notification.belongsTo(ActionItem, { foreignKey: 'action_id', as: 'action' });

User.hasOne(SyncLog, { foreignKey: 'user_id', as: 'syncLog' });
SyncLog.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

module.exports = {
    User,
    ActionItem,
    ActionMetadata,
    Notification,
    SyncLog
};
