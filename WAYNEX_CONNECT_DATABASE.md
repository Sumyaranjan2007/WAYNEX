# WAYNEX CONNECT — Database Architecture & Schema Specification

## Database Engine
- **Engine**: SQLite (Development) / PostgreSQL (Production)
- **Framework**: Django 5.x ORM with REST Framework
- **App Module**: `backend/apps/social/`

---

## Entity Relationship Overview

```
                      +-------------------+
                      |       User        |
                      +-------------------+
                                | 1
                                |
             +------------------+------------------+
             | *                | *                | *
   +-------------------+  +---------------+  +-------------------+
   |    TravelRoom     |  |  RoomMember   |  | TravelConnection  |
   +-------------------+  +---------------+  +-------------------+
             | 1                |                  |
             +------------------+                  | (from_user, to_user)
             |
             +------------------+------------------+------------------+
             | *                | *                | *                | *
   +-------------------+  +---------------+  +---------------+  +---------------+
   |    RoomMessage    |  |RoomItinerary  |  |  RoomExpense  |  |  RoomMemory   |
   +-------------------+  +---------------+  +---------------+  +---------------+
```

---

## Model Specifications

### 1. `TravelRoom` (`apps.social.models.TravelRoom`)
Represents a group travel room for collaborative trip planning.

| Field Name | Type | Constraints / Attributes | Description |
|---|---|---|---|
| `id` | UUIDField / Auto | Primary Key | Unique room identifier |
| `creator` | ForeignKey(User) | `on_delete=CASCADE`, `related_name='created_rooms'` | Host user |
| `name` | CharField(200) | Indexed | Room title |
| `description` | TextField | `blank=True` | Trip description & itinerary goals |
| `destination` | ForeignKey(Destination) | `null=True, blank=True` | Destination link |
| `destination_city`| CharField(150) | `blank=True, default=''` | Primary city |
| `state_name` | CharField(150) | `blank=True, default=''` | State / UT |
| `cover_image` | CharField(500) | `blank=True, default=''` | Cover photograph URL |
| `starting_location`| CharField(200) | `blank=True` | Starting departure hub |
| `travel_dates_start`| DateField | `null=True, blank=True` | Departure date |
| `travel_dates_end`| DateField | `null=True, blank=True` | Return date |
| `duration_days` | PositiveIntegerField | `default=3` | Trip duration |
| `budget_per_person`| DecimalField | `max_digits=10, decimal_places=2` | Target budget per person (INR) |
| `min_budget` | DecimalField | `max_digits=10, decimal_places=2` | Lower bound budget (INR) |
| `max_budget` | DecimalField | `max_digits=10, decimal_places=2` | Upper bound budget (INR) |
| `max_members` | PositiveIntegerField | `default=10` | Room capacity limit |
| `travel_style` | CharField(50) | `default='backpacking'` | Style (e.g. trekking, backpacking) |
| `transport_preference` | CharField(50) | `default='bus'` | Transit mode preference |
| `room_rules` | TextField | `blank=True` | House rules & safety guidelines |
| `live_mode` | BooleanField | `default=False` | Live trip mode toggle |
| `visibility` | CharField(10) | `choices=['public','private','unlisted']` | Visibility |
| `join_approval`| CharField(15) | `choices=['auto','manual','invite_only']` | Joining policy |
| `women_only` | BooleanField | `default=False` | Women-only verified room flag |
| `status` | CharField(15) | `choices=['planning','confirmed','ongoing','completed','cancelled']` | Status |

---

### 2. `RoomMember` (`apps.social.models.RoomMember`)
Tracks room memberships and member roles.

| Field Name | Type | Description |
|---|---|---|
| `room` | ForeignKey(TravelRoom) | Linked room |
| `user` | ForeignKey(User) | Linked traveler |
| `role` | CharField(15) | `admin`, `moderator`, `member` |
| `status` | CharField(15) | `pending`, `approved`, `rejected`, `left`, `banned` |
| `joined_at` | DateTimeField | Timestamp of joining |

---

### 3. `RoomItineraryItem` (`apps.social.models.RoomItineraryItem`)
Enables collaborative sight proposals and voting.

| Field Name | Type | Description |
|---|---|---|
| `room` | ForeignKey(TravelRoom) | Linked room |
| `day_number` | PositiveIntegerField | Day index (1, 2, 3...) |
| `time_slot` | CharField(50) | Scheduled time (e.g. `09:00 AM - 12:00 PM`) |
| `title` | CharField(200) | Attraction / activity name |
| `description` | TextField | Details / notes |
| `category` | CharField(50) | `Sightseeing`, `Nature`, `Adventure`, `Food` |
| `entry_fee` | DecimalField | Estimated entry fee in INR |
| `votes_count` | PositiveIntegerField | Real-time tally of member votes |
| `voter_ids` | JSONField | Array of user IDs who voted |
| `is_confirmed` | BooleanField | Consensus reached flag |
| `suggested_by`| ForeignKey(User) | Creator of proposal |

---

### 4. `RoomExpense` (`apps.social.models.RoomExpense`)
Tracks shared expenses and enables automatic split calculations.

| Field Name | Type | Description |
|---|---|---|
| `room` | ForeignKey(TravelRoom) | Linked room |
| `title` | CharField(200) | Expense name (e.g. `Homestay Deposit`) |
| `amount` | DecimalField(10, 2) | Amount paid in INR |
| `category` | CharField(50) | `Stay`, `Food`, `Transit`, `Tickets` |
| `paid_by` | ForeignKey(User) | Payer user |
| `split_among` | JSONField | List of usernames/IDs sharing the cost |
| `receipt_url` | CharField(500) | Optional invoice / receipt image URL |

---

### 5. `RoomMemory` (`apps.social.models.RoomMemory`)
Post-trip shared photo album.

| Field Name | Type | Description |
|---|---|---|
| `room` | ForeignKey(TravelRoom) | Linked room |
| `user` | ForeignKey(User) | Photographer |
| `image_url` | CharField(500) | High-res photo URL |
| `caption` | TextField | Memory story |
| `location_name` | CharField(150) | Specific geo-tagged spot |

---

### 6. `TravelConnection` (`apps.social.models.TravelConnection`)
Peer-to-peer buddy connection requests.

| Field Name | Type | Description |
|---|---|---|
| `from_user` | ForeignKey(User) | Requester |
| `to_user` | ForeignKey(User) | Target companion |
| `status` | CharField(15) | `pending`, `accepted`, `declined` |

---

## Applied Migrations
- Migration: `apps/social/migrations/0002_travelroom_cover_image_travelroom_destination_city_and_more.py`
- Successfully applied via `python manage.py migrate social`.
