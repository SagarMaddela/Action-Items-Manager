const { ActionItem, ActionMetadata, Notification } = require('../models');
const { sequelize } = require('../config/database');

/**
 * Create a new action item with metadata and notifications
 */
const createAction = async (userId, actionData) => {
    const transaction = await sequelize.transaction();

    try {
        const { type, title, description, priority, status, due_at, metadata } = actionData;

        // Validate required fields
        if (!title) {
            throw new Error('Title is required');
        }

        // Create action item
        const action = await ActionItem.create({
            user_id: userId,
            type: type || 'reminder',
            title,
            description,
            priority: priority || 'medium',
            status: status || 'pending',
            due_at: due_at || null
        }, { transaction });

        // Create metadata if provided
        if (metadata && typeof metadata === 'object') {
            const metadataEntries = Object.entries(metadata).map(([key, value]) => ({
                action_id: action.id,
                key,
                value: typeof value === 'string' ? value : JSON.stringify(value)
            }));

            if (metadataEntries.length > 0) {
                await ActionMetadata.bulkCreate(metadataEntries, { transaction });
            }
        }

        // Create notification if due_at is set
        if (due_at) {
            await Notification.create({
                action_id: action.id,
                trigger_time: due_at,
                status: 'pending'
            }, { transaction });
        }

        await transaction.commit();

        // Fetch complete action with metadata
        return await getActionWithMetadata(action.id);
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

/**
 * Update an existing action item
 */
const updateAction = async (userId, actionId, updateData) => {
    const transaction = await sequelize.transaction();

    try {
        // Find action
        const action = await ActionItem.findOne({
            where: { id: actionId, user_id: userId }
        });

        if (!action) {
            throw new Error('Action not found');
        }

        const { type, title, description, priority, status, due_at, metadata } = updateData;

        // Update action fields
        const updates = {};
        if (type !== undefined) updates.type = type;
        if (title !== undefined) updates.title = title;
        if (description !== undefined) updates.description = description;
        if (priority !== undefined) updates.priority = priority;
        if (status !== undefined) updates.status = status;
        if (due_at !== undefined) updates.due_at = due_at;

        await action.update(updates, { transaction });

        // Update metadata if provided
        if (metadata && typeof metadata === 'object') {
            // Delete existing metadata
            await ActionMetadata.destroy({
                where: { action_id: actionId },
                transaction
            });

            // Create new metadata
            const metadataEntries = Object.entries(metadata).map(([key, value]) => ({
                action_id: actionId,
                key,
                value: typeof value === 'string' ? value : JSON.stringify(value)
            }));

            if (metadataEntries.length > 0) {
                await ActionMetadata.bulkCreate(metadataEntries, { transaction });
            }
        }

        // Update notification if due_at changed
        if (due_at !== undefined) {
            // Delete existing pending notifications
            await Notification.destroy({
                where: { action_id: actionId, status: 'pending' },
                transaction
            });

            // Create new notification if due_at is set
            if (due_at) {
                await Notification.create({
                    action_id: actionId,
                    trigger_time: due_at,
                    status: 'pending'
                }, { transaction });
            }
        }

        await transaction.commit();

        return await getActionWithMetadata(actionId);
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};

/**
 * Delete an action item
 */
const deleteAction = async (userId, actionId) => {
    const action = await ActionItem.findOne({
        where: { id: actionId, user_id: userId }
    });

    if (!action) {
        throw new Error('Action not found');
    }

    // Cascade delete will handle metadata and notifications
    await action.destroy();
};

/**
 * Helper: Get action with metadata in object format
 */
const getActionWithMetadata = async (actionId) => {
    const action = await ActionItem.findByPk(actionId, {
        include: [
            {
                model: ActionMetadata,
                as: 'metadata',
                attributes: ['key', 'value']
            }
        ]
    });

    if (!action) return null;

    const actionObj = action.toJSON();
    const metadataObj = {};

    if (actionObj.metadata) {
        actionObj.metadata.forEach(m => {
            metadataObj[m.key] = m.value;
        });
    }

    actionObj.metadata = metadataObj;
    return actionObj;
};

module.exports = {
    createAction,
    updateAction,
    deleteAction
};
