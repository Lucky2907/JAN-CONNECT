import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useMemo, memo, useState } from 'react';
import { motion } from 'framer-motion';
import MarkerClusterGroup from 'react-leaflet-cluster';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Memoize icon creation to avoid recreating on every render
const iconCache = new Map();

const createColoredIcon = (color, glowClass = '') => {
  const cacheKey = `${color}-${glowClass}`;
  if (iconCache.has(cacheKey)) {
    return iconCache.get(cacheKey);
  }
  
  const icon = L.divIcon({
    className: 'custom-marker',
    html: `<div class="${glowClass}" style="background-color: ${color}; width: 28px; height: 28px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.4);"></div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
  
  iconCache.set(cacheKey, icon);
  return icon;
};

const MapUpdater = ({ center }) => {
  const map = useMap();
  
  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);
  
  return null;
};

// Memoized marker component for better performance
const ComplaintMarker = memo(({ complaint, onMarkerClick }) => {
  const getMarkerColor = (complaint) => {
    if (complaint.isEscalated) return '#ef4444';
    if (complaint.severity === 'high') return '#f59e0b';
    if (complaint.severity === 'medium') return '#eab308';
    return '#10b981';
  };

  const getMarkerGlowClass = (complaint) => {
    const daysSinceCreated = Math.floor((new Date() - new Date(complaint.createdAt)) / (1000 * 60 * 60 * 24));
    let riskScore = 0;
    
    if (complaint.isEscalated) riskScore += 50;
    if (complaint.severity === 'high') riskScore += 30;
    else if (complaint.severity === 'medium') riskScore += 15;
    if (daysSinceCreated > 7) riskScore += 20;
    if (daysSinceCreated > 14) riskScore += 30;
    
    if (riskScore >= 60) return 'marker-glow-high';
    if (riskScore >= 30) return 'marker-glow-medium';
    return 'marker-glow-low';
  };

  const icon = useMemo(
    () => createColoredIcon(getMarkerColor(complaint), getMarkerGlowClass(complaint)),
    [complaint.severity, complaint.isEscalated, complaint.createdAt]
  );

  return (
    <Marker
      position={[complaint.latitude, complaint.longitude]}
      icon={icon}
      eventHandlers={{
        click: () => onMarkerClick && onMarkerClick(complaint)
      }}
    >
      <Popup>
        <div className="text-gray-900 max-w-xs">
          <h3 className="font-bold mb-1 text-base">{complaint.title}</h3>
          <p className="text-sm mb-2 line-clamp-2">{complaint.description}</p>
          <div className="text-xs space-y-1">
            <p><strong>Status:</strong> {complaint.status}</p>
            <p><strong>Severity:</strong> <span className={`font-semibold ${
              complaint.severity === 'high' ? 'text-red-600' :
              complaint.severity === 'medium' ? 'text-yellow-600' : 'text-green-600'
            }`}>{complaint.severity.toUpperCase()}</span></p>
            <p><strong>Category:</strong> {complaint.category}</p>
          </div>
        </div>
      </Popup>
    </Marker>
  );
}, (prevProps, nextProps) => {
  // Custom comparison for better performance
  return (
    prevProps.complaint.id === nextProps.complaint.id &&
    prevProps.complaint.status === nextProps.complaint.status &&
    prevProps.complaint.severity === nextProps.complaint.severity &&
    prevProps.complaint.isEscalated === nextProps.complaint.isEscalated
  );
});

ComplaintMarker.displayName = 'ComplaintMarker';

const MapView = ({ complaints, center = [28.6139, 77.2090], zoom = 12, onMarkerClick, selectedComplaint, enableClustering = false, onAreaClick }) => {
  // Memoize map center to prevent unnecessary re-renders
  const mapCenter = useMemo(() => center, [center[0], center[1]]);
  
  // Show loading state while map initializes
  const [isLoading, setIsLoading] = useState(true);
  const [clickedArea, setClickedArea] = useState(null);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  // Function to find complaints within radius of a point
  const findComplaintsInArea = (lat, lng, radiusKm = 0.5) => {
    return complaints.filter(complaint => {
      const distance = getDistance(lat, lng, complaint.latitude, complaint.longitude);
      return distance <= radiusKm;
    });
  };

  // Calculate distance between two points (Haversine formula)
  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Handle map click to show all complaints in area
  const handleMapClick = (e) => {
    if (onAreaClick) {
      const { lat, lng } = e.latlng;
      const nearbyComplaints = findComplaintsInArea(lat, lng);
      if (nearbyComplaints.length > 0) {
        setClickedArea({ lat, lng, radius: 500 }); // 500m radius
        onAreaClick(nearbyComplaints, { lat, lng });
      }
    }
  };

  // Custom cluster icon
  const createClusterCustomIcon = (cluster) => {
    const count = cluster.getChildCount();
    let className = 'marker-cluster-small';
    
    if (count > 10) {
      className = 'marker-cluster-large';
    } else if (count > 5) {
      className = 'marker-cluster-medium';
    }
    
    return L.divIcon({
      html: `<div class="cluster-icon ${className}"><span>${count}</span></div>`,
      className: 'marker-cluster-custom',
      iconSize: [40, 40]
    });
  };

  return (
    <div className="h-full w-full rounded-xl overflow-hidden relative">
      {isLoading && (
        <motion.div 
          initial={{ opacity: 1 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0 z-10 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm"
        >
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent mb-3 mx-auto"></div>
            <p className="text-white font-medium">Loading map...</p>
          </div>
        </motion.div>
      )}
      <MapContainer
        center={mapCenter}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        className="z-0"
        preferCanvas={true}
        zoomControl={true}
        onClick={handleMapClick}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={19}
          updateWhenIdle={true}
          keepBuffer={2}
        />
        
        {selectedComplaint && <MapUpdater center={[selectedComplaint.latitude, selectedComplaint.longitude]} />}
        
        {/* Show circle around clicked area */}
        {clickedArea && (
          <Circle
            center={[clickedArea.lat, clickedArea.lng]}
            radius={clickedArea.radius}
            pathOptions={{
              color: '#06b6d4',
              fillColor: '#06b6d4',
              fillOpacity: 0.1,
              weight: 2
            }}
          />
        )}
        
        {enableClustering ? (
          <MarkerClusterGroup
            chunkedLoading
            iconCreateFunction={createClusterCustomIcon}
            maxClusterRadius={80}
            spiderfyOnMaxZoom={true}
            showCoverageOnHover={true}
            zoomToBoundsOnClick={true}
          >
            {complaints.map((complaint) => (
              <ComplaintMarker
                key={complaint.id}
                complaint={complaint}
                onMarkerClick={onMarkerClick}
              />
            ))}
          </MarkerClusterGroup>
        ) : (
          complaints.map((complaint) => (
            <ComplaintMarker
              key={complaint.id}
              complaint={complaint}
              onMarkerClick={onMarkerClick}
            />
          ))
        )}
      </MapContainer>
    </div>
  );
};

export default memo(MapView);
