# 🎨 Design System Reference

## Color Palette

### Primary Colors
```css
--primary-blue: #3b82f6
--primary-purple: #a855f7
--gradient-primary: linear-gradient(to right, #3b82f6, #a855f7)
```

### Status Colors
```css
--success: #10b981    /* Green - Resolved, Low Risk */
--warning: #f59e0b    /* Orange - Medium, Pending */
--danger: #ef4444     /* Red - High, Escalated */
--info: #3b82f6       /* Blue - Submitted, In Progress */
--assigned: #a855f7   /* Purple - Assigned */
```

### Severity Colors
```css
--severity-low: #10b981     /* Green */
--severity-medium: #eab308  /* Yellow */
--severity-high: #ef4444    /* Red */
```

### Background Colors
```css
--dark-300: #020617   /* Main background */
--dark-200: #0f172a   /* Card background */
--dark-100: #1e293b   /* Lighter variant */
```

### Text Colors
```css
--text-primary: #f9fafb    /* White text */
--text-secondary: #9ca3af  /* Gray text */
--text-muted: #6b7280      /* Dimmed text */
```

---

## Status Badge Colors

### Complaint Status
```javascript
'Submitted'  → bg-blue-500/20 text-blue-300 border-blue-500/30
'In Review'  → bg-yellow-500/20 text-yellow-300 border-yellow-500/30
'Assigned'   → bg-purple-500/20 text-purple-300 border-purple-500/30
'Resolved'   → bg-green-500/20 text-green-300 border-green-500/30
'Escalated'  → bg-red-500/20 text-red-300 border-red-500/30 (animated)
```

### Severity Levels
```javascript
'low'    → bg-green-500/20 text-green-300 border-green-500/30
'medium' → bg-yellow-500/20 text-yellow-300 border-yellow-500/30
'high'   → bg-red-500/20 text-red-300 border-red-500/30
```

---

## Map Marker Colors

### Visual Legend
```javascript
🔴 Red    (#ef4444): Escalated complaints (>48h)
🟠 Orange (#f59e0b): High severity issues
🟡 Yellow (#eab308): Medium severity
🟢 Green  (#10b981): Low severity / Resolved
```

### Implementation
```javascript
const getMarkerColor = (complaint) => {
  if (complaint.isEscalated) return '#ef4444';  // Red
  if (complaint.severity === 'high') return '#f59e0b';  // Orange
  if (complaint.severity === 'medium') return '#eab308';  // Yellow
  return '#10b981';  // Green
};
```

---

## Glassmorphism Effects

### Base Glass
```css
.glass {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
```

### Glass Card
```css
.glass-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
}
```

### Hover States
```css
.glass-card:hover {
  background: rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}
```

---

## Typography

### Font Stack
```css
font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 
             "Segoe UI", Roboto, sans-serif;
```

### Text Sizes
```css
--text-xs: 0.75rem    /* 12px - Badges, labels */
--text-sm: 0.875rem   /* 14px - Secondary text */
--text-base: 1rem     /* 16px - Body text */
--text-lg: 1.125rem   /* 18px - Card titles */
--text-xl: 1.25rem    /* 20px - Section headers */
--text-2xl: 1.5rem    /* 24px - Page titles */
--text-3xl: 1.875rem  /* 30px - Main headings */
--text-4xl: 2.25rem   /* 36px - Hero text */
--text-5xl: 3rem      /* 48px - Large displays */
```

### Font Weights
```css
--font-normal: 400
--font-medium: 500
--font-semibold: 600
--font-bold: 700
```

---

## Spacing System

### Padding/Margin Scale
```css
--spacing-1: 0.25rem   /* 4px */
--spacing-2: 0.5rem    /* 8px */
--spacing-3: 0.75rem   /* 12px */
--spacing-4: 1rem      /* 16px */
--spacing-6: 1.5rem    /* 24px */
--spacing-8: 2rem      /* 32px */
```

### Common Usage
```css
Card padding: p-6 (24px)
Button padding: px-6 py-3 (24px horizontal, 12px vertical)
Section margin: mb-6 (24px bottom)
Grid gap: gap-6 (24px)
```

---

## Border Radius

