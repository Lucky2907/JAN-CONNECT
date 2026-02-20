import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Import seeding function
import { seedAllData } from './utils/seedFirestore.js'

// Seed the database on first load (REMOVE THIS AFTER FIRST RUN!)
// Uncomment the line below to populate Firestore with initial data
// seedAllData().then(() => console.log('✅ Database seeded!')).catch(err => console.error('❌ Seeding failed:', err));

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
