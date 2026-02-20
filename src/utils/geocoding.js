/**
 * Nominatim Geocoding Service
 * Free OpenStreetMap geocoding API
 * 
 * Features:
 * - Address to coordinates (geocoding)
 * - Coordinates to address (reverse geocoding)
 * - Place search
 */

const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org';

// Rate limiting: Max 1 request per second
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 1000;

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const ensureRateLimit = async () => {
  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
    await delay(MIN_REQUEST_INTERVAL - timeSinceLastRequest);
  }
  
  lastRequestTime = Date.now();
};

/**
 * Search for a location by address/place name
 * @param {string} query - Search query (e.g., "Main Street, Delhi")
 * @param {number} limit - Maximum number of results (default: 5)
 * @returns {Promise<Array>} Array of location results
 */
export const searchAddress = async (query, limit = 5) => {
  if (!query || query.trim().length < 3) {
    return [];
  }

  try {
    await ensureRateLimit();

    const params = new URLSearchParams({
      q: query,
      format: 'json',
      limit: limit.toString(),
      addressdetails: '1',
      countrycodes: 'in', // Restrict to India, change as needed
    });

    const response = await fetch(`${NOMINATIM_BASE_URL}/search?${params}`, {
      headers: {
        'User-Agent': 'SmartCityPortal/1.0' // Required by Nominatim
      }
    });

    if (!response.ok) {
      throw new Error(`Geocoding failed: ${response.status}`);
    }

    const data = await response.json();

    return data.map(item => ({
      id: item.place_id,
      displayName: item.display_name,
      address: item.address,
      latitude: parseFloat(item.lat),
      longitude: parseFloat(item.lon),
      type: item.type,
      importance: item.importance,
      boundingBox: item.boundingbox
    }));
  } catch (error) {
    console.error('Error searching address:', error);
    return [];
  }
};

/**
 * Get address details from coordinates (reverse geocoding)
 * @param {number} latitude - Latitude
 * @param {number} longitude - Longitude
 * @returns {Promise<Object|null>} Address details
 */
export const reverseGeocode = async (latitude, longitude) => {
  try {
    await ensureRateLimit();

    const params = new URLSearchParams({
      lat: latitude.toString(),
      lon: longitude.toString(),
      format: 'json',
      addressdetails: '1',
      zoom: '18' // Higher zoom = more detailed address
    });

    const response = await fetch(`${NOMINATIM_BASE_URL}/reverse?${params}`, {
      headers: {
        'User-Agent': 'SmartCityPortal/1.0'
      }
    });

    if (!response.ok) {
      throw new Error(`Reverse geocoding failed: ${response.status}`);
    }

    const data = await response.json();

    if (data.error) {
      console.error('Reverse geocoding error:', data.error);
      return null;
    }

    return {
      displayName: data.display_name,
      address: {
        road: data.address?.road || '',
        neighbourhood: data.address?.neighbourhood || '',
        suburb: data.address?.suburb || '',
        city: data.address?.city || data.address?.town || data.address?.village || '',
        state: data.address?.state || '',
        postcode: data.address?.postcode || '',
        country: data.address?.country || ''
      },
      formattedAddress: formatAddress(data.address),
      latitude: parseFloat(data.lat),
      longitude: parseFloat(data.lon)
    };
  } catch (error) {
    console.error('Error in reverse geocoding:', error);
    return null;
  }
};

/**
 * Format address object into readable string
 * @param {Object} address - Address object from Nominatim
 * @returns {string} Formatted address
 */
const formatAddress = (address) => {
  if (!address) return '';

  const parts = [];

  if (address.road) parts.push(address.road);
  if (address.neighbourhood) parts.push(address.neighbourhood);
  if (address.suburb) parts.push(address.suburb);
  if (address.city || address.town || address.village) {
    parts.push(address.city || address.town || address.village);
  }
  if (address.state) parts.push(address.state);
  if (address.postcode) parts.push(address.postcode);

  return parts.join(', ');
};

/**
 * Search nearby places (e.g., landmarks, streets)
 * @param {number} latitude - Center latitude
 * @param {number} longitude - Center longitude
 * @param {string} query - Search query
 * @returns {Promise<Array>} Nearby places
 */
export const searchNearby = async (latitude, longitude, query = '') => {
  try {
    await ensureRateLimit();

    const searchQuery = query 
      ? `${query} near ${latitude},${longitude}`
      : `${latitude},${longitude}`;

    const params = new URLSearchParams({
      q: searchQuery,
      format: 'json',
      limit: '10',
      addressdetails: '1',
      bounded: '1',
      viewbox: `${longitude - 0.01},${latitude - 0.01},${longitude + 0.01},${latitude + 0.01}`
    });

    const response = await fetch(`${NOMINATIM_BASE_URL}/search?${params}`, {
      headers: {
        'User-Agent': 'SmartCityPortal/1.0'
      }
    });

    if (!response.ok) {
      throw new Error(`Nearby search failed: ${response.status}`);
    }

    const data = await response.json();

    return data.map(item => ({
      id: item.place_id,
      displayName: item.display_name,
      latitude: parseFloat(item.lat),
      longitude: parseFloat(item.lon),
      type: item.type,
      distance: calculateDistance(
        latitude,
        longitude,
        parseFloat(item.lat),
        parseFloat(item.lon)
      )
    }));
  } catch (error) {
    console.error('Error searching nearby:', error);
    return [];
  }
};

/**
 * Calculate distance between two points (Haversine formula)
 * @param {number} lat1 - First latitude
 * @param {number} lon1 - First longitude
 * @param {number} lat2 - Second latitude
 * @param {number} lon2 - Second longitude
 * @returns {number} Distance in meters
 */
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // Earth radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

/**
 * Get current location using browser geolocation
 * @returns {Promise<Object>} Current location coordinates
 */
export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  });
};

export default {
  searchAddress,
  reverseGeocode,
  searchNearby,
  getCurrentLocation,
  formatAddress
};
