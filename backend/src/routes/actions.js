const express = require('express');
const authMiddleware = require('../middleware/auth');
const {
    createAction,
    getActions,
    getActionById,
    updateAction,
    deleteAction
} = require('../controllers/actionController');

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

/**
 * @swagger
 * /actions:
 *   post:
 *     summary: Create a new action item
 *     tags: [Actions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *             properties:
 *               type:
 *                 type: string
 *                 enum: [reminder, email, calendar, priority]
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high, urgent]
 *               status:
 *                 type: string
 *                 enum: [pending, in_progress, completed, cancelled]
 *               due_at:
 *                 type: string
 *                 format: date-time
 *               metadata:
 *                 type: object
 *     responses:
 *       201:
 *         description: Action created successfully
 *       401:
 *         description: Unauthorized
 */
router.post('/', createAction);

/**
 * @swagger
 * /actions:
 *   get:
 *     summary: Get all action items
 *     tags: [Actions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           default: created_at
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [ASC, DESC]
 *           default: DESC
 *     responses:
 *       200:
 *         description: List of actions
 *       401:
 *         description: Unauthorized
 */
router.get('/', getActions);

/**
 * @swagger
 * /actions/{id}:
 *   get:
 *     summary: Get a single action item
 *     tags: [Actions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Action details
 *       404:
 *         description: Action not found
 */
router.get('/:id', getActionById);

/**
 * @swagger
 * /actions/{id}:
 *   put:
 *     summary: Update an action item
 *     tags: [Actions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Action updated successfully
 *       404:
 *         description: Action not found
 */
router.put('/:id', updateAction);

/**
 * @swagger
 * /actions/{id}:
 *   delete:
 *     summary: Delete an action item
 *     tags: [Actions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Action deleted successfully
 *       404:
 *         description: Action not found
 */
router.delete('/:id', deleteAction);

module.exports = router;
