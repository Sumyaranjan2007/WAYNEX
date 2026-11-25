# WAYNEX CONNECT — Security Architecture & Traveler Safety Protocols

## 1. Safety Architecture Overview
WAYNEX Connect is architected around the core principle that digital travel communities require uncompromising physical and digital safety safeguards. Solo and group travel in India demands robust verification, anti-harassment protections, and instant emergency protocols.

---

## 2. Women-Only Travel Sanctuary Safeguards
- **Verified ID Onboarding**: Users entering or hosting `women_only` rooms must have a verified traveler profile backed by government identity validation.
- **Privacy Obfuscation**: Exact residential addresses and private phone numbers are never exposed in public room listings or search results.
- **Strict Role-Based Access Control (RBAC)**: Only verified members can view full group chat history, live location shares, and detailed accommodations for women-only rooms.
- **Zero-Tolerance Anti-Harassment Policy**: Any violation of group code of conduct triggers instant host ban capability and platform-wide blacklisting.

---

## 3. Live Trip Mode & Emergency Protocols
- **Safety Check-in Heartbeats**: During active travel, members can tap "Safety Checked In" at daily transit milestones.
- **Voluntary Location Sharing**: Location coordinates are only transmitted when explicitly activated by the traveler and are scoped to the room duration.
- **State Emergency Dispatch Integration**:
  - `112`: Unified National Emergency Helpline (Police, Fire, Ambulance)
  - `1091 / 181`: National Women Helpline
  - `1800-11-1363`: 24x7 Multi-lingual Tourist Info Helpline (Ministry of Tourism, Govt. of India)

---

## 4. Financial & Expense Transparency
- **Immutable Group Audit Trail**: All logged expenses (`RoomExpense`) record the exact timestamp, payer user, and member split array.
- **Consensus-Driven Approvals**: Significant shared costs require host or member consensus before being locked.
- **No Third-Party Financial Intermediary Risk**: WAYNEX Connect tracks split calculations transparently while allowing direct peer-to-peer settlements via standard UPI handles or cash.

---

## 5. API & Data Security
- **Django CSRF & Token Authentication**: All mutating endpoints (`POST`, `PUT`, `DELETE`) enforce authentication and CSRF token validation.
- **Queryset Scoping**: Private and unlisted rooms cannot be enumerated via public search endpoints without authorization.
