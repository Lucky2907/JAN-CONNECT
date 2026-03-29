import { haversineDistance } from './calculations';
import { getAllConfiguredRedCircles } from './redCircleStore';

const roundMeters = (value) => Math.max(0, Math.round(value));

const getNearestZone = (citizenCoords, zones) => {
  let nearest = null;

  zones.forEach((zone) => {
    const centerDistance = haversineDistance(
      citizenCoords.latitude,
      citizenCoords.longitude,
      zone.latitude,
      zone.longitude
    );

    const distanceToEdge = centerDistance - zone.radiusMeters;

    if (!nearest || distanceToEdge < nearest.distanceToEdge) {
      nearest = {
        zone,
        centerDistance,
        distanceToEdge
      };
    }
  });

  return nearest;
};

export const buildActiveRedCircles = (complaints) => {
  const configuredZones = getAllConfiguredRedCircles().filter((zone) => zone.active !== false);

  const complaintZones = complaints
    .filter((complaint) => complaint.status !== 'Resolved' && (complaint.severity === 'high' || complaint.isEscalated))
    .slice(0, 6)
    .map((complaint, index) => ({
      id: `complaint-${complaint.id}`,
      name: `Complaint Red Circle ${index + 1}`,
      reason: complaint.title,
      latitude: complaint.latitude,
      longitude: complaint.longitude,
      radiusMeters: complaint.isEscalated ? 220 : 160,
      nearestPoliceSubstation: complaint.nearestPoliceSubstation || 'Central Substation',
      active: true
    }));

  const merged = [...configuredZones, ...complaintZones];

  if (!merged.length) {
    return configuredZones;
  }

  return merged;
};

export const evaluateRedCircleGeofence = (citizenCoords, activeRedCircles, options = {}) => {
  const zones = Array.isArray(activeRedCircles) ? activeRedCircles : [];
  const previousStatusByZone = options.previousStatusByZone || {};
  const timestamp = options.timestamp || new Date().toISOString();
  const defaultSubstation = options.defaultPoliceSubstation || 'Central Substation';

  if (!zones.length) {
    return {
      status: 'SAFE',
      zone_name: '',
      distance_to_nearest_zone_meters: 0,
      action: 'NONE',
      citizen_message: 'You are in a safe area.',
      sms_to_police: '',
      log_entry: `[${timestamp}] SAFE - no active red circles for ${citizenCoords.latitude},${citizenCoords.longitude}`
    };
  }

  const nearest = getNearestZone(citizenCoords, zones);
  const nearestZone = nearest.zone;
  const insideZone = nearest.centerDistance <= nearestZone.radiusMeters;
  const nearEdge = !insideZone && nearest.distanceToEdge <= 80;

  let status = 'SAFE';
  if (insideZone) {
    status = 'BREACH';
  } else if (nearEdge) {
    status = 'WARNING';
  }

  let action = 'NONE';
  const previousStatus = previousStatusByZone[nearestZone.name];
  const isEntryEvent = previousStatus !== status;

  if (status === 'BREACH' && isEntryEvent) {
    action = 'TRIGGER_SOS';
  } else if (status === 'WARNING' && isEntryEvent) {
    action = 'PUSH_NOTIFICATION';
  }

  const nearestSubstation = nearestZone.nearestPoliceSubstation || defaultSubstation;
  const smsToPolice = action === 'TRIGGER_SOS'
    ? `BREACH ALERT | Zone: ${nearestZone.name} | Coords: ${citizenCoords.latitude}, ${citizenCoords.longitude} | Time: ${timestamp} | Substation: ${nearestSubstation}`
    : '';

  const citizenMessage = status === 'SAFE'
    ? 'You are in a safe area.'
    : 'You are entering a restricted area, please move back.';

  return {
    status,
    zone_name: status === 'SAFE' ? '' : nearestZone.name,
    distance_to_nearest_zone_meters: roundMeters(nearest.distanceToEdge),
    action,
    citizen_message: citizenMessage,
    sms_to_police: smsToPolice,
    log_entry: `[${timestamp}] ${status} | zone=${nearestZone.name} | dist=${roundMeters(nearest.distanceToEdge)}m | coords=${citizenCoords.latitude},${citizenCoords.longitude}`
  };
};
