# Tech Polls

A full-stack application for creating and participating in technology-related polls.

## Features

- Poll List Page (all polls with vote button)
- Poll Detail Page (question, voting options, results, comments)
- Add Poll Page (form with validation)
- Vote tracking using localStorage
- Comment system

## Tech Stack

- **Frontend**: React with Material UI
- **Backend**: Node.js with Express
- **Database**: MongoDB

## Getting Started

### Prerequisites

- Node.js (v14+)
- MongoDB (running locally or connection string)

### Setup and Installation

#### Backend

```bash
cd backend
npm install
# Configure your .env file as needed
npm run dev
```

#### Frontend

```bash
cd frontend
npm install
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login a user
- `GET /api/auth/me` - Get current user

### Polls
- `GET /api/polls` - Get all polls
- `GET /api/polls/:id` - Get a specific poll
- `POST /api/polls` - Create a new poll
- `POST /api/polls/:id/vote` - Vote on a poll

### Comments
- `GET /api/comments/:pollId` - Get comments for a poll
- `POST /api/comments` - Add a comment to a poll
