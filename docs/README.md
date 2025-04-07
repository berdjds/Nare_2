# Nare Travel and Tours Website Documentation

## Project Overview

Nare Travel and Tours is a comprehensive travel website built with Next.js, offering services for local and international travelers, as well as B2B clients. The website provides a modern, responsive interface with multilingual support and secure e-payment integration.

## Technical Stack

- **Framework**: Next.js 13.5.1
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Animations**: Framer Motion
- **State Management**: Zustand
- **Icons**: Lucide React
- **Image Optimization**: Next.js Image Component
- **Form Handling**: React Hook Form
- **Date Handling**: date-fns
- **Carousel**: Embla Carousel

## Core Features

### 1. Multilingual Support
- Automatic language detection (Armenian, English, Russian)
- Language preference persistence
- Context-aware content switching

### 2. Tour Management
- Daily tours booking
- Cultural tours
- Adventure tours
- International packages
- Dynamic pricing
- Real-time availability

### 3. B2B Services
- DMC (Destination Management Company) portal
- MICE (Meetings, Incentives, Conferences, Events) services
- Agency client portal
- Corporate travel solutions

### 4. Booking System
- Interactive booking forms
- Date selection
- Group size handling
- Price calculation
- Booking confirmation

### 5. Content Management
- Dynamic image loading
- Fallback image system
- Content organization by tour type
- Multilingual content support

## Project Structure

```
nare-travel/
├── app/                    # Next.js app directory
│   ├── about/             # About page
│   ├── armenia-tours/     # Armenia tours section
│   ├── b2b/              # B2B services
│   ├── contact/          # Contact page
│   ├── services/         # Services section
│   └── layout.tsx        # Root layout
├── components/           # Reusable components
│   ├── ui/              # UI components
│   ├── navbar.tsx       # Navigation component
│   └── footer.tsx       # Footer component
├── hooks/               # Custom React hooks
├── lib/                # Utility functions
└── public/             # Static assets
```

## Key Components

### Navigation System
- Responsive navbar with mobile support
- Dynamic menu generation
- Language switcher
- Theme toggler

### Tour Components
- Tour cards with image galleries
- Booking forms
- Price displays
- Availability indicators

### B2B Portal
- Service showcases
- Contact forms
- Corporate client features
- Event planning tools

## Deployment Requirements

### Server Requirements
- Node.js 16.x or higher
- Support for static site generation
- CDN for image delivery
- SSL certificate for secure connections

### Performance Targets
- First Contentful Paint: