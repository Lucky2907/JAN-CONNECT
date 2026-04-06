# JAN CONNECT

Smart City Intelligence & Accountability Engine. This README now consolidates the key documentation so the repository can stay focused and minimal.

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://vega-caf5c.web.app)
[![GitHub](https://img.shields.io/badge/github-Lucky2907%2FJAN--CONNECT-blue)](https://github.com/Lucky2907/JAN-CONNECT)
[![Firebase](https://img.shields.io/badge/Firebase-Deployed-orange)](https://vega-caf5c.firebaseapp.com)

Live demo: https://vega-caf5c.web.app
Repository: https://github.com/Lucky2907/JAN-CONNECT

## Overview

JAN CONNECT is a geo-enabled complaint reporting and resolution portal for civic accountability. It combines citizen reporting, admin workflows, map-based triage, analytics, and a civic risk engine for priority management.

## Highlights

- Multi-language support: English, Hindi, Marathi
- Citizen and admin roles with protected routing
- Geo-enabled complaint submission with map selection
- Duplicate detection within a 300m radius
- Auto-upvote and complaint merging for nearby duplicates
- Civic Risk Index for priority scoring
- Auto-escalation for complaints unresolved beyond 48 hours
- Interactive admin map with cluster markers and area review
- Public transparency dashboard with civic metrics
- Firebase Firestore real-time sync support
- Glassmorphism UI with Framer Motion animations

## Tech Stack

- React 18 + Vite
- Tailwind CSS
- React Router v6
- Firebase Firestore and Hosting
- React Leaflet + Leaflet clustering
- Recharts
- Framer Motion
- Lucide React
- Context API

## Quick Start

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
```

If dependency resolution fails:

```bash
npm install --legacy-peer-deps
```

## Demo Accounts

Citizen:

- Email: citizen@demo.com
- Password: demo123

Admin:

- Email: admin@demo.com
- Password: demo123

## Demo Flow

Citizen flow:

1. Log in as citizen
2. Open dashboard
3. Submit a complaint with location and photo
4. Check duplicate warning if a nearby complaint exists
5. View your complaints and public dashboard

Admin flow:

1. Log in as admin
2. Review dashboard metrics
3. Open the map and inspect markers
4. Update complaint status
5. Review analytics and department scorecards

## Core Features

### Citizen Experience

- Complaint submission with category, severity, and location
- Image upload UI with forensic checks in the original product flow
- Complaint tracking and status visibility
- Public dashboard for city-wide transparency

### Admin Experience

- Complaint management with filters and search
- Interactive map view with color-coded markers
- Complaint detail cards and status updates
- Analytics dashboard for department performance
- Red circle and geofence management for restricted areas

## Core Algorithms

### Haversine Distance

Used to measure distance between complaint locations and detect nearby duplicates.

### Duplicate Detection

Complaints in the same category within 300m are flagged as similar and merged into the same issue stream.

### Civic Risk Index

Risk is based on unresolved complaints, severity weight, and area density.

```text
Risk Score = unresolved_count × severity_weight × area_density
```

Severity weighting:

- High = 3
- Medium = 2
- Low = 1

Thresholds:

- High risk: above 20
- Medium risk: 10 to 20
- Low risk: below 10

### Auto-Escalation

Complaints older than 48 hours and still unresolved are escalated automatically.

### Department Metrics

The analytics layer tracks resolution rate, average resolution time, SLA breach percentage, and total cases per department.

## UI and Design System

The design language uses a glassmorphism dashboard style with layered depth, soft shadows, gradient accents, and motion-based feedback.

- Primary accent palette centers on blue and violet gradients
- Status colors are mapped consistently across badges, maps, and analytics
- Cards use blur, transparency, rounded corners, and hover lift
- Motion is used for page transitions, counters, and status emphasis
- Layout is responsive and tuned for both desktop and mobile

## Project Structure

```text
src/
  components/    reusable UI building blocks
  config/        Firebase setup
  context/       app state and theme state
  contexts/      language support
  data/          mock data
  hooks/         custom hooks
  locales/       translations
  pages/         citizen and admin screens
  utils/         algorithms and service helpers
```

## Firebase Setup

Firebase is used for Firestore and hosting support in the original project configuration.

Important notes:

- Firestore writes require authenticated users in production rules
- Mock login is not Firebase Auth
- The local fallback path should remain in place for complaint submission when Firestore writes fail

Typical setup steps:

```bash
npm install -g firebase-tools
firebase login
npm run build
npm run deploy:hosting
```

## Deployment

Primary deployment target is Firebase Hosting.

Common commands:

```bash
npm run deploy
npm run deploy:hosting
npm run deploy:firestore
```

For a manual Firebase deploy:

```bash
firebase deploy
```

## Migration Tool

The repository includes a migration tool for seeding mock complaint data into Firestore.

- Adds sample complaint records
- Optionally clears and replaces existing complaint documents
- Verifies the imported data after migration

## Presentation Summary

The original presentation material boiled down to this pitch:

- Problem: civic complaints are fragmented, slow, and hard to track
- Solution: a transparent, geo-aware complaint and accountability engine
- Differentiator: civic risk scoring, duplicate detection, auto-escalation, and analytics
- Value: faster response, fewer duplicates, and better public trust

## Checklist Snapshot

The pre-demo checklist covered:

- Dev server validation
- Citizen and admin login flows
- Complaint submission and duplicate detection
- Map rendering and status updates
- Analytics and dashboard verification
- UI responsiveness and animation checks

## Future Roadmap

- Mobile app
- AI complaint categorization
- SMS and email notifications
- Cloud image storage
- Predictive analytics
- Multi-city rollout

## License

MIT License

Built for Smart City Governance.
