# Typing Speed Test

A dynamic and interactive web-based typing speed tester that provides comprehensive performance tracking and user engagement.

## Features

- Real-time typing speed measurement
- 40-second typing test duration
- Multiple text themes (code, stories, quotes)
- User authentication system
- Performance tracking with WPM and accuracy
- Global leaderboard
- Anti-cheat copy-paste prevention
- Responsive design

## Tech Stack

- React.js frontend
- Node.js backend
- TypeScript
- PostgreSQL database
- Express.js
- Drizzle ORM
- TanStack Query
- Shadcn UI components

## Getting Started

1. Clone the repository
2. Install dependencies:
```bash
npm install
```
3. Set up environment variables:
```
DATABASE_URL=your_postgresql_database_url
SESSION_SECRET=your_session_secret
```
4. Start the development server:
```bash
npm run dev
```

## Database Setup

The application uses PostgreSQL with Drizzle ORM. To set up the database:

```bash
npm run db:push
```

## Contributing

Feel free to submit issues and enhancement requests.

## License

This project is MIT licensed.
