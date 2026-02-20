export const mockComplaints = [
  {
    id: 1,
    title: "Pothole on Main Street",
    description: "Large pothole causing traffic issues",
    category: "road",
    severity: "high",
    status: "Resolved",
    latitude: 28.6139,
    longitude: 77.2090,
    citizenName: "Rahul Sharma",
    citizenId: "CIT001",
    createdAt: "2026-02-15T10:30:00",
    resolvedAt: "2026-02-18T14:30:00",
    assignedDepartment: "Roads & Transport",
    imageUrl: null,
    duplicateCount: 2,
    upvotes: 3,
    upvotedBy: ["CIT002", "CIT003", "CIT004"]
  },
  {
    id: 2,
    title: "Garbage accumulation near park",
    description: "Overflowing bins not cleared for 3 days",
    category: "garbage",
    severity: "medium",
    status: "Assigned",
    latitude: 28.6129,
    longitude: 77.2295,
    citizenName: "Priya Gupta",
    citizenId: "CIT002",
    createdAt: "2026-02-17T08:00:00",
    resolvedAt: null,
    assignedDepartment: "Sanitation",
    imageUrl: null,
    duplicateCount: 0,
    upvotes: 1,
    upvotedBy: ["CIT002"]
  },
  {
    id: 3,
    title: "Street light not working",
    description: "Dark spot creating safety concerns",
    category: "lighting",
    severity: "high",
    status: "In Review",
    latitude: 28.6219,
    longitude: 77.2190,
    citizenName: "Amit Kumar",
    citizenId: "CIT003",
    createdAt: "2026-02-16T20:00:00",
    resolvedAt: null,
    assignedDepartment: "Electricity",
    imageUrl: null,
    duplicateCount: 1,
    upvotes: 2,
    upvotedBy: ["CIT003", "CIT005"]
  },
  {
    id: 4,
    title: "Blocked drainage system",
    description: "Water logging during rain",
    category: "drainage",
    severity: "high",
    status: "Submitted",
    latitude: 28.6339,
    longitude: 77.2190,
    citizenName: "Sneha Patel",
    citizenId: "CIT004",
    createdAt: "2026-02-18T12:00:00",
    resolvedAt: null,
    assignedDepartment: "Water & Drainage",
    imageUrl: null,
    duplicateCount: 0,
    upvotes: 1,
    upvotedBy: ["CIT004"]
  },
  {
    id: 5,
    title: "Road construction debris left on street",
    description: "Construction materials blocking footpath",
    category: "road",
    severity: "medium",
    status: "Assigned",
    latitude: 28.6439,
    longitude: 77.2290,
    citizenName: "Vikram Singh",
    citizenId: "CIT005",
    createdAt: "2026-02-19T09:30:00",
    resolvedAt: null,
    assignedDepartment: "Roads & Transport",
    imageUrl: null,
    duplicateCount: 0,
    upvotes: 0,
    upvotedBy: []
  },
  {
    id: 6,
    title: "Illegal dumping near residential area",
    description: "Medical waste dumped in open area",
    category: "garbage",
    severity: "high",
    status: "In Review",
    latitude: 28.6539,
    longitude: 77.2390,
    citizenName: "Anjali Mehta",
    citizenId: "CIT006",
    createdAt: "2026-02-14T15:00:00",
    resolvedAt: null,
    assignedDepartment: "Sanitation",
    imageUrl: null,
    duplicateCount: 0,
    upvotes: 0,
    upvotedBy: []
  },
  {
    id: 7,
    title: "Multiple potholes on highway connector",
    description: "Dangerous road condition",
    category: "road",
    severity: "high",
    status: "Submitted",
    latitude: 28.6639,
    longitude: 77.2490,
    citizenName: "Rajesh Verma",
    citizenId: "CIT007",
    createdAt: "2026-02-20T07:00:00",
    resolvedAt: null,
    assignedDepartment: "Roads & Transport",
    imageUrl: null,
    duplicateCount: 0,
    upvotes: 0,
    upvotedBy: []
  },
  {
    id: 8,
    title: "Broken manhole cover",
    description: "Safety hazard for vehicles and pedestrians",
    category: "drainage",
    severity: "high",
    status: "Resolved",
    latitude: 28.6239,
    longitude: 77.2590,
    citizenName: "Deepak Joshi",
    citizenId: "CIT008",
    createdAt: "2026-02-13T11:00:00",
    resolvedAt: "2026-02-16T10:00:00",
    assignedDepartment: "Water & Drainage",
    imageUrl: null,
    duplicateCount: 1,
    upvotes: 2,
    upvotedBy: ["CIT008", "CIT001"]
  }
];

export const mockUsers = [
  {
    id: "user1",
    name: "Citizen User",
    email: "citizen@demo.com",
    role: "citizen",
    citizenId: "CIT009"
  },
  {
    id: "admin1",
    name: "Admin User",
    email: "admin@demo.com",
    role: "admin",
    department: "Municipal Control"
  }
];

export const categories = [
  { value: 'road', label: 'Roads & Transport', icon: '🛣️' },
  { value: 'garbage', label: 'Sanitation', icon: '🗑️' },
  { value: 'lighting', label: 'Electricity', icon: '💡' },
  { value: 'drainage', label: 'Water & Drainage', icon: '💧' }
];

export const departments = [
  'Roads & Transport',
  'Sanitation',
  'Electricity',
  'Water & Drainage'
];

export const statusOptions = [
  'Submitted',
  'In Review',
  'Assigned',
  'Resolved'
];
