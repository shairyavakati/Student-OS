<p align="center">
  <img src="https://img.shields.io/badge/Student-OS-7C3AED?style=for-the-badge&logo=bookstack&logoColor=white" alt="StudentOS" />
</p>

<h1 align="center">🎓 StudentOS — The AI-Powered Academic Operating System</h1>

<p align="center">
  <strong>A full-stack academic management platform that helps students organize subjects, timetables, notes, assignments, attendance, and study analytics — all in one place.</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/FastAPI-009688?style=flat-square&logo=fastapi&logoColor=white" />
  <img src="https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=next.js&logoColor=white" />
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white" />
  <img src="https://img.shields.io/badge/Supabase-3FCF8E?style=flat-square&logo=supabase&logoColor=white" />
  <img src="https://img.shields.io/badge/SQLAlchemy-D71F00?style=flat-square&logo=sqlalchemy&logoColor=white" />
  <img src="https://img.shields.io/badge/TailwindCSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white" />
  <img src="https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white" />
</p>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#1-backend-setup)
  - [Frontend Setup](#2-frontend-setup)
  - [Docker Setup](#3-docker-setup-alternative)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
- [Database Schema](#-database-schema)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

**StudentOS** is a comprehensive academic operating system designed to be the single hub for everything a student needs. It combines intelligent scheduling, note-taking, assignment tracking, attendance management, and AI-powered study tools into a beautiful, responsive interface.

The application follows a **monorepo** architecture with a decoupled **FastAPI** backend and **Next.js** frontend, backed by **Supabase** (PostgreSQL) for persistence and authentication.

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 🔐 **Authentication** | JWT-based signup/login with secure password hashing (bcrypt) |
| 👤 **Student Profiles** | Manage personal info, semester, department, and avatar |
| 📚 **Subjects** | Add courses with color coding, professor info, and room numbers |
| 🗓️ **Timetable** | Weekly class schedule with day/time slots and class types |
| 📝 **Notes Editor** | Rich notes with folders, pinning, tagging, and word count |
| ✅ **Assignments** | Track tasks with due dates, priority levels, and progress bars |
| 📊 **Attendance Tracker** | Monitor attendance percentage per subject |
| 📈 **Study Analytics** | Dashboard with study statistics and performance insights |
| 📅 **Calendar Integration** | Unified calendar merging assignments, exams, and timetable events |
| 🤖 **AI Features** | AI-powered study plan generation, note summarization, and smart scheduling |
| 👥 **Study Groups** | Collaborative study groups with member roles |
| 🌙 **Dark/Light Themes** | Beautiful UI with theme switching support |

---

## 🛠️ Tech Stack

### Backend
| Technology | Purpose |
|---|---|
| **FastAPI** | Async REST API framework |
| **SQLAlchemy 2.0** | Async ORM with PostgreSQL |
| **asyncpg** | Async PostgreSQL driver |
| **Pydantic v2** | Request/response validation |
| **python-jose** | JWT token encoding/decoding |
| **passlib + bcrypt** | Password hashing |
| **Uvicorn** | ASGI server |

### Frontend
| Technology | Purpose |
|---|---|
| **Next.js 15** | React framework with SSR & API routes |
| **React 19** | UI component library |
| **TypeScript** | Type-safe JavaScript |
| **Tailwind CSS** | Utility-first CSS framework |
| **Radix UI** | Accessible headless UI primitives |
| **Recharts** | Data visualization charts |
| **Zustand** | Lightweight state management |
| **Framer Motion** | Animations and transitions |

### Infrastructure
| Technology | Purpose |
|---|---|
| **Supabase** | Hosted PostgreSQL + Auth |
| **Docker** | Containerized deployment |
| **pnpm** | Fast, disk-efficient package manager |

---

## 📁 Project Structure

```
StudentOS/
├── apps/
│   ├── api/                          # FastAPI Backend
│   │   ├── api/                      # Route handlers
│   │   │   ├── ai.py                 #   AI-powered features
│   │   │   ├── analytics.py          #   Study analytics
│   │   │   ├── assignments.py        #   Assignment CRUD
│   │   │   ├── attendance.py         #   Attendance tracking
│   │   │   ├── auth.py               #   Signup / Login / Refresh
│   │   │   ├── calendar.py           #   Calendar integration
│   │   │   ├── dashboard.py          #   Dashboard summary
│   │   │   ├── groups.py             #   Study groups
│   │   │   ├── notes.py              #   Notes CRUD
│   │   │   ├── profile.py            #   Profile management
│   │   │   ├── subjects.py           #   Subject CRUD
│   │   │   └── timetable.py          #   Timetable CRUD
│   │   ├── core/                     # App configuration
│   │   │   ├── config.py             #   Settings (env vars)
│   │   │   └── security.py           #   JWT + password utils
│   │   ├── database/
│   │   │   └── session.py            #   SQLAlchemy async engine
│   │   ├── dependencies/
│   │   │   └── auth.py               #   Auth dependency injection
│   │   ├── models/
│   │   │   └── all_models.py         #   SQLAlchemy ORM models
│   │   ├── repositories/
│   │   │   ├── base_repository.py    #   Generic CRUD repository
│   │   │   └── all_repositories.py   #   Domain-specific repos
│   │   ├── schemas/
│   │   │   └── all_schemas.py        #   Pydantic request/response
│   │   ├── tests/
│   │   │   └── test_main.py          #   API test suite
│   │   ├── .env                      #   Environment variables
│   │   ├── Dockerfile                #   Container config
│   │   ├── main.py                   #   FastAPI app entrypoint
│   │   └── requirements.txt          #   Python dependencies
│   │
│   └── web/                          # Next.js Frontend
│       ├── src/
│       │   ├── app/
│       │   │   ├── api/auth/         #   API proxy routes
│       │   │   └── page.tsx          #   Main application UI
│       │   └── styles/
│       │       └── tailwind.css      #   Tailwind directives
│       ├── package.json
│       ├── tailwind.config.ts
│       └── tsconfig.json
│
├── supabase/
│   ├── migrations/
│   │   └── 20260712000000_initial_schema.sql  # DB schema
│   └── seed.sql                               # Test seed data
│
├── docker-compose.yml                # Docker orchestration
├── package.json                      # Root workspace config
├── pnpm-workspace.yaml               # pnpm workspace definition
└── .gitignore
```

---

## 🚀 Getting Started

### Prerequisites

- **Python** 3.10+
- **Node.js** 18+
- **pnpm** 8+ (`npm install -g pnpm`)
- **PostgreSQL 15+** (or use Supabase / Docker)

### 1. Backend Setup

```bash
# Clone the repository
git clone https://github.com/shairyavakati/Student-OS.git
cd Student-OS

# Create and activate a virtual environment
python -m venv venv
# Windows
venv\Scripts\activate
# macOS / Linux
source venv/bin/activate

# Install Python dependencies
pip install -r apps/api/requirements.txt

# Configure environment variables
# Edit apps/api/.env with your database credentials (see Environment Variables section)

# Start the backend server
python -m uvicorn apps.api.main:app --reload
```

The API will be available at **http://localhost:8000**

- Swagger UI: [http://localhost:8000/docs](http://localhost:8000/docs)
- ReDoc: [http://localhost:8000/redoc](http://localhost:8000/redoc)

### 2. Frontend Setup

```bash
# From the project root
cd apps/web

# Install dependencies
pnpm install

# Configure environment variables
# Edit apps/web/.env.local (see Environment Variables section)

# Start the development server
pnpm dev
```

The frontend will be available at **http://localhost:3000**

### 3. Docker Setup (Alternative)

```bash
# From the project root — spins up both the API and a PostgreSQL database
docker-compose up --build
```

This starts:
- **API** at `http://localhost:8000`
- **PostgreSQL** at `localhost:5432`

---

## 🔑 Environment Variables

### Backend (`apps/api/.env`)

| Variable | Description | Example |
|---|---|---|
| `DATABASE_URL` | PostgreSQL connection string (asyncpg) | `postgresql+asyncpg://user:pass@host:5432/db` |
| `JWT_SECRET` | Secret key for JWT token signing | `your-256-bit-secret` |
| `SUPABASE_URL` | Supabase project URL | `https://xxx.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | `sb_...` |
| `SUPABASE_ANON_KEY` | Supabase anonymous key | `eyJ...` |
| `OPENAI_API_KEY` | OpenAI API key (for AI features) | `sk-...` |

### Frontend (`apps/web/.env.local`)

| Variable | Description | Example |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | `https://xxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | `eyJ...` |
| `BACKEND_URL` | Backend API base URL | `http://localhost:8000` |

---

## 📡 API Reference

All API endpoints are prefixed with `/api/v1`. Full interactive documentation is available at `/docs` when the server is running.

### Authentication
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/v1/auth/signup` | Register a new student account |
| `POST` | `/api/v1/auth/login` | Login with email & password |
| `POST` | `/api/v1/auth/refresh` | Refresh access token |
| `GET` | `/api/v1/auth/me` | Get current authenticated user |

### Student Profiles
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/profile/me` | Get current user profile |
| `PUT` | `/api/v1/profile/me` | Update profile details |

### Subjects
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/subjects` | List all subjects |
| `POST` | `/api/v1/subjects` | Create a new subject |
| `DELETE` | `/api/v1/subjects/{id}` | Delete a subject |

### Timetable
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/timetable` | Get weekly timetable |
| `POST` | `/api/v1/timetable` | Add a timetable slot |
| `DELETE` | `/api/v1/timetable/{id}` | Remove a timetable slot |

### Notes
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/notes` | List notes (optional folder filter) |
| `POST` | `/api/v1/notes` | Create a note |
| `PUT` | `/api/v1/notes/{id}` | Update a note |
| `DELETE` | `/api/v1/notes/{id}` | Delete a note |

### Assignments
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/assignments` | List assignments (filter by status) |
| `POST` | `/api/v1/assignments` | Create an assignment |
| `PUT` | `/api/v1/assignments/{id}` | Update assignment progress |
| `DELETE` | `/api/v1/assignments/{id}` | Delete an assignment |

### Attendance
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/attendance` | Get attendance records |
| `POST` | `/api/v1/attendance` | Log attendance |
| `PUT` | `/api/v1/attendance/{id}` | Update attendance record |

### Analytics
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/analytics/study-stats` | Get study statistics |

### Calendar
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/calendar` | Get integrated calendar events |

### AI Features
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/v1/ai/study-plan` | Generate AI study plan |
| `POST` | `/api/v1/ai/summarize` | AI-powered note summarization |
| `POST` | `/api/v1/ai/quiz` | Generate quiz from notes |
| `POST` | `/api/v1/ai/explain` | Get AI explanation of a topic |

### Study Groups
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/v1/groups` | List study groups |
| `POST` | `/api/v1/groups` | Create a study group |
| `POST` | `/api/v1/groups/{id}/join` | Join a study group |
| `DELETE` | `/api/v1/groups/{id}` | Delete a study group |

---

## 🗄️ Database Schema

The application uses **8 interconnected tables** in PostgreSQL:

```mermaid
erDiagram
    profiles ||--o{ subjects : "has many"
    profiles ||--o{ timetable_slots : "has many"
    profiles ||--o{ notes : "has many"
    profiles ||--o{ assignments : "has many"
    profiles ||--o{ attendance_records : "has many"
    profiles ||--o{ calendar_events : "has many"
    subjects ||--o{ timetable_slots : "scheduled in"
    subjects ||--o{ notes : "tagged to"
    subjects ||--o{ assignments : "belongs to"
    subjects ||--o{ attendance_records : "tracked for"

    profiles {
        uuid id PK
        varchar full_name
        varchar email UK
        int semester
        varchar department
        varchar avatar_url
        varchar hashed_password
        timestamp created_at
        timestamp deleted_at
    }

    subjects {
        uuid id PK
        uuid user_id FK
        varchar name
        varchar code
        varchar color
        varchar room
        varchar professor
    }

    timetable_slots {
        uuid id PK
        uuid user_id FK
        uuid subject_id FK
        varchar day_of_week
        time start_time
        time end_time
        varchar class_type
        varchar room
    }

    notes {
        uuid id PK
        uuid user_id FK
        uuid subject_id FK
        varchar title
        text content
        varchar folder_name
        boolean is_pinned
        int words_count
        array tags
    }

    assignments {
        uuid id PK
        uuid user_id FK
        uuid subject_id FK
        varchar title
        timestamp due_date
        varchar priority
        boolean is_done
        int progress_percentage
    }

    attendance_records {
        uuid id PK
        uuid user_id FK
        uuid subject_id FK
        int attended_count
        int total_count
    }

    calendar_events {
        uuid id PK
        uuid user_id FK
        varchar event_type
        varchar label
        date event_date
        text description
    }

    study_groups {
        uuid id PK
        varchar name
        text description
        uuid creator_id FK
    }
```

All tables implement **soft deletes** via the `deleted_at` column.

---

## 🧪 Testing

```bash
# Run backend tests from the project root
# Set PYTHONPATH so imports resolve correctly
# Windows (PowerShell)
$env:PYTHONPATH = "$(Get-Location)"; pytest apps/api/tests -v

# macOS / Linux
PYTHONPATH=$(pwd) pytest apps/api/tests -v
```

### Expected Output
```
apps/api/tests/test_main.py::test_read_root       PASSED
apps/api/tests/test_main.py::test_docs_accessible  PASSED
```

---

## 🚢 Deployment

### Docker (Recommended for Production)

```bash
# Build and start all services
docker-compose up --build -d

# View logs
docker-compose logs -f api
```

### Manual Deployment

1. **Backend**: Deploy the FastAPI app with Uvicorn behind a reverse proxy (Nginx / Caddy)
2. **Frontend**: Deploy the Next.js app with `pnpm build && pnpm start`
3. **Database**: Use Supabase hosted PostgreSQL or your own PostgreSQL 15+ instance

### Environment Checklist
- [ ] Set production `DATABASE_URL` with SSL
- [ ] Generate a strong `JWT_SECRET` (256-bit minimum)
- [ ] Configure CORS origins for your production domain
- [ ] Set up Supabase project keys
- [ ] Configure OpenAI API key for AI features

---

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m 'feat: add amazing feature'`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

### Commit Convention

This project follows the [Conventional Commits](https://www.conventionalcommits.org/) specification:

| Prefix | Purpose |
|---|---|
| `feat:` | New feature |
| `fix:` | Bug fix |
| `docs:` | Documentation changes |
| `refactor:` | Code restructuring |
| `test:` | Adding or updating tests |
| `chore:` | Maintenance tasks |

---

## 📄 License

This project is open-source. See the repository for license details.

---

<p align="center">
  Built with ❤️ by <a href="https://github.com/shairyavakati">Shairya Vakati</a>
</p>