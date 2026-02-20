# 🏙️ JAN CONNECT - Intelligence & Accountability Portal

A governance-grade geo-enabled public issue reporting and resolution system with multi-language support (English, Hindi, Marathi).

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://vega-caf5c.web.app)
[![GitHub](https://img.shields.io/badge/github-Lucky2907%2FJAN--CONNECT-blue)](https://github.com/Lucky2907/JAN-CONNECT)
[![Firebase](https://img.shields.io/badge/Firebase-Deployed-orange)](https://vega-caf5c.firebaseapp.com)

**🔗 Live Demo**: [https://vega-caf5c.web.app](https://vega-caf5c.web.app)  
**📦 Repository**: [https://github.com/Lucky2907/JAN-CONNECT](https://github.com/Lucky2907/JAN-CONNECT)

## 🚀 Features

### Core Features
- **Multi-Language Support** 🌍 - English, Hindi (हिंदी), Marathi (मराठी)
- **Role-Based Authentication** (Citizen & Admin)
- **Geo-Enabled Complaint Submission** with interactive map
- **Real-Time Status Tracking** with Firebase Firestore
- **Duplicate Detection & Auto-Upvoting** within 100m radius
- **Interactive Map View** with cluster markers and area-based viewing
- **Multi-Stage Status Management**
- **Auto-Remove Resolved Complaints** from map view

### Advanced Features
- **Civic Risk Index Engine** - Calculates risk scores based on unresolved complaints, severity, and area density
- **Similar Complaints Detection** - Smart upvote system for nearby identical issues
- **Department Performance Analytics** - Resolution time, SLA breach %, resolution rate
- **Auto-Escalation Engine** - Complaints unresolved > 48 hours auto-escalate
- **Public Transparency Dashboard** - Real-time civic metrics for citizens
- **Area-Based Complaint Viewing** - Admin can view all complaints in a 500m radius
- **Firebase Real-Time Sync** - Live updates across all users
- **Premium Animations** - Framer Motion with smooth transitions
- **Dark/Light Theme** with auto-hide status indicators

## 🛠️ Tech Stack

- **Framework**: React 18 with Vite
- **Styling**: Tailwind CSS with glassmorphism design
- **Database**: Firebase Firestore (Real-time NoSQL)
- **Hosting**: Firebase Hosting
- **Routing**: React Router v6
- **Maps**: React Leaflet (OpenStreetMap) + Marker Clustering
- **Charts**: Recharts
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **State**: Context API
- **i18n**: Custom translation system (EN/HI/MR)

## 📦 Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🔐 Demo Accounts

### Citizen Account
- **Email**: citizen@demo.com
- **Password**: demo123

### Admin Account
- **Email**: admin@demo.com
- **Password**: demo123

## 📁 Project Structure

```
src/
├── components/         # Reusable UI components
│   ├── AddressSearch.jsx
│   ├── AnalyticsChart.jsx
│   ├── Animations.jsx
│   ├── ComplaintCard.jsx
│   ├── GlassCard.jsx
│   ├── LanguageSwitcher.jsx
│   ├── Layout.jsx
│   ├── LoadingShimmer.jsx
│   ├── MapView.jsx
│   ├── MetricCard.jsx
│   ├── MotionWrapper.jsx
│   ├── Navbar.jsx
│   ├── ProtectedRoute.jsx
│   ├── RealtimeStatus.jsx
│   ├── RiskIndicator.jsx
│   ├── Sidebar.jsx
│   ├── StatusBadge.jsx
│   └── ThemeToggle.jsx
├── context/           # Global state management
│   ├── AppContext.jsx
│   └── ThemeContext.jsx
├── contexts/          # Additional contexts
│   └── LanguageContext.jsx
├── config/            # Configuration
│   └── firebase.js
├── data/              # Mock data
│   └── mockData.js
├── locales/           # Translations
│   └── translations.json
├── pages/             # Page components
│   ├── AdminAnalytics.jsx
│   ├── AdminComplaints.jsx
│   ├── AdminDashboard.jsx
│   ├── AdminMapView.jsx
│   ├── Dashboard.jsx
│   ├── Login.jsx
│   ├── MyComplaints.jsx
│   ├── PublicDashboard.jsx
│   └── SubmitComplaint.jsx
├── utils/             # Helper functions
│   ├── calculations.js
│   └── firestoreService.js
├── App.jsx
├── main.jsx
└── index.css
```

## 🎯 Key Algorithms

### 1. Haversine Distance Calculation
```javascript
haversineDistance(lat1, lon1, lat2, lon2)
```
Calculates distance between two geographic coordinates in meters.

### 2. Risk Score Calculation
```javascript
riskScore = unresolved_count × severity_weight × area_density
```
- High Risk: > 20
- Medium Risk: 10-20
- Low Risk: < 10

### 3. Duplicate Detection
Detects complaints within 300m radius with same category.

### 4. Auto-Escalation
Complaints unresolved > 48 hours are automatically escalated.

## 🎨 Design Features

- **Dark/Light Theme Toggle** with glassmorphism effects
- **Multi-Language UI** - Switch between English, Hindi, Marathi
- **Responsive Layout** for all screen sizes
- **Color-Coded Severity** badges (Low/Medium/High)
- **Premium Animations** with Framer Motion (FadeIn, SlideIn, ScaleIn, PulseGlow)
- **Loading Shimmer** effects for better UX
- **Interactive Map** with colored markers and clustering
- **Real-Time Updates** with Firebase
- **Auto-Hide Status Indicators** (5-second fade-out)
- **Animated Counters** and smooth transitions
- **Gradient Status Badges** with pulse animations

## 📊 Analytics Dashboard

### Department Metrics
- Average resolution time
- SLA breach percentage
- Resolution rate
- Total complaints vs resolved

### Public Dashboard
- Total complaints
- Resolution percentage
- High-risk wards
- Most common issue
- Weekly trends

## 🗺️ Map Features

- **Cluster Markers** for better visualization
- **Color-Coded Pins**:
  - 🔴 Red: Escalated
  - 🟠 Orange: High severity
  - 🟡 Yellow: Medium severity
  - 🟢 Green: Low severity
- **Interactive Popups** with complaint details
- **Location Selection** during submission

## 🏆 Key Features

1. **Civic Risk Index** - Unique scoring algorithm for priority management
2. **Smart Duplicate Detection** - Auto-upvote similar complaints within 100m
3. **Auto-Escalation Engine** - Time-based priority management (>48 hours)
4. **Multi-Language Support** - 3 languages (English, Hindi, Marathi)
5. **Area-Based Viewing** - Admin can see all complaints in 500m radius
6. **Public Transparency Dashboard** - Citizens can view city-wide data
7. **Department Scorecard** - Performance tracking with SLA metrics
8. **Firebase Real-Time Sync** - Live updates across all users
9. **Glassmorphism + Animations** - Modern, professional UI/UX
10. **Smart Clustering** - Better map visualization with react-leaflet-cluster

## 📈 Future Enhancements

- WhatsApp/SMS notifications via Twilio
- Mobile app (React Native)
- AI-powered complaint categorization with NLP
- Image recognition to detect complaint type
- Predictive maintenance algorithms
- Image upload to Firebase Storage
- Advanced heat map visualizations
- IoT sensor integration for smart bins/street lights
- Blockchain for immutable audit trails
- Multi-city deployment with white-label solution

## 🚀 Deployment

### Firebase Hosting (Recommended)

Quick deploy to Firebase:

```bash
# 1. Install Firebase CLI
npm install -g firebase-tools

# 2. Login to Firebase
firebase login

# 3. Update .firebaserc with your project ID

# 4. Build and deploy
npm run deploy:hosting
```

Your app will be live at: `https://YOUR-PROJECT-ID.web.app`

📖 **Detailed Guide**: See [FIREBASE_HOSTING.md](FIREBASE_HOSTING.md) for complete deployment instructions.

📝 **Quick Commands**: See [DEPLOY_COMMANDS.md](DEPLOY_COMMANDS.md) for quick reference.

### Other Options
- Vercel, Netlify, GitHub Pages
- See [DEPLOYMENT.md](DEPLOYMENT.md) for all options

## 🤝 Contributing

This is a hackathon project. Feel free to fork and enhance!

## 📄 License

MIT License - Free to use for educational purposes.

---

**Built with ❤️ for Smart City Governance**
