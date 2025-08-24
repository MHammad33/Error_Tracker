# 🎯 Issue Tracker

A modern, full-stack issue tracking application built with Next.js 15, featuring real-time updates, advanced filtering, multiple view modes, and comprehensive user management.

![Next.js](https://img.shields.io/badge/Next.js-15.4.6-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Prisma](https://img.shields.io/badge/Prisma-6.13.0-2D3748)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-green)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC)
![React Query](https://img.shields.io/badge/React%20Query-5.85.2-FF4154)

## ✨ Features

### 🔐 Authentication & Authorization
- **Google OAuth Integration** via NextAuth.js
- **JWT-based Sessions** with automatic refresh
- **Role-based Access Control** with user assignment capabilities
- **Secure API Routes** with session validation

### 📊 Dashboard & Analytics
- **Real-time Issue Statistics** with visual charts
- **Interactive Charts** powered by Recharts
- **Latest Issues Overview** with assignee information
- **Responsive Grid Layout** for optimal viewing

### 🎫 Issue Management
- **Create, Read, Update, Delete** operations
- **Status Tracking** (Open, In Progress, Closed)
- **User Assignment** with avatar display
- **Rich Text Editor** using SimpleMDE with Markdown support
- **Advanced Search & Filtering** with real-time results
- **Bulk Operations** and batch processing

### 🎨 Multiple View Modes
- **📋 Table View** - Traditional spreadsheet-style layout
- **🔄 Kanban Board** - Drag-and-drop visual workflow
- **📱 Virtualized List** - High-performance rendering for large datasets

### ⚡ Performance Features
- **Virtual Scrolling** for handling thousands of issues
- **Infinite Loading** with React Query
- **Server-side Pagination** with client-side caching
- **Optimistic Updates** for instant UI feedback
- **Image Optimization** with Next.js Image component

### 🔍 Advanced Filtering & Search
- **Real-time Search** across title and description
- **Status-based Filtering** with quick filters
- **Sorting Options** by date, title, status, and assignee
- **URL State Management** for shareable filtered views
- **Debounced Search** to prevent API spam

### 📱 Responsive Design
- **Mobile-first Approach** with Tailwind CSS
- **Adaptive Layouts** for all screen sizes
- **Touch-friendly Interactions** on mobile devices
- **Progressive Web App** capabilities

### 🛠 Developer Experience
- **TypeScript** for type safety
- **ESLint & Prettier** for code quality
- **Prisma ORM** with type-safe database queries
- **Zod Validation** for runtime type checking
- **Error Monitoring** with Sentry integration
- **Hot Reload** development with Turbopack

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18.0 or later
- **npm** or **yarn** package manager
- **MongoDB** database (local or cloud)
- **Google OAuth** credentials for authentication

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd issue-tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Setup**
   
   Create a `.env.local` file in the root directory:
   ```env
   # Database
   DATABASE_URL="mongodb+srv://username:password@cluster.mongodb.net/issue-tracker"
   
   # NextAuth.js
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-nextauth-secret-here"
   
   # Google OAuth
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   
   # Sentry (Optional)
   SENTRY_DSN="your-sentry-dsn"
   ```

4. **Database Setup**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Push database schema
   npx prisma db push
   
   # Seed the database with sample data
   npm run seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
issue-tracker/
├── prisma/                    # Database schema and migrations
│   ├── schema.prisma         # Prisma schema definition
│   └── seed.js              # Database seeding script
├── public/                   # Static assets
├── src/
│   ├── app/                 # Next.js app directory
│   │   ├── api/            # API routes
│   │   │   ├── auth/       # Authentication endpoints
│   │   │   ├── issues/     # Issue CRUD operations
│   │   │   └── users/      # User management
│   │   ├── auth/           # Authentication configuration
│   │   ├── issues/         # Issue management pages
│   │   │   ├── list/       # Issue listing with filters
│   │   │   ├── new/        # Create new issue
│   │   │   └── [id]/       # Individual issue pages
│   │   ├── providers/      # React context providers
│   │   └── layout.tsx      # Root layout component
│   ├── components/         # Reusable UI components
│   │   ├── KanbanBoard.tsx     # Kanban view component
│   │   ├── EnhancedIssuesView.tsx # Multi-view container
│   │   ├── VirtualizedIssuesList.tsx # Performance-optimized list
│   │   ├── SearchInput.tsx     # Search functionality
│   │   ├── StatusBadge.tsx     # Status indicators
│   │   └── ...
│   ├── hooks/              # Custom React hooks
│   │   ├── useInfiniteIssues.ts # Infinite loading logic
│   │   └── useIssueActions.ts   # Issue operations
│   ├── lib/                # Utility libraries
│   │   ├── prisma.ts       # Database client
│   │   └── validationSchema.ts # Zod schemas
│   └── services/           # API service layer
│       └── apiService.ts   # HTTP client configuration
├── .env.local              # Environment variables
├── next.config.ts          # Next.js configuration
├── tailwind.config.ts      # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
└── package.json           # Project dependencies
```

## 🔧 Configuration

### Database Configuration

The application uses **Prisma** as the ORM with **MongoDB** as the database. The schema includes:

- **Users** - Authentication and profile management
- **Issues** - Core issue tracking entity
- **Accounts/Sessions** - NextAuth.js authentication tables

### Authentication Setup

1. **Google OAuth Setup**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`

2. **NextAuth Secret**:
   ```bash
   # Generate a secure secret
   openssl rand -base64 32
   ```

### Sentry Integration (Optional)

For error monitoring and performance tracking:

1. Create account at [Sentry.io](https://sentry.io)
2. Create new project for Next.js
3. Copy DSN to environment variables
4. Sentry is pre-configured in `next.config.ts`

## 🎯 API Documentation

### Issue Endpoints

#### `GET /api/issues`
Retrieve issues with filtering and pagination

**Query Parameters:**
- `page` - Page number (default: 1)
- `pageSize` - Items per page (default: 10)
- `status` - Filter by status (OPEN, IN_PROGRESS, CLOSED)
- `search` - Search in title and description
- `orderBy` - Sort field (createdAt, title, status)
- `orderDirection` - Sort direction (asc, desc)

**Response:**
```json
{
  "issues": [...],
  "totalCount": 150,
  "page": 1,
  "pageSize": 10,
  "totalPages": 15
}
```

#### `POST /api/issues`
Create a new issue

**Body:**
```json
{
  "title": "Issue title",
  "description": "Detailed description in Markdown"
}
```

#### `GET /api/issues/[id]`
Retrieve specific issue with assignee information

#### `PATCH /api/issues/[id]`
Update issue details

**Body:**
```json
{
  "title": "Updated title",
  "description": "Updated description",
  "assignedUserId": "user-id-or-null"
}
```

#### `DELETE /api/issues/[id]`
Delete an issue (requires authentication)

### User Endpoints

#### `GET /api/users`
Retrieve all users for assignment dropdown

## 🎨 Customization

### Styling

The application uses **Tailwind CSS** with **Radix UI** components:

- **Colors**: Modify `tailwind.config.ts` for custom color scheme
- **Typography**: Geist Sans and Geist Mono fonts are pre-configured
- **Components**: Radix UI provides accessible, unstyled components
- **Theme**: Light theme with violet accent color

### Adding New Status Types

1. Update `prisma/schema.prisma`:
   ```prisma
   enum Status {
     OPEN
     IN_PROGRESS
     CLOSED
     BLOCKED      // Add new status
   }
   ```

2. Update `src/constants/statuses.ts` with new status configuration

3. Run database migration:
   ```bash
   npx prisma db push
   ```

## 🧪 Development

### Available Scripts

```bash
# Development server with Turbopack
npm run dev

# Production build
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Seed database with sample data
npm run seed

# Database operations
npx prisma studio          # Database GUI
npx prisma db push         # Push schema changes
npx prisma generate        # Generate client
```

### Code Quality

- **ESLint**: Configured with Next.js recommended rules
- **TypeScript**: Strict mode enabled for type safety
- **Prettier**: Auto-formatting on save (configure in your editor)
- **Husky**: Git hooks for pre-commit checks (optional)

### Performance Monitoring

- **React Query DevTools**: Available in development
- **Next.js Bundle Analyzer**: Run `ANALYZE=true npm run build`
- **Sentry Performance**: Automatic performance monitoring
- **Chrome DevTools**: Built-in performance profiling

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect Repository**:
   - Import project to [Vercel](https://vercel.com)
   - Connect your Git repository

2. **Environment Variables**:
   - Add all environment variables from `.env.local`
   - Update `NEXTAUTH_URL` to your production domain

3. **Deploy**:
   - Automatic deployments on Git push
   - Preview deployments for pull requests

### Alternative Platforms

The application can be deployed to any platform supporting Node.js:
- **Netlify**
- **Railway**
- **Digital Ocean App Platform**
- **AWS Amplify**
- **Heroku**

### Docker Deployment

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### Development Setup

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run tests and linting: `npm run lint`
5. Commit changes: `git commit -m 'Add amazing feature'`
6. Push to branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

### Code Standards

- **TypeScript**: Use proper typing, avoid `any`
- **Components**: Use functional components with hooks
- **Styling**: Use Tailwind CSS classes
- **API**: Follow REST conventions
- **Database**: Use Prisma for all database operations

### Commit Messages

Follow [Conventional Commits](https://conventionalcommits.org/):
```
feat: add new issue filter by assignee
fix: resolve pagination bug on mobile
docs: update API documentation
style: improve button hover states
```

## 🐛 Troubleshooting

### Common Issues

**1. Database Connection Failed**
```bash
# Check MongoDB connection string
# Ensure database is running
# Verify network access (whitelist IP for cloud MongoDB)
```

**2. Google OAuth Not Working**
```bash
# Verify GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET
# Check authorized redirect URIs in Google Cloud Console
# Ensure NEXTAUTH_URL matches your domain
```

**3. Prisma Client Errors**
```bash
# Regenerate Prisma client
npx prisma generate

# Reset database (caution: loses data)
npx prisma db push --force-reset
```

**4. Build Errors**
```bash
# Clear Next.js cache
rm -rf .next

# Clear node_modules
rm -rf node_modules package-lock.json
npm install
```

### Getting Help

- **Issues**: Create an issue on GitHub
- **Discussions**: Use GitHub Discussions for questions
- **Documentation**: Check Next.js and Prisma docs
- **Community**: Join relevant Discord servers

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team** - Amazing React framework
- **Vercel** - Hosting and deployment platform
- **Prisma Team** - Excellent database toolkit
- **Radix UI** - Accessible component primitives
- **Tailwind CSS** - Utility-first CSS framework
- **React Query** - Powerful data synchronization

## 📊 Project Stats

- **Lines of Code**: ~15,000
- **Components**: 25+
- **API Endpoints**: 8
- **Database Tables**: 5
- **Third-party Integrations**: 3

---

Built with ❤️ using modern web technologies. Star ⭐ this repo if you find it helpful!