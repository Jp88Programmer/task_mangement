# Task Management System - Backend

This is the backend API for the Task Management System, built with Node.js, Express, and MongoDB.

## Features

- User authentication with JWT
- Role-based access control (Admin, Manager, Member)
- Project management
- Task management with drag-and-drop support
- Activity logging
- Email notifications for due tasks

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory and configure the environment variables (use `.env.example` as a reference)
4. Start the development server:
   ```bash
   npm run dev
   ```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB
MONGO_URI=mongodb://localhost:27017/taskmanager

# JWT
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30

# Frontend URL (for CORS)
CLIENT_URL=http://localhost:3000

To seed the database with an admin user and sample data:

```bash
node utils/seed.js
```

To clear all data:

```bash
node utils/seed.js -d
```

## API Documentation

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/logout` - Logout user

### Projects

- `GET /api/projects` - Get all projects for the current user
- `POST /api/projects` - Create a new project (Admin only)
- `GET /api/projects/:id` - Get project by ID
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `POST /api/projects/:id/members` - Add member to project
- `DELETE /api/projects/:id/members/:userId` - Remove member from project

### Tasks

- `GET /api/tasks/project/:projectId` - Get all tasks for a project
- `POST /api/tasks` - Create a new task
- `GET /api/tasks/:id` - Get task by ID
- `PATCH /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `PATCH /api/tasks/:id/status` - Update task status
- `PATCH /api/tasks/:id/assign` - Assign task to user
- `POST /api/tasks/:id/comments` - Add comment to task
- `GET /api/tasks/:id/activity` - Get task activity log

### Users

- `GET /api/users` - Get all users (Admin only)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user (Admin only)
- `DELETE /api/users/:id` - Delete user (Admin only)

## Error Handling

All error responses follow this format:

```json
{
  "success": false,
  "message": "Error message",
  "error": "Error details (in development)"
}
```

## Authentication

Most routes require authentication via JWT token. Include the token in the `Authorization` header:

```
Authorization: Bearer <token>
```

## Rate Limiting

- 100 requests per 15 minutes for public endpoints
- 1000 requests per 15 minutes for authenticated endpoints

## Testing

To run tests:

```bash
npm test
```

## Linting

To check code style:

```bash
npm run lint
```

## Deployment

1. Set `NODE_ENV=production` in your environment variables
2. Install production dependencies:
   ```bash
   npm install --production
   ```
3. Start the server:
   ```bash
   npm start
   ```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Built with Node.js, Express, and MongoDB
- Uses JWT for authentication
- Inspired by modern task management systems like Trello and Asana
- `DELETE /api/tasks/:id` - Delete task
- `GET /api/tasks/:id/logs` - Get activity logs for a task

## Development

- `npm run server` - Start the development server with nodemon
- `npm run client` - Start the frontend development server
- `npm run dev` - Run both frontend and backend concurrently

## Production

1. Build the frontend:
   ```bash
   cd ../client
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

## License

MIT
