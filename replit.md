# Replit.md

## Overview

This is a full-stack web application built with React and Express that creates personal profile pages with weekly interactive questions. The application features a 3-phase onboarding system that allows users to create their own profiles, and includes a dynamic profile display system. Users can view profiles, answer questions about profile owners, and submit their responses. It features a modern UI built with shadcn/ui components and uses in-memory storage for data persistence.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Framework**: shadcn/ui components based on Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **State Management**: TanStack React Query for server state management
- **Routing**: Wouter for lightweight client-side routing

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Runtime**: Node.js with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **API Style**: RESTful JSON APIs
- **Development**: Hot reload with tsx for TypeScript execution

## Key Components

### Database Layer
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema**: Defined in `shared/schema.ts` with three main tables:
  - `questions`: Stores weekly questions with multiple choice options
  - `submissions`: Stores user answers with email and selected responses
  - `users`: Basic user authentication structure (currently unused)
- **Migrations**: Managed through Drizzle Kit with PostgreSQL dialect

### API Layer
- **Routes**: Defined in `server/routes.ts`
  - `GET /api/questions/current`: Fetch the active weekly question
  - `POST /api/submissions`: Submit an answer to a question
  - `GET /api/questions`: Get all questions (admin functionality)
- **Storage**: Abstracted storage interface with in-memory fallback implementation
- **Validation**: Zod schemas for request/response validation

### Frontend Components
- **Profile Page**: Main application page showing user profile and question form
- **UI Components**: Complete shadcn/ui component library for consistent design
- **Form Handling**: React Hook Form with Zod validation
- **API Integration**: Custom query client with TanStack React Query

## Data Flow

1. **Question Display**: Frontend fetches current active question from `/api/questions/current`
2. **User Interaction**: User fills out email and selects answer from multiple choice options
3. **Submission**: Form data is validated and sent to `/api/submissions` endpoint
4. **Persistence**: Backend validates submission and stores in PostgreSQL database
5. **Feedback**: User receives success/error feedback via toast notifications

## External Dependencies

### Core Dependencies
- **Database**: `@neondatabase/serverless` for PostgreSQL connection
- **ORM**: `drizzle-orm` and `drizzle-zod` for database operations
- **UI**: Complete Radix UI component suite (`@radix-ui/*`)
- **Validation**: `zod` for schema validation
- **HTTP Client**: `@tanstack/react-query` for API state management

### Development Dependencies
- **Build**: `vite`, `esbuild` for production builds
- **TypeScript**: Full TypeScript support across frontend and backend
- **CSS**: `tailwindcss`, `autoprefixer` for styling
- **Development**: `tsx` for TypeScript execution, Replit integration plugins

## Deployment Strategy

### Build Process
- **Frontend**: Vite builds React app to `dist/public`
- **Backend**: esbuild bundles Express server to `dist/index.js`
- **Database**: Drizzle migrations in `migrations/` folder

### Environment Setup
- **Database**: Requires `DATABASE_URL` environment variable for PostgreSQL connection
- **Development**: `NODE_ENV=development` enables hot reload and development features
- **Production**: `NODE_ENV=production` serves built static files

### Scripts
- `npm run dev`: Development server with hot reload
- `npm run build`: Production build for both frontend and backend
- `npm run start`: Production server
- `npm run db:push`: Push database schema changes

The application is designed to be deployed on platforms like Replit, Vercel, or similar, with PostgreSQL database hosted on Neon or similar serverless database providers.