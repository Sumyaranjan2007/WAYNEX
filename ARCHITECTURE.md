# WAYNEX — Technical Architecture Document

## Product: AI-Powered Travel Intelligence, Discovery, Connectivity and Safety Platform

### Version: 1.0.0 | Phase 1 Implementation

---

## 1. System Overview

WAYNEX is a full-stack web application combining:
- **Next.js Frontend** — React + TypeScript + Tailwind CSS + Three.js
- **Django Backend** — Python + Django REST Framework
- **PostgreSQL + PostGIS** — Spatial database
- **Redis + Celery** — Background jobs
- **Gemini API** — AI assistant with RAG

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT LAYER                          │
│  Next.js (React + TypeScript + Tailwind CSS)            │
│  Three.js / React Three Fiber (3D India Map)            │
│  Mapbox GL / OpenStreetMap (2D Maps)                    │
│  PWA Service Worker (Offline Support)                   │
└───────────────────────┬─────────────────────────────────┘
                        │ HTTPS / REST API
┌───────────────────────▼─────────────────────────────────┐
│                   API GATEWAY                            │
│  Django REST Framework                                   │
│  JWT Authentication                                      │
│  Rate Limiting                                           │
│  CORS / CSRF Protection                                  │
│  API Versioning (/api/v1/)                              │
└───────────┬───────────┬──────────┬──────────────────────┘
            │           │          │
┌───────────▼───┐ ┌─────▼────┐ ┌──▼──────────────────────┐
│  Core Services │ │ AI Layer │ │  Background Workers     │
│  - Auth        │ │ Gemini   │ │  Celery + Redis         │
│  - Destinations│ │ RAG      │ │  - Email notifications  │
│  - Transport   │ │ Embeddings│ │ - Emergency alerts     │
│  - Budget      │ │          │ │  - Data processing      │
│  - Safety      │ │          │ │  - Import jobs          │
│  - Social      │ │          │ │                         │
└───────────┬───┘ └──────────┘ └─────────────────────────┘
            │
┌───────────▼─────────────────────────────────────────────┐
│                   DATA LAYER                             │
│  PostgreSQL + PostGIS                                    │
│  - Spatial queries and geographic data                   │
│  - Full-text search                                      │
│  Redis (Cache + Sessions + Queues)                       │
│  S3-compatible Object Storage (Media)                    │
└─────────────────────────────────────────────────────────┘
```

## 2. Frontend Architecture

### Stack
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS with custom design tokens
- **3D:** Three.js + React Three Fiber + Drei
- **Maps:** Mapbox GL JS (with OpenStreetMap fallback)
- **State:** Zustand
- **Forms:** React Hook Form + Zod
- **HTTP:** Axios with interceptors
- **PWA:** next-pwa

### Folder Structure
```
frontend/
├── public/
│   ├── favicon.ico
│   ├── logo.svg
│   ├── geojson/          # India GeoJSON data
│   ├── textures/         # 3D map textures
│   └── icons/            # PWA icons
├── src/
│   ├── app/              # Next.js App Router pages
│   │   ├── layout.tsx
│   │   ├── page.tsx      # Homepage
│   │   ├── explore/
│   │   ├── destinations/
│   │   ├── budget-planner/
│   │   ├── transport/
│   │   ├── hotels/
│   │   ├── connect/
│   │   ├── language/
│   │   ├── assistant/
│   │   ├── safe/
│   │   ├── trips/
│   │   ├── profile/
│   │   ├── admin/
│   │   └── auth/
│   ├── components/
│   │   ├── ui/           # Design system components
│   │   ├── layout/       # Header, Footer, Nav
│   │   ├── map/          # 3D India map
│   │   ├── destinations/ # Destination cards, pages
│   │   ├── budget/       # Budget planner
│   │   ├── transport/    # Transport components
│   │   ├── social/       # Connect Friends
│   │   ├── safety/       # WAYNEX Safe
│   │   ├── assistant/    # AI Chat
│   │   └── common/       # Shared components
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utilities, API client, auth
│   ├── store/            # Zustand stores
│   ├── types/            # TypeScript types
│   ├── styles/           # Global styles, design tokens
│   └── data/             # Static data, GeoJSON processing
├── tailwind.config.ts
├── next.config.mjs
├── tsconfig.json
└── package.json
```

## 3. Backend Architecture

### Stack
- **Framework:** Django 5.x + DRF
- **Language:** Python 3.12+
- **Database:** PostgreSQL 16 + PostGIS
- **Cache/Queue:** Redis 7
- **Task Queue:** Celery
- **AI:** Google Generative AI (Gemini)

### Django Apps
```
backend/
├── waynex/               # Project config
│   ├── settings/
│   │   ├── base.py
│   │   ├── development.py
│   │   └── production.py
│   ├── urls.py
│   ├── celery.py
│   └── wsgi.py
├── apps/
│   ├── accounts/         # Auth, profiles, verification
│   ├── destinations/     # States, districts, destinations
│   ├── transport/        # Routes, stops, schedules
│   ├── budget/           # Budget planning, recommendations
│   ├── accommodation/    # Hotels, hostels, homestays
│   ├── languages/        # Translation, phrasebook
│   ├── assistant/        # AI chat, RAG
│   ├── social/           # Travel rooms, chat, groups
│   ├── safety/           # SOS, emergency, contacts
│   ├── community/        # Reviews, contributions
│   ├── trips/            # Trip planning, itineraries
│   ├── notifications/    # Push, email, SMS
│   ├── media_manager/    # File uploads, processing
│   └── admin_dashboard/  # Custom admin views
├── core/                 # Shared utilities
│   ├── models.py         # Base models
│   ├── permissions.py
│   ├── pagination.py
│   ├── throttling.py
│   └── validators.py
├── manage.py
├── requirements/
│   ├── base.txt
│   ├── development.txt
│   └── production.txt
└── tests/
```

## 4. Database Schema (Core Tables)

Detailed in SCHEMA.sql — 60+ tables covering:
- User management and authentication
- Geographic hierarchy (states → districts → destinations)
- Transport network (agencies → routes → stops → schedules)
- Budget planning and accommodation
- Social features (rooms, messages, polls)
- Safety (emergency sessions, contacts, locations)
- Community (reviews, contributions, moderation)
- System (audit logs, notifications, data sources)

## 5. API Design

Base: `/api/v1/`

All endpoints use:
- JWT authentication (access + refresh tokens)
- Consistent error responses
- Pagination (cursor-based for feeds, offset for lists)
- Rate limiting per endpoint class
- Request/response validation

## 6. External Dependencies

| Service | Purpose | Required | Fallback |
|---------|---------|----------|----------|
| Gemini API | AI assistant, recommendations | Yes (for AI features) | Static recommendations |
| YouTube Data API | Destination videos | No | Manual video links |
| Mapbox | 2D maps | No | OpenStreetMap + Leaflet |
| SMS Provider (MSG91/Twilio) | OTP, emergency SMS | No | Email-only auth |
| S3-compatible Storage | Media files | No | Local file storage |
| SMTP (SendGrid/Mailgun) | Email notifications | No | Console email backend |

## 7. Security Architecture

- HTTPS everywhere
- JWT with short-lived access tokens + refresh rotation
- RBAC with Django permissions
- API rate limiting (DRF throttling)
- Input validation at API boundary
- Parameterized queries (Django ORM)
- CORS whitelist
- CSP headers
- Audit logging for sensitive operations
- Emergency data encryption
- Location sharing with expiring tokens
