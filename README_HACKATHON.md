# AssetFlow - Enterprise Asset & Resource Management System

> **Odoo Hackathon Project**

AssetFlow is a modern, enterprise-grade frontend application for managing organizational assets, resource bookings, and maintenance requests. It features a scalable, feature-based architecture and a premium user interface tailored for enterprise SaaS workflows.

## 🚀 Quick Start for Judges

To run the local development server and explore the UI:

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## 🎬 Recommended Demo Flow (2 Minutes)

1. **Dashboard Overview**: Start at the Dashboard (`/`). Explain the KPI cards, interactive charts (Recharts), and recent activity feed.
2. **Asset Directory**: Navigate to **Asset Management > Asset Directory**. Show the enterprise data table, search functionality, and status badges.
3. **Resource Booking**: Go to **Resource Booking**. Demonstrate the booking cards and how the UI handles ongoing vs upcoming bookings.
4. **Maintenance Kanban**: Head to **Maintenance**. Show the interactive Kanban board layout for managing maintenance lifecycles and priority badges.

*(Note: Data is mock-generated on the client-side for immediate hackathon demonstration without requiring a backend.)*

## 🛠 Tech Stack

- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v3 + shadcn/ui
- **State Management**: Zustand
- **Routing**: React Router DOM v7
- **Animations**: Framer Motion
- **Data Visualization**: Recharts
- **Icons**: Lucide React
- **Mock Data**: Faker.js

## 📁 Architecture Highlights

- **Feature-Based Structure**: Clean separation of concerns (`src/features`, `src/pages`, `src/components`).
- **Reusable UI Components**: Leveraged `shadcn/ui` for accessible, consistent building blocks (`src/components/ui`).
- **Responsive Layouts**: Designed to be responsive with a modern side-navigation and top-bar layout (`src/layouts`).
- **Mock Data Injection**: Local state and mock generation setup (`src/mock/index.ts`) allows immediate UI interaction.

---
*Built for the Odoo Hackathon*
