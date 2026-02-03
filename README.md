<div align="center">

# 🚀 Apogee

### Action Items Management System

A modern, full-stack action items management system with reminders, email notifications, calendar invites, and offline-first architecture.

[![Node.js](https://img.shields.io/badge/Node.js-v16+-339933?style=flat&logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=flat&logo=react&logoColor=black)](https://reactjs.org/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=flat&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[Features](#-features) • [Tech Stack](#-tech-stack) • [Getting Started](#-getting-started) • [Documentation](#-documentation) • [License](#-license)

</div>

---


## 🎯 Overview

Apogee is a production-ready MVP for managing action items with advanced features including time-based reminders, email notifications, calendar invites, and offline-first architecture. Built with modern web technologies and designed for extensibility.

## ✨ Features

- **🔐 User Authentication** - Secure JWT-based authentication with registration and login
- **📝 Action Management** - Full CRUD operations for action items with rich metadata
- **🎯 Multiple Action Types** - Support for reminders, emails, calendar invites, and priority tasks
- **🔍 Smart Filtering** - Advanced search, filter by status/priority/type, and customizable sorting
- **⏰ Time-based Reminders** - Automated notifications via background cron jobs
- **📧 Email Integration** - Send scheduled emails using Nodemailer
- **📅 Calendar Invites** - Generate ICS files for seamless calendar integration
- **📴 Offline Support** - Work offline with automatic sync when reconnected
- **📚 API Documentation** - Interactive Swagger documentation for all endpoints
- **🎨 Minimal UI** - Clean, functional design optimized for productivity

## 📸 Screenshots

<div align="center">

*Dashboard with action items list and filtering*

*Create/Edit action form with type-specific fields*

</div>

> **Note**: Add screenshots after deployment to showcase the UI

## 📋 Tech Stack

### Backend
- **Runtime**: Node.js with Express
- **Database**: MySQL with Sequelize ORM
- **Authentication**: JWT (jsonwebtoken)
- **Background Jobs**: node-cron
- **Email**: Nodemailer
- **API Docs**: Swagger (swagger-ui-express)

### Frontend
- **Framework**: React with Vite
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Offline Storage**: LocalForage (IndexedDB)
- **Date Handling**: date-fns
- **Styling**: Vanilla CSS (minimal, functional design)

## 🏗️ Architecture

```
┌─────────────┐
│   React     │ ← User Interface (Offline-first)
│  Frontend   │
└──────┬──────┘
       │ HTTP/REST
       ↓
┌─────────────┐
│   Express   │ ← API Layer (Stateless)
│   Backend   │
└──────┬──────┘
       │
       ├─→ MySQL (Data persistence)
       ├─→ Cron Worker (Reminder processing)
       ├─→ Nodemailer (Email sending)
       └─→ ICS Generator (Calendar invites)
```

### Database Schema

**users**
- id, email, password_hash, created_at

**action_items**
- id, user_id, type, title, description, priority, status, due_at, created_at, updated_at

**action_metadata**
- id, action_id, key, value (extensible key-value storage)

**notifications**
- id, action_id, trigger_time, status, error_message

**sync_logs**
- id, user_id, last_synced_at

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **MySQL** (v8 or higher) - [Download](https://dev.mysql.com/downloads/)
- **npm** or **yarn** - Comes with Node.js

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/apogee.git
   cd apogee
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   ```

3. **Create MySQL Database**
   ```sql
   CREATE DATABASE apogee_db;
   ```

4. **Configure Environment**
   
   Copy `.env.example` to `.env` and update with your settings:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and set your MySQL password:
   ```env
   DB_PASSWORD=your_mysql_password
   ```

5. **Start Backend Server**
   ```bash
   npm run dev
   ```
   
   Server will run at `http://localhost:5000`  
   API docs available at `http://localhost:5000/api-docs`

6. **Setup Frontend** (in a new terminal)
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   
   App will run at `http://localhost:5173`

7. **Create Your First Account**
   
   Visit `http://localhost:5173` and click "Sign up"

### 🎬 Quick Demo

```bash
# Register a new user
curl -X POST http://localhost:5000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@example.com","password":"password123"}'

# Create an action (use token from login response)
curl -X POST http://localhost:5000/actions \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "reminder",
    "title": "My First Action",
    "priority": "high",
    "due_at": "2026-02-04T10:00:00Z"
  }'
```

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create MySQL database**
   ```sql
   CREATE DATABASE apogee_db;
   ```

4. **Configure environment variables**
   
   Copy `.env.example` to `.env` and update:
   ```bash
   cp .env.example .env
   ```

   Edit `.env`:
   ```env
   PORT=5000
   NODE_ENV=development

   # Database
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=apogee_db
   DB_USER=root
   DB_PASSWORD=your_mysql_password

   # JWT
   JWT_SECRET=your_super_secret_jwt_key_change_this
   JWT_EXPIRES_IN=7d

   # Email (Optional - for email-type actions)
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=your_email@gmail.com
   SMTP_PASSWORD=your_app_password
   EMAIL_FROM=noreply@apogee.com

   # Reminder Worker
   REMINDER_CHECK_INTERVAL=* * * * *
   ```

5. **Start the server**
   ```bash
   npm run dev
   ```

   The server will:
   - Connect to MySQL
   - Auto-create tables (in development mode)
   - Start the reminder worker
   - Listen on http://localhost:5000

6. **Access API Documentation**
   
   Visit http://localhost:5000/api-docs

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

   The app will be available at http://localhost:5173

## 📖 Usage

### Authentication

1. **Register**: Create a new account at `/register`
2. **Login**: Sign in at `/login`
3. **Token Storage**: JWT token is stored in localStorage

### Creating Actions

1. Click "New Action" button
2. Select action type (reminder/email/calendar/priority)
3. Fill in details:
   - **Title**: Required
   - **Description**: Optional
   - **Priority**: low/medium/high/urgent
   - **Status**: pending/in_progress/completed/cancelled
   - **Due Date**: Optional datetime
   - **Type-specific fields**:
     - Email: recipient address
     - Calendar: location

### Filtering & Sorting

Use the filter bar to:
- Search by title/description
- Filter by status, priority, or type
- Sort by created date, due date, priority, or title
- Change sort order (ascending/descending)

### Offline Mode

- Actions are cached locally using IndexedDB
- Create/update/delete actions while offline
- Changes are queued and synced automatically when back online
- Offline indicator appears in header

## 🔧 API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user

### Actions
- `POST /actions` - Create action (requires auth)
- `GET /actions` - Get all actions with filters (requires auth)
- `GET /actions/:id` - Get single action (requires auth)
- `PUT /actions/:id` - Update action (requires auth)
- `DELETE /actions/:id` - Delete action (requires auth)

### Query Parameters for GET /actions
- `status` - Filter by status
- `priority` - Filter by priority
- `type` - Filter by type
- `search` - Search in title/description
- `sortBy` - Sort field (default: created_at)
- `sortOrder` - ASC or DESC (default: DESC)

## 🎯 Design Decisions & Trade-offs

### 1. **Last-Write-Wins Conflict Resolution**
   - **Decision**: Simple timestamp-based conflict resolution
   - **Trade-off**: May overwrite concurrent changes
   - **Rationale**: Acceptable for MVP; can upgrade to CRDTs later
   - **Future**: Implement operational transformation or version vectors

### 2. **Metadata Table for Extensibility**
   - **Decision**: Key-value storage for type-specific fields
   - **Trade-off**: Slightly slower queries vs schema flexibility
   - **Rationale**: Allows adding new action types without migrations
   - **Future**: Consider JSONB columns or separate type tables

### 3. **Cron-based Reminder Worker**
   - **Decision**: Simple cron job checking every minute
   - **Trade-off**: Not real-time, but simple and reliable
   - **Rationale**: Good enough for MVP, easy to understand
   - **Future**: Use message queue (Bull, RabbitMQ) for scalability

### 4. **IndexedDB for Offline Storage**
   - **Decision**: LocalForage wrapper around IndexedDB
   - **Trade-off**: More complex than localStorage, but handles larger data
   - **Rationale**: Supports offline queue and action caching
   - **Future**: Add service workers for full PWA support

### 5. **Minimal UI Design**
   - **Decision**: Vanilla CSS with functional, neutral design
   - **Trade-off**: Less flashy, but professional and fast
   - **Rationale**: Looks like internal tool, focuses on usability
   - **Future**: Add dark mode, accessibility improvements

## 🚧 Future Improvements

### High Priority
- [ ] Mobile app (React Native)
- [ ] Real-time updates (WebSockets/Socket.io)
- [ ] Advanced conflict resolution
- [ ] Role-based access control
- [ ] Bulk operations

### Medium Priority
- [ ] Action templates
- [ ] Recurring actions
- [ ] File attachments
- [ ] Activity audit log
- [ ] Export/import data

### Low Priority
- [ ] Analytics dashboard
- [ ] Team collaboration
- [ ] Third-party integrations (Slack, Google Calendar)
- [ ] Natural language input
- [ ] Voice commands

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow existing code style and conventions
- Write meaningful commit messages
- Add comments for complex logic
- Update documentation as needed
- Test your changes thoroughly

## 🚀 Deployment

### Backend Deployment (Heroku/Railway/Render)

1. Set environment variables in your hosting platform
2. Ensure MySQL database is provisioned
3. Deploy backend with `npm start`

### Frontend Deployment (Vercel/Netlify)

1. Build the frontend: `npm run build`
2. Deploy the `dist` folder
3. Update API base URL in production

### Environment Variables for Production

```env
NODE_ENV=production
DB_HOST=your_production_db_host
DB_PASSWORD=your_secure_password
JWT_SECRET=your_production_jwt_secret
SMTP_HOST=your_smtp_host
SMTP_USER=your_smtp_user
SMTP_PASSWORD=your_smtp_password
```

## 🧪 Testing

### Manual Testing

1. **Authentication Flow**
   ```bash
   # Register
   curl -X POST http://localhost:5000/auth/register \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"password123"}'

   # Login
   curl -X POST http://localhost:5000/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"password123"}'
   ```

2. **Create Action**
   ```bash
   curl -X POST http://localhost:5000/actions \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{
       "type": "reminder",
       "title": "Test Action",
       "priority": "high",
       "due_at": "2026-02-04T10:00:00Z"
     }'
   ```

3. **Test Offline Sync**
   - Disconnect network
   - Create/edit actions in UI
   - Reconnect network
   - Verify sync completes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

Built with ❤️ as a demonstration of modern full-stack development practices.

## 🙏 Acknowledgments

- Built with [Express](https://expressjs.com/)
- Frontend powered by [React](https://reactjs.org/) and [Vite](https://vitejs.dev/)
- Database management with [Sequelize](https://sequelize.org/)
- Offline support via [LocalForage](https://localforage.github.io/localForage/)

---

<div align="center">

**[⬆ Back to Top](#-apogee)**

Made with modern web technologies • [Report Bug](https://github.com/yourusername/apogee/issues) • [Request Feature](https://github.com/yourusername/apogee/issues)

</div>
