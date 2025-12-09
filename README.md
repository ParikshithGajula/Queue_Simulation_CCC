# Queue Tickets

A modern ticket booking and queue management system built with React and TypeScript. This application demonstrates FIFO (First In, First Out) queue data structure concepts through an interactive booking interface.

🌐 Live Demo: https://parikshithgajula.github.io/queue-tickets/

## Features

🎫 **Ticket Booking System** - Book tickets with seat selection
📊 **Queue Visualization** - Real-time visual representation of the queue
⏳ **Waiting List Management** - Automatic promotion from waiting list
🔄 **Interactive Simulation** - Step-by-step demonstration of queue operations
🎯 **Seat Management** - Select and manage seat assignments
📱 **Responsive Design** - Modern UI with smooth animations
🔐 **Login System** - User authentication interface

## Tech Stack

This project is built with:

- **Vite** - Fast build tool and development server
- **TypeScript** - Type-safe JavaScript
- **React** - UI framework
- **shadcn/ui** - Beautifully designed components
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing

## Getting Started

### Prerequisites

Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm)

### Installation

```bash
# Clone the repository
git clone https://github.com/ParikshithGajula/queue-tickets.git

# Navigate to the project directory
cd queue-tickets

# Install dependencies
npm install

# Start the development server
npm run dev
```

The application will be available at http://localhost:8080/

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── components/        # Reusable UI components
│   ├── BookingForm.tsx
│   ├── QueueVisualizer.tsx
│   ├── SeatSelector.tsx
│   ├── TicketCard.tsx
│   └── ui/           # shadcn/ui components
├── pages/            # Page components
│   ├── Index.tsx     # Main booking page
│   ├── Login.tsx     # Authentication page
│   └── NotFound.tsx  # 404 page
├── lib/              # Utility functions and logic
│   └── queue.ts      # Queue data structure implementation
└── hooks/            # Custom React hooks
```

## How It Works

The application implements a pure FIFO queue data structure:

1. **Booking** - Users book tickets with seat selection
2. **Queue Management** - Confirmed bookings (up to max seats) and waiting list
3. **Cancellation** - When a seat is cancelled, the first person in waiting list is automatically promoted
4. **Simulation Mode** - Educational feature to demonstrate queue operations step-by-step

## Deployment

You can deploy this project to any static hosting service:

- GitHub Pages
- Vercel
- Netlify
- AWS S3 + CloudFront

Build the project for production:

```bash
npm run build
```

The built files will be in the `dist/` directory.
