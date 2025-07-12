# Replit.md

## Overview

This is a full-stack web application built with React and Express that creates personal profile pages with weekly interactive questions. The application features a 3-phase onboarding system that allows users to create their own profiles, and includes a dynamic profile display system. Users can view profiles, answer questions about profile owners, and submit their responses. It features a modern UI built with shadcn/ui components and uses in-memory storage for data persistence.

## Recent Changes

- **Supabase Integration (July 12, 2025)**: Added Supabase client for database, storage, and authentication
  - Created server-side Supabase client configuration (`server/supabase.ts`)
  - Created client-side Supabase client configuration (`client/src/lib/supabase.ts`)
  - Successfully tested connection to 'E3 world onboarding' table
  - Environment variables configured for both server and client environments
- **E Number Field Added to Onboarding (July 12, 2025)**: Added E number field to Phase 1 onboarding
  - Added "E Number" input field as the first field in the Identity section of Phase 1
  - Updated database schema to include eNumber field in profiles table
  - E number is now required for profile creation and stored in the database
  - E number input automatically converts to uppercase for consistency
- **E Number Authentication Removal (July 12, 2025)**: Removed NFT serial code authentication system
  - Removed "Enter your E number" input field from landing page
  - Simplified onboarding flow to allow direct profile creation without E number validation
  - Modified profile creation to auto-generate unique serial codes based on user data and timestamp
  - Maintained dynamic profile pages accessible via auto-generated serial code URLs
  - Landing page now shows a simple "Create Profile" button after 9-second delay
- **Bio Word Limit Refinement**: Updated bio word limit from 30 to 15 words in Phase 3 onboarding for optimal display in profile containers
- **Bio Text Containment**: Implemented comprehensive CSS utilities to ensure bio text stays within container boundaries with proper word wrapping and truncation
- **Profile Display Optimization**: Refined container max-width and line-height for better 20-word bio presentation

## User Preferences

Preferred communication style: Simple, everyday language.

## Brand Identity

Brand colors:
- Primary: #e7e6e3 (Eggshell white)
- Secondary: #292929 (Grey-black)

Design principles:
- Mobile-first approach
- Clean dividers for section headings
- Minimalist aesthetic
- Consistent spacing and typography

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
- **Schema**: Defined in `shared/schema.ts` with four main tables:
  - `questions`: Stores weekly questions with multiple choice options
  - `submissions`: Stores user answers with email and selected responses
  - `profiles`: Stores user profiles with NFT serial code association
  - `users`: Basic user authentication structure (currently unused)
- **Migrations**: Managed through Drizzle Kit with PostgreSQL dialect

### Profile Management System
- **Auto-Generated Serial Codes**: Unique codes generated from user data and timestamp
- **Open Access**: Landing page allows direct profile creation without authentication
- **Profile Association**: Each profile is linked to a unique auto-generated serial code and dynamic URL
- **Dynamic Profile Pages**: Profiles accessible via `/profile/:serialCode` routes

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