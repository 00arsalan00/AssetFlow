# AssetFlow - Enterprise Asset & Resource Management System

AssetFlow is a modular monolith application designed to manage organizational assets, allocations, resource bookings, maintenance requests, and auditing.

---

## Authentication & Role-Based Access Control (RBAC)

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

## Developer Seeding & Credentials

Upon database initialization, default test accounts are seeded automatically. You can use these to query secure endpoints using standard **HTTP Basic Authentication**:

* **Admin**: `admin@assertflow.com` (Password: `admin123`)
* **Asset Manager**: `manager@assertflow.com` (Password: `manager123`)
* **Department Head**: `head@assertflow.com` (Password: `head123`)
* **Employee**: `employee@assertflow.com` (Password: `employee123`)

---

##  Getting Started

### Prerequisites
1. **Java 17 or 21** installed.
2. **PostgreSQL** running locally.
3. Database `assertflow` created:
   ```sql
   CREATE DATABASE assertflow;
   ```

### Environment Variables
You must set your local PostgreSQL password. The application will read it from the environment variable `DB_PASSWORD`.

#### Running via VS Code (Recommended)
We have included a configured debug task in `.vscode/launch.json`.
1. Open `.vscode/launch.json`.
2. Update `"DB_PASSWORD"` with your actual local database password.
3. Hit `F5` or select `AssertFlowApplication` from the **Run & Debug** dropdown.

#### Running via Command Line
Run the following commands in your PowerShell terminal:
```powershell
# Set your PostgreSQL password:
$env:DB_PASSWORD="your_postgres_password"

# Boot the Spring Boot application:
.\mvnw spring-boot:run
```
The server will start up successfully on **Port 8081** (chosen to avoid conflicts with standard Oracle Database listeners on port 8080).

---

## Running Integration Tests

To run the suite of integration tests (validating signup flow, login validations, and Admin-Only promotion checks):
```powershell
$env:DB_PASSWORD="your_postgres_password"
.\mvnw test -Dtest=AuthControllerTest
```
