# Peer-to-Peer Video Conferencing Application

## Overview

This is a peer-to-peer video conferencing application optimized for slow networks. The application enables direct video calls between two users using WebRTC technology, with features including audio/video controls, screen sharing, and connection quality monitoring. The system emphasizes simplicity and efficiency with an "invisible interface until needed" design philosophy, where video streams take center stage and controls fade until user interaction.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- **React 18** with TypeScript for the UI layer
- **Vite** as the build tool and development server
- **Wouter** for lightweight client-side routing
- **TanStack Query (React Query)** for server state management
- **shadcn/ui** component library built on Radix UI primitives
- **Tailwind CSS** with custom design tokens for styling

**Design System:**
- Uses Inter font family from Google Fonts for optimal readability
- Custom Tailwind configuration with extended color palettes and border radii
- Implements a "New York" style variant of shadcn/ui components
- CSS variables for theming with light/dark mode support
- Spacing system based on Tailwind units (2, 4, 6, 8)

**State Management:**
- Custom hooks for media stream management (`useMediaStream`)
- Custom hooks for WebRTC peer connections (`useWebRTC`)
- React Query for API data fetching and caching
- Local React state for UI interactions

**Key UI Components:**
- **RoomLobby**: Entry point for creating or joining video rooms
- **VideoCall**: Main call interface with video streams and controls
- **VideoPlayer**: Renders individual video streams with fallback states
- **ControlBar**: Fixed bottom bar with mute, video toggle, screen share, and end call controls
- **ConnectionStatus**: Real-time connection quality indicator
- **RoomCodeDisplay**: Displays and allows copying of room codes

### Backend Architecture

**Technology Stack:**
- **Express.js** server with TypeScript
- **Socket.IO** for real-time WebSocket communication
- **HTTP server** for serving static assets and API endpoints

**Server Responsibilities:**
- Acts as a signaling server for WebRTC peer discovery and connection establishment
- Manages room state and participant tracking
- Routes signaling messages (offers, answers, ICE candidates) between peers
- Serves the built frontend application in production

**Real-time Communication:**
- Socket.IO events for room creation, joining, and WebRTC signaling
- Maintains a Map of active rooms with participant sets
- Broadcasts peer connection information to room participants

**Development Setup:**
- Vite dev server integration for HMR (Hot Module Replacement)
- Custom middleware for request logging
- Error overlay plugin for runtime error display

### WebRTC Architecture

**Peer-to-Peer Strategy:**
- Uses **simple-peer** library as WebRTC wrapper
- Direct peer-to-peer connections for video/audio streams (no TURN server required for local/LAN connections)
- Server only facilitates initial connection handshake through signaling

**Network Optimization:**
- Video constraints optimized for slow networks:
  - 640x360 resolution (ideal)
  - 24 fps frame rate (max 24)
- Audio optimizations:
  - Echo cancellation enabled
  - Noise suppression enabled
  - Auto gain control enabled

**Connection Flow:**
1. User creates or joins a room via Socket.IO
2. Room creator initializes as WebRTC initiator
3. Room joiner connects as non-initiator
4. Signaling messages (offer/answer/ICE candidates) exchanged via Socket.IO
5. Direct peer connection established for media streams
6. Connection quality monitored throughout session

### Data Storage

**Current Implementation:**
- **In-memory storage** (`MemStorage` class) for user data
- Stores users in a Map with UUID-based identifiers
- No persistent database currently configured

**Database Schema (Prepared for PostgreSQL):**
- Drizzle ORM configured for PostgreSQL
- User table schema defined in `shared/schema.ts`
- Schema includes:
  - UUID primary key with auto-generation
  - Unique username field
  - Password field for authentication
- Zod validation schemas for data validation

**Future Database Integration:**
- Drizzle ORM ready for PostgreSQL via `@neondatabase/serverless`
- Configuration file (`drizzle.config.ts`) prepared for migrations
- Environment variable `DATABASE_URL` required for activation

### Authentication & Authorization

**Current State:**
- User schema exists but authentication is not implemented
- No session management or authentication middleware active
- Application currently operates without user accounts

**Prepared Infrastructure:**
- User creation methods in storage interface
- Password field in user schema (requires hashing implementation)
- Session storage configuration present (`connect-pg-simple` dependency)

## External Dependencies

### Third-Party Services
- **Google Fonts**: Inter font family for typography
- **Neon Database**: Serverless PostgreSQL (configured but not actively used)

### Key NPM Packages

**Real-time Communication:**
- `socket.io` / `socket.io-client`: WebSocket communication for signaling
- `simple-peer`: WebRTC wrapper for peer connections

**UI Framework:**
- `react` / `react-dom`: Core UI library
- `@radix-ui/*`: Unstyled accessible component primitives
- `tailwindcss`: Utility-first CSS framework
- `lucide-react`: Icon library

**Data & State Management:**
- `@tanstack/react-query`: Server state management
- `react-hook-form`: Form state and validation
- `zod`: Schema validation
- `@hookform/resolvers`: React Hook Form + Zod integration

**Database & ORM:**
- `drizzle-orm`: TypeScript ORM
- `drizzle-kit`: Drizzle schema management
- `@neondatabase/serverless`: PostgreSQL driver

**Development Tools:**
- `vite`: Build tool and dev server
- `typescript`: Type system
- `tsx`: TypeScript execution for Node.js
- `esbuild`: Fast JavaScript bundler
- `@replit/*` plugins: Replit-specific development enhancements

**Styling Utilities:**
- `class-variance-authority`: Component variant management
- `clsx` / `tailwind-merge`: Class name utilities
- `autoprefixer` / `postcss`: CSS processing