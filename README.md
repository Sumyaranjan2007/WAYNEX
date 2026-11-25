# WAYNEX — AI-Powered Travel Intelligence Platform

> **"Your World. Your Way."**

WAYNEX is a production-oriented full-stack web application that helps people explore destinations, understand local culture, find affordable travel options, navigate local transportation, communicate without language barriers, connect with fellow travellers, and travel safely.

## 🌍 Overview

WAYNEX is not another hotel-booking website. It's an AI-powered travel intelligence ecosystem designed to help people independently navigate their entire journey. Initial geographic scope: **India** (pilot: Karnataka).

## 🏗️ Architecture

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 14, React, TypeScript, Tailwind CSS |
| **3D Map** | Three.js, React Three Fiber, GeoJSON |
| **Backend** | Python, Django 5, Django REST Framework |
| **Database** | PostgreSQL + PostGIS (SQLite for dev) |
| **AI** | Google Gemini API, RAG |
| **Task Queue** | Celery + Redis |
| **Auth** | JWT (SimpleJWT) |

## 📁 Project Structure

```
WAYNEX/
├── frontend/              # Next.js application
│   ├── src/
│   │   ├── app/           # App Router pages (17 routes)
│   │   ├── components/    # UI, layout, map components
│   │   ├── data/          # Static data (states, destinations)
│   │   ├── lib/           # API client, auth, utilities
│   │   ├── store/         # Zustand state management
│   │   ├── styles/        # Global CSS, design tokens
│   │   └── types/         # TypeScript interfaces
│   └── public/            # Logo, favicon, GeoJSON
├── backend/               # Django application
│   ├── waynex/            # Project config (settings, URLs)
│   ├── apps/              # Django apps
│   │   ├── accounts/      # Auth, user profiles
│   │   ├── destinations/  # States, districts, destinations
│   │   ├── transport/     # Routes, stops, schedules
│   │   ├── budget/        # Budget planning
│   │   ├── accommodation/ # Hotels, hostels
│   │   ├── safety/        # SOS, emergency contacts
│   │   ├── social/        # Travel rooms, chat
│   │   ├── assistant/     # AI assistant
│   │   └── languages/     # Translation, phrasebook
│   ├── core/              # Base models, pagination, permissions
│   └── manage.py
├── ARCHITECTURE.md
├── DEVELOPMENT_STATUS.md
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and **pnpm**
- **Python** 3.10+
- **Git**

### Frontend Setup

```bash
cd frontend
pnpm install
pnpm dev
```

The frontend runs at `http://localhost:3000`.

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Linux/macOS
# venv\Scripts\activate   # Windows

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Seed initial data
python manage.py seed_karnataka
python manage.py seed_languages

# Create admin user
python manage.py createsuperuser

# Start server
python manage.py runserver
```

The backend runs at `http://localhost:8000`.
Admin dashboard at `http://localhost:8000/admin/`.

### Environment Variables

Copy `.env.example` to `.env` in the backend directory:

```bash
cp backend/.env.example backend/.env
```

Key variables:

| Variable | Description | Required |
|----------|-------------|----------|
| `SECRET_KEY` | Django secret key | Yes (auto-generated for dev) |
| `DEBUG` | Debug mode | No (default: True) |
| `GEMINI_API_KEY` | Google Gemini API key | For AI features |
| `YOUTUBE_API_KEY` | YouTube Data API key | For video integration |
| `NEXT_PUBLIC_API_URL` | Backend API URL | For frontend API calls |

## 📡 API Endpoints

Base URL: `/api/v1/`

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/v1/auth/register/` | POST | Register new user |
| `/api/v1/auth/login/` | POST | Get JWT tokens |
| `/api/v1/auth/refresh/` | POST | Refresh JWT token |
| `/api/v1/auth/profile/` | GET/PUT | User profile |
| `/api/v1/states/` | GET | List all states |
| `/api/v1/states/{slug}/` | GET | State details |
| `/api/v1/states/{slug}/destinations/` | GET | Destinations in state |
| `/api/v1/destinations/` | GET | Browse destinations |
| `/api/v1/destinations/{slug}/` | GET | Destination details |
| `/api/v1/destinations/search/?q=` | GET | Search destinations |
| `/api/v1/destinations/trending/` | GET | Trending destinations |
| `/api/v1/destinations/hidden_gems/` | GET | Hidden gems |
| `/api/v1/transport/` | GET | Transport routes |
| `/api/v1/budget/` | POST | Budget recommendations |
| `/api/v1/accommodation/` | GET | Accommodation search |
| `/api/v1/safety/contacts/` | GET/POST | Trusted contacts |
| `/api/v1/safety/sessions/` | GET/POST | Emergency sessions |
| `/api/v1/social/rooms/` | GET/POST | Travel rooms |
| `/api/v1/assistant/chat/` | POST | AI assistant |
| `/api/v1/languages/phrases/` | GET | Travel phrases |

## 🗺️ Features

### Phase 1 (Current)
- ✅ Interactive 3D India map with all 36 states/UTs
- ✅ State detail pages with destinations
- ✅ Destination search with filters
- ✅ Karnataka pilot data (15 destinations, attractions, real coordinates)
- ✅ Authentication (JWT)
- ✅ Design system (Navy/Cyan theme)
- ✅ Mobile-responsive layout
- ✅ WAYNEX Safe dashboard
- ✅ Budget planner interface
- ✅ Language assistant with travel phrases
- ✅ AI assistant chat interface
- ✅ Connect (Travel Rooms) interface

### Phase 2+ (Planned)
- YouTube API integration
- AI-powered budget recommendations
- Transport journey planner with real data
- Accommodation provider integrations
- Real-time chat in travel rooms
- SOS with trusted contact notifications
- Women safety check-in system
- Offline PWA support
- Community contributions

## 🎨 Design System

| Color | Hex | Usage |
|-------|-----|-------|
| Navy 700 | `#0f1f35` | Primary background |
| Navy 500 | `#1e3a5f` | Cards, sections |
| Cyan 500 | `#06b6d4` | Accent, CTAs |
| Amber 500 | `#f59e0b` | Highlights, warnings |
| Red 600 | `#dc2626` | Emergency/SOS only |

Typography: **Inter** (Google Fonts)

## 🔒 Security

- JWT authentication with token rotation
- Role-based access control
- API rate limiting
- CORS whitelist
- CSRF protection
- Input validation at API boundary
- Audit logging for sensitive operations
- Emergency data privacy controls

## 🌱 Seed Data

Karnataka pilot includes **real, verified data**:
- 28 Indian states + 8 Union Territories
- 11 Karnataka districts
- 15 pilot destinations with real coordinates
- 30+ attractions with actual entry fees and hours
- 12 supported Indian languages
- 15+ travel phrases with translations and pronunciation

## 📝 License

This project is proprietary. All rights reserved.

## 🆘 Emergency

**India National Emergency Number: 112**

WAYNEX includes emergency features but is NOT a substitute for official emergency services. Always call 112 in case of a real emergency.
