# TobaccoFree App

## Overview

The TobaccoFree App is a React-based Progressive Web Application (PWA) designed to help users track their tobacco-free journey. The application focuses on daily check-ins, progress visualization, and motivational support through a mobile-first design. It uses local storage for data persistence and includes support for Android APK generation through Capacitor.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Routing**: Wouter for lightweight client-side routing
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **Styling**: Tailwind CSS with custom design system
- **State Management**: React hooks with local component state

### Mobile Support
- **PWA**: Configured as a Progressive Web App
- **Mobile APK**: Capacitor integration for Android app generation
- **Responsive Design**: Mobile-first approach with max-width container

## Key Components

### Pages
- **Home**: Main dashboard with daily check-in, progress calendar, and motivational quotes
- **Stats**: Detailed statistics and progress tracking
- **Goals**: Achievement system and milestone tracking
- **Profile**: User information and settings
- **Login**: User authentication and registration

### Core Features
- **Daily Check-in**: Binary tobacco usage tracking (tobacco-free or not)
- **Progress Calendar**: 30-day visual progress grid
- **Achievement System**: Milestone-based rewards and badges
- **Health Timeline**: Progressive health benefits tracking
- **Motivational Quotes**: Daily inspirational messages
- **Statistics Dashboard**: Comprehensive progress analytics

### UI Components
- **Bottom Navigation**: Mobile-optimized tab navigation
- **Achievement Badges**: Visual reward system
- **Progress Calendar**: Interactive 30-day grid view
- **Health Timeline**: Progressive health benefit display
- **Daily Check-in**: Simple binary choice interface

## Data Flow

### Local Storage Strategy
- **User Management**: Local user accounts with basic authentication
- **Data Persistence**: All user data stored in browser localStorage
- **Data Structure**: Typed interfaces for Users, DailyEntries, Achievements, and UserStats
- **No Backend**: Completely client-side application

### Data Models
- **User**: Basic user account information
- **DailyEntry**: Daily tobacco usage records
- **Achievement**: Unlocked milestones and badges
- **UserStats**: Calculated statistics (streaks, money saved, etc.)

### State Management
- Local component state for UI interactions
- localStorage for data persistence
- No global state management library used

## External Dependencies

### Core Dependencies
- **React**: Frontend framework
- **TypeScript**: Type safety
- **Vite**: Build tool and development server
- **Wouter**: Lightweight routing
- **Tailwind CSS**: Utility-first CSS framework

### UI Libraries
- **Radix UI**: Headless UI primitives
- **Lucide React**: Icon library
- **Class Variance Authority**: Component variant management
- **CLSX**: Conditional class names

### Mobile Dependencies
- **Capacitor**: Native mobile app wrapper
- **Capacitor Android**: Android platform support

### Development Tools
- **ESBuild**: JavaScript bundler
- **PostCSS**: CSS processing
- **Autoprefixer**: CSS vendor prefixes

## Deployment Strategy

### Development
- **Local Development**: Vite dev server on port 5173
- **Hot Reload**: Instant updates during development
- **Host Configuration**: Configured for external access

### Production Build
- **Static Build**: Vite builds static assets to dist/public
- **Node.js Server**: Simple server that redirects to Vite in development
- **Replit Deployment**: Configured for Replit hosting platform

### Mobile Deployment
- **Android APK**: Capacitor builds native Android application
- **PWA**: Web app installable on mobile devices
- **Offline Support**: Local storage enables offline functionality

### Platform Configuration
- **Replit**: Configured with Node.js 20, Web, and PostgreSQL modules
- **Port Configuration**: 5000 for server, 5173 for Vite
- **Auto-scaling**: Deployment target set to autoscale

## Changelog

```
Changelog:
- June 14, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```