# ASIMBv Website - Docker Compose Setup Guide

Full-stack application for the Association of Students in Computer Science and Mathematics Brasov (ASIMBv), composed of:
- **`react-frontend`**: React 19 + Vite frontend (with Hot Module Replacement / live-reload support).
- **`aspnet-backend`**: ASP.NET Core Web API (.NET 8).
- **`postgres`**: PostgreSQL 16 relational database.
- **`adminer`**: Lightweight web-based database management tool.

---

## 🚀 Quick Start in 3 Steps

### Step 1: Prepare Environment Variables
Copy the template configuration file `.env.example` into a new `.env` file:

```bash
cp .env.example .env
```
*(Optionally adjust ports or passwords in `.env` if needed).*

---

### Step 2: Start Containers with Docker Compose
Build the images and start all services in detached mode:

```bash
docker compose up --build -d
```

To stream container logs in real time:
```bash
docker compose logs -f
```

---

### Step 3: Access Services in Your Browser

Once the containers are up and healthy, access each service:

| Service | URL / Port | Details & Credentials |
|---|---|---|
| **Frontend (React + Vite)** | [http://localhost:5173](http://localhost:5173) | Web interface (live-reload enabled) |
| **Backend API (Swagger)** | [http://localhost:5197/swagger](http://localhost:5197/swagger) | Interactive API documentation |
| **Adminer (Database UI)** | [http://localhost:8080](http://localhost:8080) | **System:** `PostgreSQL`<br>**Server:** `postgres`<br>**Username:** `asimbv_user`<br>**Password:** `asimbv_secret_password_2026`<br>**Database:** `asimbv_db` |
| **PostgreSQL 16** | `localhost:5432` | Exposed port for external SQL clients (DBeaver, DataGrip, etc.) |

---

## 🛠️ Common Commands

* **Stop all services:**
  ```bash
  docker compose down
  ```
* **Stop all services and remove persistent database volumes:**
  ```bash
  docker compose down -v
  ```
* **Restart a specific service (e.g., frontend):**
  ```bash
  docker compose restart react-frontend
  ```
* **Check container status:**
  ```bash
  docker compose ps
  ```

---

## 💻 Local Development (Without Docker)
If you prefer running services directly on your host machine without Docker, the backend automatically falls back to **SQLite**:
- **Backend:** `dotnet run --project backend/Backend/Backend/Backend.csproj --launch-profile http` (port `5197`)
- **Frontend:** `cd frontend && npm run dev` (port `5173`)

