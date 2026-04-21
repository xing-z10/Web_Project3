# EventHub

## Author: Xing Zhou, Danyan Gu

**Live Demo** [https://eventhub-t9pe.onrender.com](https://eventhub-t9pe.onrender.com)\
**Class Link** [Course Detail](https://johnguerra.co/classes/webDevelopment_online_spring_2026/)\
**Google Slides** [Slides](https://docs.google.com/presentation/d/1CL2inyHW98prUFMSg3S5qdhAforoC7HxkRlC5PD1B90/edit?usp=sharing)\
**YouTube Link** [Video](https://youtu.be/pFrhpEZlFfI)\
**Usability Study Report** [Report1](https://docs.google.com/document/d/1FanxdaBIndjh58f6GiFP7D0LB8gmam08HAiZ6zQ8yKs/edit?usp=sharing)\
**Usability Study Report** [Report2](https://docs.google.com/document/d/1bXQ0y1ERCIb4X0NwJGoOM1Lmrmypu-Af9kinxfKQtDM/edit?usp=sharing)
---

## Description

Public events—concerts, festivals, tech meetups, museum exhibitions, farmers markets—are fragmented across dozens of platforms: Eventbrite, Meetup, Facebook Events, university calendars, and local city listings. Event seekers must manually check multiple sources, leading to missed opportunities and discovery fatigue.

EventHub is a unified event discovery platform that aggregates public events into a single searchable, filterable interface. Users register with an email and password to unlock personalization features. Browsing the event list and map is available to everyone; saving preferences, using Discover Tonight, and comparing events require an account.

The platform features an interactive map view, a randomized "Discover Tonight" recommendation engine, a side-by-side event comparison tool, and individual event detail pages—designed to transform passive browsing into active city exploration.

---

## Objectives

- Browse, search, and filter 1,000+ events by city, category, price, and date
- Interactive list view and Leaflet-powered map view with grouped city markers
- **Discover Tonight** — surfaces 3 random events today based on saved city and category preferences
- **Side-by-side comparison** — save up to 3 events and compare them in the Preferences page
- **Event Detail** — full event info page with view count tracking
- **Community submissions** — add niche events not listed on major platforms via a multi-section form
- **Account system** — email/password registration and login with 7-day session persistence

---

## Prerequisites

- [Node.js](https://nodejs.org/) v18+
- A running MongoDB instance with connection URI
- Two terminal windows (one for backend, one for frontend)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router 6, Leaflet / React Leaflet |
| Backend | Express 5, MongoDB (native driver) |
| Auth | Passport.js (local strategy), bcryptjs, express-session, connect-mongo |
| Map / Geocoding | OpenStreetMap tiles, Nominatim API |

---

## Design Mockup
<img width="976" height="623" alt="image" src="https://github.com/user-attachments/assets/d953fd47-f335-4145-9bd5-e86a34589d76" />
<img width="976" height="623" alt="image" src="https://github.com/user-attachments/assets/7d7cb2f0-23e4-4e34-b38d-222917a99872" />

---

## Screenshot
<img width="2554" height="1528" alt="image" src="https://github.com/user-attachments/assets/d262909b-6892-4d9b-8b2d-55982dc97e85" />
<img width="2552" height="1532" alt="image" src="https://github.com/user-attachments/assets/e81a3788-89b4-4244-a65e-a9b06d499c8e" />
<img width="2552" height="1530" alt="image" src="https://github.com/user-attachments/assets/f8258dae-5ff7-411f-a2dd-8a36ac4adf79" />
<img width="2548" height="1530" alt="image" src="https://github.com/user-attachments/assets/637db249-1832-44d7-a0d7-c5964d2815d4" />

---

## Project Structure

```
Web_Project3/
├── backend/
│   ├── server.js              # Express app, MongoDB connection, Passport + session setup
│   └── routes/
│       ├── auth.js            # Register, login, logout, getMe
│       ├── event.js           # Event CRUD + filtering API
│       └── preference.js      # User preference API
└── frontend/
    └── src/
        ├── App.jsx            # Routing (/, /add, /preferences, /discover-tonight, /events/:id, /auth)
        ├── pages/
        │   ├── DiscoverPage.jsx       # Main event list + map view
        │   ├── AddEventPage.jsx       # Community submission form
        │   ├── PreferencesPage.jsx    # Personalization + comparison view
        │   ├── DiscoverTonight.jsx    # Daily recommendation engine
        │   ├── EventDetailPage.jsx    # Single event detail view
        │   └── AuthPage.jsx           # Login / Register
        ├── components/
        │   ├── shared/navbar.jsx
        │   └── events/        # EventCard, EventList, EventMap, FilterBar, SearchBar
        ├── hooks/             # useEvents
        ├── services/          # eventService, preferenceService, authService
        └── styles/            # All CSS files
```

---

## Getting Started

### 1. Clone the repo

```bash
git clone <repo-url>
cd Web_Project3
```

### 2. Configure environment variables

Create a `.env` file inside the `backend/` folder:

```bash
# backend/.env
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/project3
PORT=5001
SESSION_SECRET=your_secret_here
```

### 3. Start the backend

```bash
cd backend
npm install
node server.js
```

The API will be available at `http://localhost:5001`.

### 4. Start the frontend

Open a second terminal:

```bash
cd frontend
npm install
npm start
```

The app will open at `http://localhost:3000`.

---

## Pages

| Route | Page | Description |
|-------|------|-------------|
| `/` | Discover | Event list + interactive map, search, filters, compare |
| `/events/:id` | Event Detail | Full event info, view count tracking |
| `/add` | Add Event | Community submission form |
| `/discover-tonight` | Discover Tonight | 3 random events today, respects saved preferences |
| `/preferences` | Preferences | Set city/category, manage saved comparisons |
| `/auth` | Login / Register | Email + password authentication |

---

## API Endpoints

### Auth

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Log in |
| POST | `/api/auth/logout` | Log out |
| GET | `/api/auth/me` | Get current session user |

### Events

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/events` | List events (filters: `city`, `category`, `isFree`, `dateFrom`, `dateTo`, `platform`, `tags`, `search`, `random`, `page`, `limit`) |
| GET | `/api/events/:id` | Get single event |
| POST | `/api/events` | Create event |
| PUT | `/api/events/:id` | Update event |
| DELETE | `/api/events/:id` | Delete event |
| POST | `/api/events/:id/view` | Increment view count |

### Preferences

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/preferences/:email` | Get user preferences |
| POST | `/api/preferences` | Create preferences |
| PUT | `/api/preferences/:email` | Update preferences |
| PUT | `/api/preferences/:email/comparison` | Save comparison selection |
| DELETE | `/api/preferences/:email` | Delete preferences |

---

## Team

| Member | Scope |
|--------|-------|
| Danyan Gu | Events data layer, Discover page (list + map view), Add Event form |
| Xing Zhou | Preferences data layer, Discover Tonight, comparison tool|
