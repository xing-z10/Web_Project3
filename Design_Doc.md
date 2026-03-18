# Design Document: EventHub

## 1. Project Description

Currently, public events—concerts, festivals, tech meetups, museum exhibitions, farmers markets—are fragmented across dozens of platforms: Eventbrite, Meetup, Facebook Events, university calendars, venue websites, and local city listings. Event seekers must manually check multiple sources, leading to missed opportunities and discovery fatigue.

EventHub is a unified, no-login web application that aggregates public events from disparate platforms into a single searchable, filterable interface. It allows anyone to discover what's happening in their city without platform-hopping, while enabling community contributors to manually add events from niche sources. Events are sourced through a curated dataset of 1,000+ records and community contributions via manual submission forms. To support personalization without requiring account creation, users may optionally enter their email as an identifier to save preferences and comparisons across sessions.

The platform features an interactive map view, a "Discover Tonight" recommendation engine that surfaces today's events based on user preferences, and a side-by-side event comparison tool—designed to transform passive browsing into active city exploration.

### Core Features

- **Event Discovery** — Browse 1,000+ events with list and interactive map views
- **Search & Filter** — Filter by city, category, price, date, and source platform
- **Add Event** — Community submission form to add niche events
- **Discover Tonight** — Auto-loads today's events based on saved city and category preferences
- **Event Comparison** — Select up to 3 events and compare them side-by-side; saved across sessions
- **Preferences** — Save preferred category, excluded category, and default city; persisted by email identifier
- **Email-based Identity** — No account creation required; email stored locally for cross-session persistence

### Technical Stack

- **Frontend:** React with Hooks, React Router, CSS Modules
- **Backend:** Node.js + Express
- **Database:** MongoDB (native driver, no Mongoose)
- **Deployment:** Render

### Database Schema

**Database:** `project3`
**Type:** MongoDB
**Collections:** 2

#### Collection 1: `event`

| Field | Type | Description |
|---|---|---|
| `_id` | ObjectId | Auto-generated |
| `id` | Number | Numeric identifier |
| `title` | String | Event title |
| `category` | String | Event category (e.g. Concerts, Theaters) |
| `date` | Date | Event date |
| `time` | String | Event time |
| `location_venue` | String | Venue name |
| `location_city` | String | City |
| `price` | Number | Price (0 = free) |
| `source` | String | Source URL |
| `views` | Number | View count |

#### Collection 2: `preference`

| Field | Type | Description |
|---|---|---|
| `_id` | ObjectId | Auto-generated |
| `email` | String | User identifier (unique) |
| `preferred_cate` | String | Preferred event category |
| `exclude_cate` | String | Excluded event category |
| `last_city` | String | Default city for discovery |
| `comparison_1` | Number | Saved comparison event id 1 |
| `comparison_2` | Number | Saved comparison event id 2 |
| `comparison_3` | Number | Saved comparison event id 3 |

---

## 2. User Personas

### Persona 1 — The City Explorer
Residents and tourists who want to quickly see everything happening this weekend—across all categories and sources—without browsing five different websites.

### Persona 2 — The Niche Enthusiast
Fans of specific scenes (underground music, indie film, tech talks, craft fairs) who follow fragmented communities across Meetup groups, Discord servers, and venue newsletters.

### Persona 3 — The Event Contributor
Community organizers, venue staff, or engaged locals who want to surface events from overlooked platforms or add one-off happenings not listed anywhere centralized.

---

## 3. User Stories

### City Explorer
- **US1:** As a City Explorer, I want to see all events in my city on a single scrollable list, so that I don't miss something interesting on a platform I don't normally check.
- **US2:** As a City Explorer, I want to filter by date, price (free/paid), category, and source platform, so that I can narrow down based on my constraints and interests.
- **US3:** As a City Explorer, I want to switch between a list view and an interactive map view, so that I can visually discover events happening near me geographically.
- **US4:** As a City Explorer, I want to open Discover Tonight to automatically see events happening today, so that I can quickly find something to do without scrolling endlessly.
- **US5:** As a City Explorer, I want to select 2–3 events and compare them side by side, so that I can quickly decide which one best fits my schedule and preferences.

### Niche Enthusiast
- **US6:** As a Niche Enthusiast, I want to search by keyword or venue name, so that I can track my particular scene across all aggregators.
- **US7:** As a Niche Enthusiast, I want to exclude a category I'm not interested in, so that my feed isn't cluttered with irrelevant events.
- **US8:** As a Niche Enthusiast, I want to set a preferred category so that Discover Tonight suggests events I actually care about.

### Event Contributor
- **US9:** As an Event Contributor, I want to manually add an event with a source URL and details, so that niche happenings reach broader discovery.

### Returning User
- **US10:** As a returning user, I want to enter my email to restore my saved city, preferences, and comparison history, so that I don't have to reconfigure everything each visit.
- **US11:** As a returning user, I want to change my email to switch to a different preference profile, so that multiple people can use the app on the same device.
- **US12:** As a returning user, I want to remove saved comparison events from my preferences page, so that I can keep my saved list relevant.

---

## 4. Design Mockups

<img width="474" height="607" alt="image" src="https://github.com/user-attachments/assets/a643139d-035c-442e-9a86-b497b93571a5" />
<img width="480" height="608" alt="image" src="https://github.com/user-attachments/assets/aa140cb4-ed89-44f7-94ca-4d4023392418" />
<img width="474" height="606" alt="image" src="https://github.com/user-attachments/assets/7d8be361-d8a8-444b-b585-8c23f9e5712c" />
<img width="484" height="614" alt="image" src="https://github.com/user-attachments/assets/1df9ed69-27b0-4e83-9e61-6530f77106a6" />

---

## 5. Work Distribution

### Danyan Gu — Events Data Layer & Discover Page
Danyan is responsible for the `event` collection and the Discover experience. This includes full CRUD operations on the events collection, the manual event submission form (Add Event), the main Discover page with both list view and interactive map view, and the search and filter functionality.

### Xing Zhou — Preferences Data Layer & Personalization Features
Xing is responsible for the `preference` collection and all personalization-driven features. This includes full CRUD operations on the preferences collection (using a user-provided email as an identifier, stored in localStorage to enable cross-session persistence without formal account creation), the Discover Tonight page (auto-loading today's events filtered by saved city and category), the multi-event side-by-side comparison module (with persistence to the database), and the preferences page (category settings, city, email switching, and saved comparison management).
