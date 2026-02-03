const cron = require('node-cron');
const { Notification, ActionItem, ActionMetadata, User } = require('../models');
const { Op } = require('sequelize');
const emailService = require('../services/emailService');
const calendarService = require('../services/calendarService');

/**
 * Process due notifications
 * Runs every minute to check for notifications that need to be triggered
 */
const processNotifications = async () => {
    try {
        const now = new Date();

        // Find all pending notifications that are due
        const dueNotifications = await Notification.findAll({
            where: {
                status: 'pending',
                trigger_time: {
                    [Op.lte]: now
                }
            },
            include: [
                {
                    model: ActionItem,
                    as: 'action',
                    include: [
                        {
                            model: ActionMetadata,
                            as: 'metadata'
                        },
                        {
                            model: User,
                            as: 'user',
                            attributes: ['email']
                        }
                    ]
                }
            ]
        });

        console.log(`🔔 Processing ${dueNotifications.length} due notifications...`);

        for (const notification of dueNotifications) {
            try {
                const action = notification.action;

                if (!action) {
                    console.warn(`⚠️  Notification ${notification.id} has no associated action`);
                    await notification.update({ status: 'failed', error_message: 'Action not found' });
                    continue;
                }

                // Convert metadata to object
                const metadataObj = {};
                if (action.metadata) {
                    action.metadata.forEach(m => {
                        metadataObj[m.key] = m.value;
                    });
                }

                // Process based on action type
                switch (action.type) {
                    case 'email':
                        await emailService.sendActionEmail(action, metadataObj);
                        console.log(`✅ Email sent for action ${action.id}`);
                        break;

                    case 'calendar':
                        // For calendar invites, we could send via email with ICS attachment
                        const icsContent = calendarService.generateActionCalendarInvite(action, metadataObj);
                        console.log(`✅ Calendar invite generated for action ${action.id}`);
                        // In a real implementation, you'd send this as an email attachment
                        break;

                    case 'reminder':
                    case 'priority':
                    default:
                        // Send reminder email to user
                        if (action.user && action.user.email) {
                            await emailService.sendReminderEmail(action.user.email, action);
                            console.log(`✅ Reminder sent for action ${action.id}`);
                        }
                        break;
                }

                // Mark notification as sent
                await notification.update({ status: 'sent' });
            } catch (error) {
                console.error(`❌ Failed to process notification ${notification.id}:`, error.message);
                await notification.update({
                    status: 'failed',
                    error_message: error.message
                });
            }
        }
    } catch (error) {
        console.error('❌ Error in notification worker:', error);
    }
};

/**
 * Start the reminder worker
 */
const startReminderWorker = () => {
    const cronExpression = process.env.REMINDER_CHECK_INTERVAL || '* * * * *'; // Every minute by default

    console.log(`🚀 Starting reminder worker with schedule: ${cronExpression}`);

    cron.schedule(cronExpression, processNotifications);
};

module.exports = { startReminderWorker, processNotifications };
