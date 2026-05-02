
  # Insta-CRM: Intelligent Instagram Customer Relationship Management Platform

> A comprehensive, production-grade CRM platform designed to streamline Instagram account management, automate customer interactions, and provide actionable insights through integrated analytics and engagement tools.

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [Development Workflow](#development-workflow)
- [API Overview](#api-overview)
- [Core Services](#core-services)
- [Configuration](#configuration)
- [Deployment](#deployment)
- [Contributing](#contributing)

---

## 🎯 Overview

**Insta-CRM** is an enterprise-level Customer Relationship Management platform built specifically for Instagram business accounts. It enables businesses to:

- **Manage Multiple Instagram Accounts**: Seamlessly handle multiple Instagram business profiles from a single dashboard
- **Automate Customer Interactions**: Create intelligent automation workflows to respond to comments and direct messages automatically
- **Track Leads & Engagement**: Centralize all customer interactions including DMs, comments, and lead information
- **Analytics & Performance Insights**: Monitor post performance and engagement metrics in real-time
- **Secure OAuth Integration**: Industry-standard OAuth 2.0 integration with both Instagram and Google services

The platform is built with a modern, scalable architecture designed to handle enterprise-scale operations with high reliability and performance standards.

---

## ✨ Key Features

### 🔐 Authentication & Authorization
- **Multi-Account Management**: Support for multiple Instagram and Google account integrations per user
- **Secure OAuth 2.0 Integration**: Industry-standard authentication flows for Instagram and Google
- **Session Management**: Persistent, secure session handling with automatic token refresh
- **Role-Based Access Control**: Owner and workspace-level permission management

### 📱 Instagram Integration
- **Comment Management**: Monitor, view, and respond to comments on Instagram posts
- **Direct Message Inbox**: Unified inbox for managing direct messages across all connected accounts
- **Real-time Notifications**: Webhook-based real-time updates for new comments and messages
- **Account Registry**: Centralized registry of connected Instagram accounts and associated metadata

### 🤖 Automation Engine
- **Smart Workflows**: Define conditional automation rules for comments and DMs
- **Customizable Responses**: Create templated responses triggered by specific keywords or conditions
- **Campaign Management**: Launch targeted campaigns with performance tracking
- **Audit Logging**: Complete audit trail of all automation executions

### 📊 Analytics & Reporting
- **Post Performance Metrics**: Track engagement, reach, and impressions for published content
- **Lead Tracking**: Comprehensive lead management and conversion funnel analysis
- **Workspace Analytics**: Aggregate insights across multiple Instagram accounts
- **Real-time Dashboards**: Live dashboard updates for key performance indicators

### 💼 Team Collaboration
- **Workspace Management**: Organize team members and accounts into logical workspaces
- **User Management**: Invite and manage team members with granular permission controls
- **Activity History**: Track all user actions and system events for compliance and auditing

---

## 🛠 Tech Stack

### Frontend Architecture
| Layer | Technologies |
|-------|--------------|
| **UI Framework** | React 18.3 with React DOM |
| **Build Tool** | Vite 5.x (Lightning-fast build tool) |
| **Styling** | TailwindCSS + CSS Modules |
| **Component Library** | Radix UI (Unstyled, accessible components) |
| **Forms** | React Hook Form + Zod validation |
| **State Management** | React Context API + Hooks |
| **Charting** | Recharts for data visualization |
| **Motion Graphics** | Framer Motion for animations |
| **UI Utilities** | Lucide React icons, clsx for conditional styles |

### Backend Architecture
| Layer | Technologies |
|-------|--------------|
| **Runtime** | Node.js with Express.js 5.x |
| **Database** | MongoDB 9.4 with Mongoose ODM |
| **Authentication** | OAuth 2.0 (Instagram, Google), JWT-based sessions |
| **HTTP Server** | Express with CORS support |
| **Webhook Processing** | Real-time Instagram webhook handlers |
| **API Pattern** | RESTful API with dynamic routing |

### Infrastructure & Deployment
| Component | Technology |
|-----------|-----------|
| **Hosting** | Vercel (Frontend), Custom Node.js backend |
| **Configuration** | Environment variables via `.env` |
| **Development** | Hot module reloading (HMR) via Vite |

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (React + Vite)                  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Pages: Dashboard, Automations, Inbox, Analytics    │   │
│  │ Components: Modals, Forms, Cards, Layouts          │   │
│  │ Services: API Adapters, Session Management         │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                   HTTP/REST API Calls
                            │
┌─────────────────────────────────────────────────────────────┐
│              BACKEND (Express.js + MongoDB)                 │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ API Routes: /api/auth, /api/automations, /api/dms  │   │
│  │ Services: Instagram Auth, DM Processing, Webhooks  │   │
│  │ Models: Owner, IOwner, Automation, ApiCall         │   │
│  │ Database: MongoDB Collections                      │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                   Instagram Meta API
                   Google OAuth API
```

### Request Flow Example: Sending a DM Reply
```
User Action (React) 
    → sendInstagramReply() API call 
    → Backend Route Handler 
    → instagramMessagingService 
    → Instagram Meta API 
    → Response back to UI 
    → State Update & UI Refresh
```

---

## 📁 Project Structure

```
insta-crm/
├── frontend/
│   ├── src/
│   │   ├── App.jsx                    # Main app component with routing
│   │   ├── main.jsx                   # React entry point
│   │   ├── index.css & styles/        # Global styling
│   │   │
│   │   ├── pages/                     # Page components
│   │   │   ├── Accounts.jsx           # Account management
│   │   │   ├── InstagramCallback.jsx  # OAuth callback handler
│   │   │   ├── GoogleCallback.jsx     # Google OAuth handler
│   │   │   ├── Terms.jsx & Privacy.jsx
│   │   │   └── DeleteData.jsx
│   │   │
│   │   ├── components/                # Reusable UI components
│   │   │   ├── DashboardSidebar.jsx   # Main navigation
│   │   │   ├── DmInbox.jsx            # Direct message interface
│   │   │   ├── CommentsInbox.jsx      # Comment management
│   │   │   ├── Automations.jsx        # Automation builder
│   │   │   ├── LeadCenter.jsx         # Lead management
│   │   │   ├── PostPerformance.jsx    # Analytics dashboard
│   │   │   ├── AuthModal.jsx          # Authentication UI
│   │   │   ├── CreateAutomationModal.jsx
│   │   │   ├── ui/                    # Base UI components (Button, Card, etc.)
│   │   │   └── figma/                 # Figma design components
│   │   │
│   │   ├── api/                       # API client layer
│   │   │   ├── auth/                  # Authentication endpoints
│   │   │   ├── automations/           # Automation CRUD operations
│   │   │   ├── campaigns/             # Campaign management
│   │   │   ├── instagram/             # Instagram-specific APIs
│   │   │   ├── dmLogs/                # Direct message history
│   │   │   ├── owner/                 # User/owner management
│   │   │   └── core/                  # Shared API utilities
│   │   │
│   │   ├── services/                  # Business logic layer
│   │   │   ├── authSessionService.js  # Session management
│   │   │   ├── dashboardWorkspaceService.js
│   │   │   ├── demoSessionService.js  # Demo mode handling
│   │   │   └── signupCredentialBridge.js
│   │   │
│   │   ├── adapters/                  # Data transformation layer
│   │   │   ├── automationAdapter.js   # Transform automation data
│   │   │   ├── dmLogAdapter.js        # Transform DM data
│   │   │   ├── commentAdapter.js      # Transform comment data
│   │   │   └── inboxAdapter.js
│   │   │
│   │   ├── lib/                       # Utility functions
│   │   │   ├── authValidation.js      # Auth validation logic
│   │   │   ├── instagramAuthConfig.js # Instagram OAuth config
│   │   │   ├── googleAuthConfig.js    # Google OAuth config
│   │   │   └── instagramAccountCache.js
│   │   │
│   │   └── guidelines/                # Developer guidelines
│   │
│   ├── public/                        # Static assets
│   ├── index.html                     # HTML entry point
│   ├── package.json                   # Frontend dependencies
│   └── vite.config.js                 # Vite configuration
│
├── backend/
│   ├── app.js                         # Express app initialization
│   ├── server.js (implied)            # Server startup (if exists)
│   ├── config.js                      # Environment configuration
│   ├── db.js                          # Database connection
│   ├── router.js                      # Route initialization
│   │
│   ├── models/                        # MongoDB schemas
│   │   ├── Owner.js                   # User account model
│   │   ├── IOwner.js                  # Instagram account model
│   │   ├── GOwner.js                  # Google account model
│   │   ├── Automation.js              # Automation rules
│   │   ├── ApiCall.js                 # API request logs
│   │   └── DmLog.js                   # DM history
│   │
│   ├── services/                      # Business logic & external integrations
│   │   ├── instagramAuthService.js    # Instagram OAuth flow
│   │   ├── instagramMessagingService.js # Send DMs & replies
│   │   ├── instagramDataService.js    # Fetch Instagram data
│   │   ├── instagramWebhookService.js # Process webhooks
│   │   ├── automationService.js       # Automation execution engine
│   │   ├── googleAuthService.js       # Google OAuth flow
│   │   ├── accountRegistryService.js  # Account management
│   │   ├── sessionService.js          # Session handling
│   │   ├── passwordService.js         # Password hashing/verification
│   │   └── workspaceDataService.js    # Workspace data aggregation
│   │
│   └── api/                           # API route handlers
│       ├── [...route].js              # Catch-all for API routes
│       ├── auth/                      # Authentication endpoints
│       ├── accounts/                  # Account management
│       ├── instagram/                 # Instagram operations
│       ├── owner/                     # Owner endpoints
│       └── session/                   # Session endpoints
│
├── scripts/                           # Utility scripts
│   ├── workflow-smoke.mjs             # Workflow testing
│   └── deep-saas-smoke.mjs
│
├── .env.example                       # Environment variable template
├── package.json                       # Project metadata & scripts
├── vite.config.js                     # Frontend build configuration
├── vercel.json                        # Vercel deployment config
├── README.md                          # This file
└── BUG_AUDIT_REPORT.md               # Known issues & fixes
```

---

## 🚀 Installation & Setup

### Prerequisites
- **Node.js** 18.x or higher
- **npm** 9.x or higher (or yarn/pnpm)
- **MongoDB** instance (local or Atlas)
- **Instagram Business Account** with Meta app registered
- **Google OAuth credentials** (optional, for Google login)

### Step 1: Clone & Install Dependencies
```bash
# Navigate to project directory
cd insta-crm

# Install all dependencies
npm i

# Or using yarn
yarn install
```

### Step 2: Configure Environment Variables
Create a `.env` file in the root directory with the following variables:

```env
# Database
MONGODB_URI=mongodb://your_mongodb_connection_string

# Instagram OAuth
INSTAGRAM_CLIENT_ID=your_instagram_app_id
INSTAGRAM_CLIENT_SECRET=your_instagram_app_secret
INSTAGRAM_REDIRECT_URI=http://localhost:5173/auth/instagram/callback

# Instagram Webhooks
INSTAGRAM_WEBHOOK_VERIFY_TOKEN=your_webhook_verify_token
INSTAGRAM_WEBHOOK_SECRET=your_webhook_secret

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:5173/auth/google/callback

# Frontend
VITE_API_BASE_URL=http://localhost:3001
VITE_APP_URL=http://localhost:5173

# Session & Security
SESSION_SECRET=your_secure_random_string
JWT_SECRET=your_jwt_secret

# Environment
NODE_ENV=development
FRONTEND_ORIGINS=http://localhost:5173
```

### Step 3: Start Development Server
```bash
# Start both frontend and backend (if configured)
npm run dev

# Or start individually:
npm run dev:frontend   # Runs React app on port 5173
npm run dev:backend    # Runs Express server on port 3001
```

The application will be available at `http://localhost:5173`

---

## 💻 Development Workflow

### Available Scripts

```bash
# Development
npm run dev              # Start development server with HMR

# Production Build
npm run build            # Build frontend for production
npm run preview          # Preview production build locally

# Linting & Formatting
npm run lint             # Run ESLint
npm run format           # Format code with Prettier

# Testing
npm run test             # Run test suite
npm run test:watch      # Run tests in watch mode
```

### Development Best Practices

1. **Component Structure**: Place reusable components in `src/components/ui/` and feature-specific components in their respective feature directories
2. **API Calls**: Use the adapter pattern in `src/api/` for all external API calls
3. **State Management**: Leverage React Context API with custom hooks for global state
4. **Form Handling**: Use `react-hook-form` with Zod validation for all forms
5. **Styling**: Combine TailwindCSS utilities with component-level CSS modules for scoped styles
6. **Error Handling**: Implement try-catch blocks with user-friendly error messaging
7. **Code Comments**: Add JSDoc comments for complex business logic functions

### Hot Module Reloading (HMR)
The development server uses Vite's HMR for instant updates. Simply save your changes and the browser will refresh automatically without losing state.

---

## 🔌 API Overview

### Authentication Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `POST` | `/api/auth/login` | User login with email/password |
| `POST` | `/api/auth/signup` | Create new user account |
| `POST` | `/api/auth/logout` | End user session |
| `GET` | `/api/auth/instagram/authorize` | Initiate Instagram OAuth flow |
| `GET` | `/api/auth/instagram/callback` | Handle Instagram OAuth callback |
| `GET` | `/api/auth/google/authorize` | Initiate Google OAuth flow |
| `GET` | `/api/auth/google/callback` | Handle Google OAuth callback |
| `GET` | `/api/auth/session` | Get current session info |

### Instagram Operations

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/instagram/comments` | Fetch comments on posts |
| `GET` | `/api/instagram/inbox` | Fetch direct messages |
| `POST` | `/api/instagram/reply` | Send reply to comment |
| `POST` | `/api/instagram/message` | Send direct message |
| `GET` | `/api/instagram/accounts` | List connected accounts |

### Automations

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `POST` | `/api/automations/create` | Create automation workflow |
| `PUT` | `/api/automations/:id` | Update automation |
| `DELETE` | `/api/automations/:id` | Delete automation |
| `GET` | `/api/automations/list` | List all automations |
| `POST` | `/api/automations/:id/execute` | Manually trigger automation |

### Analytics

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/owner/performance` | Get post performance metrics |
| `GET` | `/api/owner/analytics` | Get workspace analytics |
| `GET` | `/api/campaigns/metrics` | Get campaign performance |

---

## 🔧 Core Services

### Frontend Services

#### `authSessionService.js`
Manages user authentication state, session persistence, and account switching.
- `startInstagramLogin()`: Initiate Instagram OAuth flow
- `finishInstagramLogin()`: Complete OAuth and load workspace
- `selectWorkspaceAccount()`: Switch between Instagram accounts
- `logoutSession()`: Clear session and redirect to login

#### `dashboardWorkspaceService.js`
Handles workspace data loading and caching for performance.
- `loadAuthenticatedWorkspace()`: Fetch workspace data from backend
- `readCachedWorkspace()`: Read from local cache
- `writeCachedWorkspace()`: Update local cache
- `finishInstagramLogin()`: Initialize workspace after auth

#### `demoSessionService.js`
Provides demo mode functionality for unauthenticated users.
- `ensureDemoPreviewSession()`: Setup demo session with mock data

### Backend Services

#### `instagramAuthService.js`
Handles OAuth 2.0 authentication with Instagram's Meta API.
- **Flow**: Authorization Code → Short-lived Token → Long-lived Token
- **Token Refresh**: Implements automatic long-lived token generation
- **Error Handling**: Comprehensive error codes for auth failures

#### `instagramMessagingService.js`
Manages direct messages and comment replies.
- Send DMs to users
- Post replies to comments
- Handle threading and conversation context
- Rate limiting and error recovery

#### `instagramWebhookService.js`
Processes real-time webhook events from Instagram.
- **Events**: Comment creation, message received, account status
- **Verification**: Validates webhook signatures from Meta
- **Processing**: Updates database and triggers automations

#### `automationService.js`
Core automation execution engine.
- Pattern matching for keywords and conditions
- Template-based response generation
- Execution logging and audit trails
- Rate limiting and throttling

#### `sessionService.js`
Manages user sessions and authentication tokens.
- Session creation and validation
- JWT token generation and verification
- Automatic token refresh
- Session expiration handling

---

## ⚙️ Configuration

### Environment Variables

**Database Configuration**
```env
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/insta_crm
```

**OAuth Credentials**
Obtain from:
- [Meta Developer Dashboard](https://developers.facebook.com/) for Instagram
- [Google Cloud Console](https://console.cloud.google.com/) for Google

**Security**
```env
SESSION_SECRET=<32+ character random string>
JWT_SECRET=<32+ character random string>
```

### Config Files

#### `backend/config.js`
Centralized configuration management with validation:
- Reads from environment variables
- Validates required config at startup
- Provides defaults for optional values
- Environment-specific settings (dev, staging, prod)

#### `vite.config.js`
Vite build configuration with module aliasing for dependency resolution and optimized builds.

---

## 🌐 Deployment

### Frontend Deployment (Vercel)

1. **Push to GitHub**: Ensure code is committed and pushed
2. **Connect to Vercel**: 
   - Visit [vercel.com](https://vercel.com)
   - Import project from GitHub
3. **Set Environment Variables**: Configure `VITE_*` variables in Vercel dashboard
4. **Deploy**: Vercel automatically deploys on push to main branch

### Backend Deployment

**Option 1: Heroku**
```bash
# Initialize Heroku app
heroku create your-app-name
heroku addons:create mongolab:sandbox

# Deploy
git push heroku main
```

**Option 2: Custom VPS**
```bash
# Build for production
npm run build

# Start production server
NODE_ENV=production npm start
```

---

## 🤝 Contributing

### Code Standards

1. **Naming Conventions**
   - Components: PascalCase (e.g., `DmInbox.jsx`)
   - Functions/Variables: camelCase (e.g., `sendInstagramReply()`)
   - Constants: UPPER_SNAKE_CASE (e.g., `API_BASE_URL`)

2. **File Organization**
   - One component per file
   - Group related utilities in same directory
   - Use index.js for barrel exports

3. **Comments & Documentation**
   - Add JSDoc for complex functions
   - Comment business logic, not obvious code
   - Keep README.md updated with changes

4. **Testing**
   - Write tests for new features
   - Maintain >70% code coverage
   - Test edge cases and error scenarios

### Git Workflow

```bash
# Create feature branch
git checkout -b feat/your-feature-name

# Make changes and commit with clear messages
git commit -m "feat: add new automation trigger types"

# Push and create pull request
git push origin feat/your-feature-name
```

### Pull Request Guidelines
- Clear, descriptive title
- Detailed description of changes
- Screenshots for UI changes
- Link to related issues
- Request review from maintainers

---

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [Vite Guide](https://vitejs.dev)
- [Express.js Documentation](https://expressjs.com)
- [MongoDB/Mongoose Docs](https://mongoose.js.com)
- [Meta Graph API](https://developers.facebook.com/docs/graph-api)
- [Radix UI Components](https://www.radix-ui.com)

---

## 📄 License

This project is proprietary and confidential. Unauthorized copying or distribution is prohibited.

---

## ✉️ Support & Contact

For questions, bug reports, or feature requests:
- Create an issue in the repository
- Contact the development team
- Check existing documentation in `/guidelines` folder

---

**Version**: 0.1.0  
**Last Updated**: May 2026  
**Status**: Active Development
