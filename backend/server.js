require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./src/config/database');
const { startReminderWorker } = require('./src/workers/reminderWorker');
const errorHandler = require('./src/middleware/errorHandler');
const { specs, swaggerUi } = require('./swagger/swagger');

// Import routes
const authRoutes = require('./src/routes/auth');
const actionRoutes = require('./src/routes/actions');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/', (req, res) => {
    res.json({
        message: 'Apogee Action Items API',
        version: '1.0.0',
        status: 'running'
    });
});

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Routes
app.use('/auth', authRoutes);
app.use('/actions', actionRoutes);

// Error handling
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Start server
const startServer = async () => {
    try {
        // Connect to database
        await connectDB();

        // Start reminder worker
        startReminderWorker();

        // Start Express server
        app.listen(PORT, () => {
            console.log(`\n🚀 Server running on http://localhost:${PORT}`);
            console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs\n`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
