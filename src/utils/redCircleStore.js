export const DEFAULT_INDIA_RED_CIRCLES = [
  {
    id: 'zone-delhi',
    name: 'Delhi Central Restricted Belt',
    reason: 'High-density civic emergency monitoring',
    latitude: 28.6139,
    longitude: 77.2090,
    radiusMeters: 180,
    nearestPoliceSubstation: 'Connaught Place Substation',
    active: true
  },
  {
    id: 'zone-mumbai',
    name: 'Mumbai Coastal Alert Zone',
    reason: 'Recurring flood and crowd-risk corridor',
    latitude: 19.0760,
    longitude: 72.8777,
    radiusMeters: 180,
    nearestPoliceSubstation: 'Marine Drive Substation',
    active: true
  },
  {
    id: 'zone-kolkata',
    name: 'Kolkata Riverside Watch Zone',
    reason: 'Critical sanitation and congestion hotspot',
    latitude: 22.5726,
    longitude: 88.3639,
    radiusMeters: 170,
    nearestPoliceSubstation: 'Lalbazar Substation',
    active: true
  },
  {
    id: 'zone-chennai',
    name: 'Chennai Storm Drain Zone',
    reason: 'Monsoon waterlogging surveillance region',
    latitude: 13.0827,
    longitude: 80.2707,
    radiusMeters: 170,
    nearestPoliceSubstation: 'Egmore Substation',
    active: true
  },
  {
    id: 'zone-bengaluru',
    name: 'Bengaluru Mobility Risk Zone',
    reason: 'Traffic and infrastructure hazard belt',
    latitude: 12.9716,
    longitude: 77.5946,
    radiusMeters: 175,
    nearestPoliceSubstation: 'Cubbon Park Substation',
    active: true
  },
  {
    id: 'zone-hyderabad',
    name: 'Hyderabad Civic Priority Zone',
    reason: 'Recurring public safety complaints',
    latitude: 17.3850,
    longitude: 78.4867,
    radiusMeters: 170,
    nearestPoliceSubstation: 'Abids Substation',
    active: true
  },
  {
    id: 'zone-ahmedabad',
    name: 'Ahmedabad Urban Response Zone',
    reason: 'Drainage and road hazard concentration',
    latitude: 23.0225,
    longitude: 72.5714,
    radiusMeters: 170,
    nearestPoliceSubstation: 'Navrangpura Substation',
    active: true
  },
  {
    id: 'zone-pune',
    name: 'Pune Service Alert Zone',
    reason: 'Streetlight and roads escalation area',
    latitude: 18.5204,
    longitude: 73.8567,
    radiusMeters: 165,
    nearestPoliceSubstation: 'Shivajinagar Substation',
    active: true
  }];

const STORAGE_KEY = 'jan-connect-red-circles';

const getStorage = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.localStorage;
};

export const getStoredRedCircles = () => {
  const storage = getStorage();
  if (!storage) {
    return [];
  }

  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed;
  } catch {
    return [];
  }
};

export const saveStoredRedCircles = (zones) => {
  const storage = getStorage();
  if (!storage) {
    return;
  }

  storage.setItem(STORAGE_KEY, JSON.stringify(zones));
};

export const getAllConfiguredRedCircles = () => {
  const stored = getStoredRedCircles();
  if (!stored.length) {
    return DEFAULT_INDIA_RED_CIRCLES;
  }

  return stored;
};

export const upsertRedCircle = (zone) => {
  const current = getAllConfiguredRedCircles();
  const index = current.findIndex((existing) => existing.id === zone.id);
  let updated = [];

  if (index === -1) {
    updated = [...current, zone];
  } else {
    updated = current.map((existing) => (existing.id === zone.id ? zone : existing));
  }

  saveStoredRedCircles(updated);
  return updated;
};

export const removeRedCircle = (zoneId) => {
  const current = getAllConfiguredRedCircles();
  const updated = current.filter((zone) => zone.id !== zoneId);
  saveStoredRedCircles(updated);
  return updated;
};

export const resetRedCirclesToDefault = () => {
  saveStoredRedCircles(DEFAULT_INDIA_RED_CIRCLES);
  return DEFAULT_INDIA_RED_CIRCLES;
};
