# Real-Time Chat Application

A modern, real-time chat application built with Next.js, TypeScript, Prisma, and WebSocket.

## Features

- 🔐 Secure Authentication
  - JWT-based authentication
  - Email verification
  - Password security with bcrypt

- 💬 Real-Time Messaging
  - Instant message delivery
  - Message read status
  - Typing indicators
  - Support for text, images, files, audio, and video messages

- 👥 Chat Management
  - Private one-on-one chats
  - Group chat support
  - Member management
  - Last seen and online status

- 🎨 Modern UI
  - Responsive design
  - Message bubbles with distinct sender/receiver styling
  - User avatars
  - Message timestamps
  - Loading states and error handling

## Tech Stack

- **Frontend**
  - Next.js 13+ (App Router)
  - TypeScript
  - TailwindCSS
  - Socket.IO Client

- **Backend**
  - Next.js API Routes
  - Prisma ORM
  - PostgreSQL
  - Socket.IO Server

- **Authentication**
  - JWT (jose)
  - Email verification
  - Secure password hashing

## Getting Started

### Prerequisites

- Node.js 16+
- PostgreSQL
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd codechat
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env
   ```
   Fill in your environment variables:
   ```env
   DATABASE_URL="postgresql://user:password@localhost:5432/codechat"
   JWT_SECRET="your-jwt-secret"
   SMTP_HOST="your-smtp-host"
   SMTP_PORT="587"
   SMTP_USER="your-smtp-user"
   SMTP_PASS="your-smtp-password"
   ```

4. Set up the database:
   ```bash
   npx prisma migrate dev
   ```

5. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. Start the WebSocket server:
   ```bash
   cd chat-server
   npm install
   npm run dev
   ```

The application should now be running at `http://localhost:3000`

## Project Structure

```
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── api/            # API Routes
│   │   ├── chat/          # Chat pages
│   │   ├── login/         # Login page
│   │   └── signup/        # Signup page
│   ├── hooks/             # Custom React hooks
│   └── lib/               # Shared utilities
├── chat-server/           # WebSocket server
├── prisma/               # Database schema and migrations
└── public/              # Static assets
```

## API Routes

- `POST /api/signup` - Create new user account
- `POST /api/login` - User authentication
- `GET /api/chat` - Get user's chat list
- `GET /api/chat/[id]` - Get specific chat details
- `POST /api/chat` - Create new chat
- `WebSocket` - Real-time message handling

## Database Schema

- User
- Chat
- ChatMember
- Message
- EmailVerification

## Security Features

- JWT-based authentication
- Secure password hashing
- Input validation
- Rate limiting
- WebSocket connection validation
- SQL injection prevention (Prisma)
- XSS protection

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Next.js team for the amazing framework
- Prisma team for the excellent ORM
- Socket.IO team for real-time capabilities
