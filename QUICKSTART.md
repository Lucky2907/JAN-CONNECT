# 🎯 Quick Start Guide

## Getting Started

Your Smart City Intelligence Portal is now running!

**Development Server**: http://localhost:3000/

## Demo Accounts

### 👤 Citizen Login
- **Email**: `citizen@demo.com`
- **Password**: `demo123`

**Features**:
- Submit new complaints
- Track your complaints
- View public dashboard
- See duplicate complaints nearby

### 🛡️ Admin Login
- **Email**: `admin@demo.com`
- **Password**: `demo123`

**Features**:
- View all complaints on interactive map
- Update complaint status
- View advanced analytics
- Department performance metrics
- Risk scoring dashboard

## Key Features to Demo

### 1. Complaint Submission (Citizen)
1. Login as citizen
2. Click "Submit New Complaint"
3. Fill in details with geolocation
4. System detects duplicates within 300m
5. Auto-assigns to department

### 2. Interactive Map (Admin)
1. Login as admin
2. Go to "Map View"
3. See color-coded markers:
   - 🔴 Red = Escalated
   - 🟠 Orange = High Severity
   - 🟡 Yellow = Medium Severity
   - 🟢 Green = Low Severity
4. Click markers to see details
5. Update status directly from map

### 3. Risk Scoring Engine
- **Civic Risk Index** calculated as:
  ```
  Risk Score = unresolved_count × severity_weight × area_density
  ```
- Shows High/Medium/Low risk zones
- Updates in real-time

### 4. Analytics Dashboard (Admin)
- Department performance scorecards
- Resolution time tracking
- SLA breach monitoring
- Category distribution
- Weekly trends

### 5. Public Transparency Dashboard
- Citizens can see city-wide statistics
- Resolution rates
- Response times by department
- Satisfaction metrics

## Hackathon Winning Points

✅ **Civic Risk Index** - Unique algorithm for zone assessment
✅ **Duplicate Detection** - Haversine formula (300m radius)
✅ **Auto-Escalation** - Smart priority after 48 hours
✅ **Department Scorecard** - Real performance metrics
✅ **Glassmorphism UI** - Modern, professional design
✅ **Public Transparency** - Open data access
✅ **Geo-Enabled** - Full map integration
✅ **Role-Based Access** - Secure authentication

## Architecture Highlights

### Utility Functions
- `haversineDistance()` - Geographic distance calculation
- `calculateRiskScore()` - Multi-factor risk assessment
- `detectDuplicateComplaints()` - Location-based duplicate detection
- `checkEscalation()` - Time-based auto-escalation
- `calculateDepartmentMetrics()` - Performance analytics

### Components
- `MapView` - Interactive Leaflet map
- `ComplaintCard` - Reusable issue display
- `RiskIndicator` - Visual risk scoring
- `AnalyticsChart` - Recharts integration
- `StatusBadge` - Dynamic status display

## Testing Scenarios

### Scenario 1: Duplicate Detection
1. Login as citizen
2. Submit complaint at location (28.6139, 77.2090)
3. Try submitting another nearby complaint
4. System warns about duplicates

### Scenario 2: Escalation
1. Admin views complaints > 48 hours old
2. See red "🚨 Escalated" badge
3. Priority automatically increased

### Scenario 3: Department Performance
1. Admin → Analytics
2. View department scorecards
3. See resolution rates, avg times, SLA breaches
4. Compare department efficiency

## Customization

### Colors (tailwind.config.js)
```javascript
colors: {
  primary: '#3b82f6',
  danger: '#ef4444',
  success: '#10b981',
  warning: '#f59e0b'
}
```

### Mock Data (src/data/mockData.js)
- Add more complaints
- Create new categories
- Modify departments

### Risk Thresholds (src/utils/calculations.js)
```javascript
// Modify risk levels
if (score > 20) return 'high';
if (score > 10) return 'medium';
return 'low';
```

## Presentation Tips

1. **Start with Login** - Show both roles
2. **Demo Citizen Flow** - Submit → Track → View Public
3. **Switch to Admin** - Show map, update status
4. **Highlight Risk Engine** - Explain algorithm
5. **Show Analytics** - Department performance
6. **Emphasize Transparency** - Public dashboard

## Common Issues

### Port Already in Use
```bash
# Kill process on port 3000
npx kill-port 3000
npm run dev
```

### Dependencies Issue
```bash
npm install --legacy-peer-deps
```

## Next Steps for Production

- [ ] Connect to real backend API
- [ ] Add image upload to cloud storage
- [ ] Implement SMS/Email notifications
- [ ] Add AI-powered categorization
- [ ] Multi-language support
- [ ] Mobile app version
- [ ] Real-time WebSocket updates

---

**🏆 Built for WD-04 Hackathon**
**Smart City Intelligence & Accountability Engine**
