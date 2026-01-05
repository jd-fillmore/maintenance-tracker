# MaintenanceTracker

A comprehensive maintenance tracking system designed to streamline equipment service management with real-time monitoring, detailed service records, and user-friendly analytics.


https://github.com/user-attachments/assets/6af7f266-f2a7-411a-b131-965c9349594f


## 🚀 Tech Stack

### Frontend
- **React 19** - Modern React with latest features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **TailwindCSS** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client with interceptors
- **React Icons** - Comprehensive icon library

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **TypeScript** - Type-safe server development
- **PostgreSQL** - Robust relational database
- **Prisma** - Modern database ORM
- **Better Auth** - Secure authentication system
- **CORS** - Cross-origin resource sharing

### Development & Testing
- **Jest** - Testing framework
- **ESLint** - Code linting
- **TSX** - TypeScript execution
- **Supertest** - API testing

## ✨ Key Features

- **🔐 Secure Authentication** - Email-based auth with session management
- **📊 Real-time Dashboard** - Overview of service metrics and statistics
- **🔧 Service Record Management** - Complete CRUD operations for maintenance records
- **📱 Responsive Design** - Mobile-friendly interface with dark theme
- **⚡ Fast Performance** - Optimized data fetching and smooth animations
- **🛡️ Protected Routes** - Authentication-gated access to sensitive data
- **📈 Analytics** - Track total service hours, last service dates, and equipment statistics

## 🏗️ Architecture Overview

### Database Schema
```prisma
User {
  id: UUID (Primary Key)
  email: String (Unique)
  name: String
  emailVerified: Boolean
  serviceRecords: ServiceRecord[]
}

ServiceRecord {
  id: UUID (Primary Key)
  date: DateTime
  serviceType: String
  serviceTime: Float
  equipmentId: String
  equipmentType: String
  technician: String
  partsUsed: String?
  serviceNotes: String
  userId: UUID (Foreign Key)
}
```

## 🚦 Application Flow

### Frontend Flow
1. **Entry Point** - User lands on login page (`/`)
2. **Authentication** - Login via email/password using Better Auth
3. **Protected Routes** - Authenticated users access dashboard and service records
4. **Navigation** - Sidebar navigation between Dashboard and Service Records
5. **Data Fetching** - Axios interceptors handle API calls with automatic credentials
6. **State Management** - React hooks manage local component state
7. **UI Updates** - Framer Motion provides smooth transitions between views

### Backend Flow
1. **Server Initialization** - Express server starts on port 3000
2. **Middleware Setup** - CORS, JSON parsing, and request logging
3. **Auth Routes** - Better Auth handles `/api/auth/*` endpoints
4. **Protected Routes** - `requireAuth` middleware validates sessions
5. **Database Operations** - Prisma ORM handles all database interactions
6. **Response Handling** - JSON responses with proper error handling

## 🛠️ API Endpoints

### Authentication
- `POST /api/auth/sign-up/email` - Create new user account
- `POST /api/auth/sign-in/email` - User login
- `POST /api/auth/sign-out` - User logout
- `GET /api/auth/get-session` - Get current session

### Service Records
- `GET /api/service-records` - Get all user's service records
- `GET /api/service-records/:id` - Get specific service record
- `POST /api/service-records` - Create new service record
- `PUT /api/service-records/:id` - Update existing service record
- `DELETE /api/service-records/:id` - Delete service record

## 🎯 Core Components

### Frontend Components
- **`ProtectedRoute`** - Authentication wrapper for protected pages
- **`ProtectedLayout`** - Main layout with sidebar and top bar
- **`Sidebar`** - Navigation menu with user info
- **`TopBar`** - Header with logout functionality
- **`Dashboard`** - Overview cards and service statistics
- **`ServiceRecords`** - Full CRUD interface for maintenance records

### Backend Components
- **`auth.ts`** - Better Auth configuration
- **`serviceRecord.controller.ts`** - Business logic for service records
- **`serviceRecord.routes.ts`** - Route definitions and middleware
- **`requireAuth.ts`** - Authentication middleware
- **`Prisma Client`** - Database connection and queries

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL database
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd maintenance-tracker
```

2. **Install dependencies**
```bash
# Root dependencies
npm install

# Client dependencies
cd client
npm install

# Server dependencies
cd ../server
npm install
```

3. **Environment Setup**
```bash
# In server directory
cp .env.example .env
# Configure DATABASE_URL and other environment variables
```

4. **Database Setup**
```bash
# In server directory
npx prisma migrate dev
npx prisma generate
```

5. **Start Development Servers**
```bash
# Terminal 1 - Backend (server directory)
npm run dev

# Terminal 2 - Frontend (client directory)
npm run dev
```

6. **Access Application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

## 🧪 Testing

```bash
# Backend tests (server directory)
npm test

# Test with coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

## 📊 Features in Detail

### Dashboard Analytics
- **Total Records** - Count of all service records
- **Total Service Hours** - Sum of all service time
- **Last Service Date** - Most recent maintenance activity
- **Equipment Overview** - Statistics by equipment type

### Service Record Management
- **Create** - Add new maintenance records with detailed information
- **Read** - View all records with sorting and filtering options
- **Update** - Edit existing records with real-time validation
- **Delete** - Remove records with confirmation prompts

### Authentication Security
- **Session-based auth** - Secure cookie-based sessions
- **CSRF protection** - Built-in security measures
- **Route protection** - Server-side authentication checks
- **Automatic logout** - Session expiration handling

## 🎨 UI/UX Highlights

- **Dark Theme** - Easy on the eyes professional interface
- **Responsive Design** - Works seamlessly on desktop and mobile
- **Smooth Animations** - Framer Motion enhances user experience
- **Loading States** - Proper feedback during data operations
- **Error Handling** - User-friendly error messages and recovery

## 📝 Development Notes

- **Type Safety** - Full TypeScript coverage across frontend and backend
- **Code Quality** - ESLint configuration for consistent code style
- **Performance** - Optimized database queries and efficient React rendering
- **Scalability** - Modular architecture supports future feature additions

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

---

**Built with ❤️ for efficient maintenance management**
