# AssetFlow - Enterprise Asset & Resource Management System

> **Odoo Hackathon Project**

AssetFlow is a modern, enterprise-grade frontend application for managing organizational assets, resource bookings, and maintenance requests. It features a scalable, feature-based architecture and a premium user interface tailored for enterprise SaaS workflows.

## Quick Start for Judges

To run the local development server and explore the UI:

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.


To run the backend:

Run the following commands in your PowerShell terminal:
```powershell
# Enter the backend directory:
cd backend

# Set your PostgreSQL password:
$env:DB_PASSWORD="your_postgres_password"

# Boot the Spring Boot application:
.\mvnw spring-boot:run
```
The server will start up successfully on Port 8085

---

To run the backend integration tests:

```powershell
# Enter the backend directory:
cd backend

# Run the test suite:
$env:DB_PASSWORD="your_postgres_password"
.\mvnw test -Dtest=AuthControllerTest
```

## 🎬 Recommended Demo Flow (2 Minutes)

1. **Dashboard Overview**: Start at the Dashboard (`/`). Explain the KPI cards, interactive charts (Recharts), and recent activity feed.
2. **Asset Directory**: Navigate to **Asset Management > Asset Directory**. Show the enterprise data table, search functionality, and status badges.
3. **Resource Booking**: Go to **Resource Booking**. Demonstrate the booking cards and how the UI handles ongoing vs upcoming bookings.
4. **Maintenance Kanban**: Head to **Maintenance**. Show the interactive Kanban board layout for managing maintenance lifecycles and priority badges.

*(Note: Data is mock-generated on the client-side for immediate hackathon demonstration without requiring a backend.)*

## Tech Stack

- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v3 + shadcn/ui
- **State Management**: Zustand
- **Routing**: React Router DOM v7
- **Animations**: Framer Motion
- **Data Visualization**: Recharts
- **Icons**: Lucide React
- **Mock Data**: Faker.js

## Architecture Highlights

- **Feature-Based Structure**: Clean separation of concerns (`src/features`, `src/pages`, `src/components`).
- **Reusable UI Components**: Leveraged `shadcn/ui` for accessible, consistent building blocks (`src/components/ui`).
- **Responsive Layouts**: Designed to be responsive with a modern side-navigation and top-bar layout (`src/layouts`).
- **Mock Data Injection**: Local state and mock generation setup (`src/mock/index.ts`) allows immediate UI interaction.


## Backend Authentication and Role-Based Access Control (RBAC)

The foundational security layer implements user registration, login, and secure administrative role promotions via Spring Security and PostgreSQL.

### User Roles
* **`EMPLOYEE`**: Default role for new signups. Can request allocations and book shared assets.
* **`DEPARTMENT_HEAD`**: Authorizes asset transfers and approves resource requests within their department.
* **`ASSET_MANAGER`**: Registers physical assets, initiates audits, and tracks asset lifecycles.
* **`ADMIN`**: Full administrative access. Configures settings and regulates roles.

### Endpoint Routing Guards
* **Public Endpoints**:
  * `POST /api/auth/signup`: Create a standard Employee account (users cannot self-assign administrative roles).
  * `POST /api/auth/login`: Authenticate and obtain verification tokens.
* **Administrative Endpoints**:
  * `POST /api/auth/promote/{userId}`: Secure endpoint restricted to `ADMIN` users (`@PreAuthorize("hasRole('ROLE_ADMIN')")`) to elevate and modify structural roles.

---

## Backend Developer Seeding and Credentials

Upon database initialization, default test accounts are seeded automatically. You can use these to query secure endpoints using standard HTTP Basic Authentication:

* **Admin**: `admin@assertflow.com` (Password: `admin123`)
* **Asset Manager**: `manager@assertflow.com` (Password: `manager123`)
* **Department Head**: `head@assertflow.com` (Password: `head123`)
* **Employee**: `employee@assertflow.com` (Password: `employee123`)

---

## Backend Getting Started

### Prerequisites
1. **Java 17 or 21** installed.
2. **PostgreSQL** running locally.
3. Database `assertflow` created:
   ```sql
   CREATE DATABASE assertflow;
   ```

### Environment Variables
You must set your local PostgreSQL password. The application will read it from the environment variable `DB_PASSWORD`.

---
*Built for the Odoo Hackathon*

---
