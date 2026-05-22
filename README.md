# DevPulse API

A modern issue tracking and management API built with Express.js and PostgreSQL. DevPulse enables teams to collaborate efficiently by managing bugs and feature requests with role-based access control.

## Live URL

🚀 **API Base URL:** [https://devpulse-api-blush.vercel.app](https://devpulse-api-blush.vercel.app)

## Features

- User signup and login
- JWT authentication
- Role-based access (Contributor & Maintainer)
- Create, update, view, and delete issues
- Track bug reports and feature requests
- Secure password hashing with bcrypt
- CORS support
- Global error handling

## Tech Stack

### Backend
- Node.js
- TypeScript
- Express.js
- PostgreSQL
- JWT Authentication
- bcrypt
- CORS

### Development Tools
- tsup
- tsx
- npm

## Setup Steps

### Requirements
- Node.js (v16 or higher)
- PostgreSQL database
- Git

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/mariyamnavila/devpulse
   cd dev-pulse
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create .env file:**

   ```env
   PORT=5000
   DATABASE_URL=postgresql://user:password@localhost:5432/devpulse
   NODE_ENV=development
   JWT_SECRET=your-secret-key-here
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Build project:**
   ```bash
   npm run build
   ```

6. **Start the production server:**
   ```bash
   npm start
   ```

## API Endpoints

### Authentication 
| Method | Route   | Description  |
| ------ | ------ | ------------ |
| POST | /api/auth/signup | Register new user |
| POST | /api/auth/login  | Login user |


### Issue
| Method | Route | Description |
| ------ | ------| ---------- |
| POST | /api/issues | Create issue     |
| GET | /api/issues | Get all issues   |
| GET | /api/issues/:id | Get single issue |
| PATCH | /api/issues/:id | Update issue     |
| DELETE | /api/issues/:id | Delete issue     |



## Database Schema

### Users Table
```sql
users (
  id              SERIAL PRIMARY KEY,
  name            VARCHAR(255) NOT NULL,
  email           VARCHAR(255) NOT NULL UNIQUE,
  password        TEXT NOT NULL,
  role            VARCHAR(20) NOT NULL DEFAULT 'contributor',
  created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMP NOT NULL DEFAULT NOW()
)
```
**Available Roles:** 
- contributor
- maintainer

### Issues Table
```sql
issues (
  id              SERIAL PRIMARY KEY,
  title           VARCHAR(150) NOT NULL,
  description     TEXT NOT NULL,
  type            VARCHAR(20) NOT NULL,
  status          VARCHAR(20) NOT NULL DEFAULT 'open',
  reporter_id     INT REFERENCES users(id) ON DELETE CASCADE,
  created_at      TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMP NOT NULL DEFAULT NOW()
)
```
**Issue Types**
- bug
- feature_request

**Issue Status**
- open
- in_progress
- resolved