### Sizes
```css
--rounded-lg: 8px    /* Inputs, buttons */
--rounded-xl: 12px   /* Cards */
--rounded-full: 9999px  /* Badges, avatars */
```

---

## Shadows

### Elevation
```css
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05)
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1)
--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1)
--shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.3)
```

### Usage
```css
Cards: shadow-xl
Buttons: shadow-md
Dropdowns: shadow-lg
```

---

## Gradients

### Primary Gradient
```css
.gradient-primary {
  background: linear-gradient(to right, #3b82f6, #a855f7);
}
```

### Button Hover
```css
.gradient-primary:hover {
  background: linear-gradient(to right, #2563eb, #9333ea);
}
```

### Text Gradient
```css
.text-gradient {
  background: linear-gradient(to right, #3b82f6, #a855f7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

---

## Animations

### Pulse (Escalated Badge)
```css
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.animate-pulse {
  animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
```

### Transitions
```css
.transition-all {
  transition: all 0.3s ease;
}
```

---

## Component Specific

### Risk Indicator Sizes
```javascript
sm: 'w-16 h-16 text-xs'   /* Dashboard cards */
md: 'w-24 h-24 text-sm'   /* Standard */
lg: 'w-32 h-32 text-lg'   /* Analytics */
```

### Card States
```javascript
Default:  'glass-card'
Hover:    'glass-card hover:bg-white/10'
Active:   'glass-card bg-white/10'
```

---

## Responsive Breakpoints

### Tailwind Defaults
```css
sm: 640px   /* Mobile landscape */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
2xl: 1536px /* Extra large */
```

### Grid Responsive
```css
/* Mobile: 1 column */
grid-cols-1

/* Tablet: 2 columns */
md:grid-cols-2

/* Desktop: 4 columns */
lg:grid-cols-4
```

---

## Icon System

### Sizes
```javascript
Small:  16px
Medium: 20px
Large:  24px
XL:     32px
```

### Usage
```javascript
import { Home, FileText, AlertCircle } from 'lucide-react';

<Home size={20} />
<FileText size={24} />
<AlertCircle size={16} />
```

---

## Form Elements

### Input Field
```css
.input {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 12px 16px;
  color: white;
}

.input:focus {
  outline: none;
  ring: 2px solid #3b82f6;
}
```

### Button Primary
```css
.button-primary {
  background: linear-gradient(to right, #3b82f6, #a855f7);
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
}

.button-primary:hover {
  background: linear-gradient(to right, #2563eb, #9333ea);
}
```

---

## Chart Colors

### Recharts Palette
```javascript
const chartColors = [
  '#3b82f6',  // Blue
  '#10b981',  // Green
  '#f59e0b',  // Orange
  '#ef4444',  // Red
  '#a855f7',  // Purple
  '#eab308'   // Yellow
];
```

### Usage
```javascript
<Bar dataKey="value" fill="#3b82f6" />
<Pie data={data} colors={chartColors} />
```

---

## Accessibility

### Focus States
```css
:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}
```

### Color Contrast
All text meets WCAG AA standards:
- White (#f9fafb) on Dark (#020617): AAA
- Gray (#9ca3af) on Dark (#020617): AA
- Colored text on appropriate backgrounds: AA+

---

## Category Icons

```javascript
const categoryIcons = {
  road: '🛣️',
  garbage: '🗑️',
  lighting: '💡',
  drainage: '💧'
};
```

---

## Quick Reference

### Most Used Classes
```css
/* Cards */
.glass-card

/* Buttons */
bg-gradient-to-r from-blue-500 to-purple-500

/* Text */
text-white text-gray-400 text-gray-300

/* Badges */
px-3 py-1 rounded-full text-xs font-medium

/* Layout */
flex items-center justify-between gap-4

/* Grid */
grid grid-cols-4 gap-6
```

---

## Design Principles

1. **Consistency**: Same colors for same meanings
2. **Hierarchy**: Size and color indicate importance
3. **Clarity**: High contrast, readable fonts
4. **Feedback**: Visual states for all interactions
5. **Modern**: Glassmorphism, gradients, smooth animations
6. **Professional**: Dark theme, clean layout, subtle effects

---

**Use this guide to maintain design consistency throughout development.** 🎨
