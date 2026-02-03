const actionService = require('../services/actionService');
const { ActionItem, ActionMetadata } = require('../models');
const { Op } = require('sequelize');

/**
 * @route POST /actions
 * @desc Create a new action item
 */
const createAction = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const actionData = req.body;

        const action = await actionService.createAction(userId, actionData);

        res.status(201).json({
            message: 'Action created successfully',
            action
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @route GET /actions
 * @desc Get all action items for the authenticated user with filtering and sorting
 */
const getActions = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { status, priority, type, search, sortBy = 'created_at', sortOrder = 'DESC' } = req.query;

        // Build where clause
        const where = { user_id: userId };

        if (status) where.status = status;
        if (priority) where.priority = priority;
        if (type) where.type = type;
        if (search) {
            where[Op.or] = [
                { title: { [Op.like]: `%${search}%` } },
                { description: { [Op.like]: `%${search}%` } }
            ];
        }

        // Get actions with metadata
        const actions = await ActionItem.findAll({
            where,
            include: [
                {
                    model: ActionMetadata,
                    as: 'metadata',
                    attributes: ['key', 'value']
                }
            ],
            order: [[sortBy, sortOrder.toUpperCase()]]
        });

        // Transform metadata to object format
        const transformedActions = actions.map(action => {
            const actionObj = action.toJSON();
            const metadataObj = {};

            if (actionObj.metadata) {
                actionObj.metadata.forEach(m => {
                    metadataObj[m.key] = m.value;
                });
            }

            actionObj.metadata = metadataObj;
            return actionObj;
        });

        res.json({
            count: transformedActions.length,
            actions: transformedActions
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @route GET /actions/:id
 * @desc Get a single action item
 */
const getActionById = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const actionId = req.params.id;

        const action = await ActionItem.findOne({
            where: { id: actionId, user_id: userId },
            include: [
                {
                    model: ActionMetadata,
                    as: 'metadata',
                    attributes: ['key', 'value']
                }
            ]
        });

        if (!action) {
            return res.status(404).json({ error: 'Action not found' });
        }

        // Transform metadata
        const actionObj = action.toJSON();
        const metadataObj = {};

        if (actionObj.metadata) {
            actionObj.metadata.forEach(m => {
                metadataObj[m.key] = m.value;
            });
        }

        actionObj.metadata = metadataObj;

        res.json({ action: actionObj });
    } catch (error) {
        next(error);
    }
};

/**
 * @route PUT /actions/:id
 * @desc Update an action item
 */
const updateAction = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const actionId = req.params.id;
        const updateData = req.body;

        const action = await actionService.updateAction(userId, actionId, updateData);

        res.json({
            message: 'Action updated successfully',
            action
        });
    } catch (error) {
        next(error);
    }
};

/**
 * @route DELETE /actions/:id
 * @desc Delete an action item
 */
const deleteAction = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const actionId = req.params.id;

        await actionService.deleteAction(userId, actionId);

        res.json({ message: 'Action deleted successfully' });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createAction,
    getActions,
    getActionById,
    updateAction,
    deleteAction
};
