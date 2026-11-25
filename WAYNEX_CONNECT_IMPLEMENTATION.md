# WAYNEX CONNECT — Complete Social Travel Community Implementation

## Executive Summary
WAYNEX Connect is a social travel community system fully integrated into the WAYNEX travel platform. It connects travelers across India, enabling them to discover verified travel companions, create collaborative travel rooms, plan group trips with real-time consensus voting, manage shared budgets and expenses, and travel safely using Live Trip Mode with emergency check-ins.

---

## Architecture Overview

```
+-----------------------------------------------------------------------------------+
|                                 WAYNEX Frontend                                   |
|  (/connect)                                                                       |
|  - Hero & Value Proposition: "Don't Travel Alone. Find Your Travel People."       |
|  - Multi-Step Room Creation: Destination, Budget, Style, Transit, Safety          |
|  - Room Discovery Grid: Search, Filters, Badges (Women-Only, Live Mode, Seats)    |
|  - Recommended Companions: AI Compatibility Matches, Travel Style, Badges         |
|  - Field Dispatches / Community Updates Feed                                      |
+-----------------------------------------------------------------------------------+
                                        |
                                        v
+-----------------------------------------------------------------------------------+
|                        Dedicated 8-Tab Room Workspace                             |
|  1. Overview: Quick facts, rules, guidelines, state emergency helpline            |
|  2. Chat: Real-time group messaging, avatars, timestamps, system notices          |
|  3. Itinerary: Collaborative sight proposals with live thumbs-up voting           |
|  4. Route Map: Transit timeline, highway pitstops, route nodes                    |
|  5. Members: Confirmed members, host controls, approve/decline join requests      |
|  6. Budget: Total group budget, expenses log, equal split calculator              |
|  7. AI Travel Agent: Context-aware copilot for local dining, weather & logistics   |
|  8. Memories: Post-trip shared photo album & travel stories                       |
+-----------------------------------------------------------------------------------+
                                        |
                                        v REST API (HTTP + JSON)
+-----------------------------------------------------------------------------------+
|                             Django REST Framework API                             |
|  - /api/v1/social/rooms/ (List, Create, Retrieve, Update, Delete)                 |
|  - /api/v1/social/rooms/{id}/join/ & /leave/                                      |
|  - /api/v1/social/rooms/{id}/messages/                                            |
|  - /api/v1/social/rooms/{id}/itinerary/ & /vote_itinerary/                        |
|  - /api/v1/social/rooms/{id}/expenses/                                            |
|  - /api/v1/social/rooms/{id}/memories/                                            |
|  - /api/v1/social/connections/ (Travel Buddy Requests)                           |
+-----------------------------------------------------------------------------------+
                                        |
                                        v
+-----------------------------------------------------------------------------------+
|                             SQLite / PostgreSQL DB                                |
|  - TravelRoom, RoomMember, RoomMessage, RoomPoll, RoomJoinRequest                 |
|  - RoomItineraryItem, RoomExpense, RoomMemory, TravelConnection                   |
+-----------------------------------------------------------------------------------+
```

---

## Core Modules & Features

### 1. Connect Homepage (`frontend/src/app/connect/page.tsx`)
- **Headline**: *"Don't Travel Alone. Find Your Travel People."*
- **Primary CTAs**:
  - `Create a Travel Room`: Opens the 4-step room creation modal.
  - `Discover Travel Rooms`: Smoothly scrolls to the live room cards catalog.
- **Filter Tabs**:
  - All Rooms, Trending, Women-Only, Solo Backpackers, Spots Available, My Rooms.
- **Dynamic Search & Filters**: Search by destination city/state, filter by travel style (Backpacking, Trekking, Road Trip, Heritage) and transit mode (Bus, Train, Cab).

### 2. Multi-Step Room Creation (`CreateRoomModal.tsx`)
- **Step 1: Trip Info**: Destination city, state, boarding hub, dates, duration, cover photo.
- **Step 2: Budget**: Per-person target budget, min/max bounds, budget category tiers.
- **Step 3: Travel Preferences**: Travel style tags, transit mode, shared interests.
- **Step 4: Room Settings & Safety**: Max capacity, auto vs. manual approval, women-only toggle, and community rules.

### 3. Room Card Component (`RoomCard.tsx`)
- Aspect-ratio cover image with progressive gradient overlay.
- Safety badges: Women-Only, Live Trip Mode, Spots left counter.
- Key trip metrics: Destination city, state, dates, duration, budget per person, host avatar.
- Direct CTA: "Join Room" / "Request to Join" / "Explore Room".

### 4. Dedicated 8-Tab Room Workspace (`RoomWorkspace.tsx`)
- **Live Trip Mode**: Banner with pulsing live indicator, safety check-in status button, and current stop alert.
- **Tab 1: Overview**: Trip description, boarding location, transit mode, community standards agreement, and state emergency contacts (112, 1091, 1800-11-1363).
- **Tab 2: Chat**: Group chat feed with user avatars, formatted timestamps, message submission form.
- **Tab 3: Itinerary**: Attraction proposals categorized by day and time slot with interactive thumbs-up voting that live-updates the vote tally.
- **Tab 4: Route Map**: Visual route timeline showing start hub, intermediate pitstops, and destination basecamp.
- **Tab 5: Members & Join Requests**: Confirmed members list with verified badges, and host approval queue for pending join requests.
- **Tab 6: Group Budget**: Target budget vs. actual expenses logged, per-person share calculation, and "+ Log Expense" form modal.
- **Tab 7: AI Travel Agent**: Contextual AI assistant answering destination-specific queries (best food, weather, packing, budget calculation).
- **Tab 8: Memories**: Shared photo gallery with image, caption, photographer credit, and location pin.

### 5. Member Profile Modal (`MemberProfileModal.tsx`)
- Profile avatar, name, handle, verified badge, and location.
- AI Compatibility Match score (e.g. 96%).
- Quick stats: Trips completed, Travel Karma (4.9/5 ★), Safety verification status.
- Bio, travel style, languages spoken, and favorite destinations.
- Action: "Send Connection Request".
