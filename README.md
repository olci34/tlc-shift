# TLC Shift

A Next.js application for TLC (Taxi and Limousine Commission) shift management and marketplace. The platform features trip density visualization, shift listings management, and user authentication.

## Features

- **Trip Density Dashboard**: Interactive map showing NYC taxi trip patterns with time-based filtering
- **Shift Marketplace**: Browse and manage shift listings
- **User Management**: Authentication system with account management
- **Listings Management**: Create, edit, and manage shift listings with photo uploads

## Tech Stack

- **Framework**: Next.js 15 (Pages Router) with TypeScript
- **UI Library**: Chakra UI v2.10
- **Authentication**: NextAuth.js
- **Maps**: Leaflet with React Leaflet
- **Image Management**: Cloudinary
- **HTTP Client**: Axios
- **Styling**: Emotion, Tailwind CSS

## Getting Started

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
src/
├── api/                    # API service functions
├── components/             # Reusable UI components
│   ├── cloudinary/        # Image upload components
│   ├── form/              # Form input components
│   ├── geomap/           # Map visualization components
│   ├── listing/          # Listing-related components
│   ├── navbar/           # Navigation components
│   └── paginator/        # Pagination component
├── context/               # React context providers
├── layout/                # Layout components
├── lib/                   # Utilities and constants
│   ├── constants/        # Static data (car brands, state codes)
│   ├── interfaces/       # TypeScript interfaces
│   └── utils/            # Helper functions
├── pages/                 # Next.js pages (file-based routing)
│   ├── api/auth/         # NextAuth.js API routes
│   ├── listings/         # Listing pages (CRUD operations)
│   └── ...               # Other application pages
└── styles/               # Global styles and theme
```

## Key Pages

- `/` - Trip density dashboard with interactive map
- `/marketplace` - Shift marketplace
- `/listings` - Browse all listings
- `/listings/create` - Create new listing
- `/my-listings` - User's personal listings
- `/account` - User account management

## Development Guidelines

- Uses ES modules (import/export)
- Follows SOLID principles with component separation
- TypeScript for type safety
- Chakra UI for consistent styling
- Responsive design patterns

## Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
