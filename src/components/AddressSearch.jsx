import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Loader2, Navigation, X } from 'lucide-react';
import { searchAddress, getCurrentLocation, reverseGeocode } from '../utils/geocoding';
import { useTheme } from '../context/ThemeContext';

/**
 * AddressSearch Component
 * Search for addresses and automatically get coordinates
 */
const AddressSearch = ({ onLocationSelect, initialLocation }) => {
  const { isDark } = useTheme();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [gettingLocation, setGettingLocation] = useState(false);
  const searchRef = useRef(null);
  const debounceTimer = useRef(null);

  // Load initial address if coordinates provided
  useEffect(() => {
    if (initialLocation?.latitude && initialLocation?.longitude && !selectedAddress) {
      reverseGeocode(initialLocation.latitude, initialLocation.longitude)
        .then(result => {
          if (result) {
            setSelectedAddress(result.formattedAddress);
            setQuery(result.formattedAddress);
          }
        });
    }
  }, [initialLocation, selectedAddress]);

  // Click outside to close results
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search
  const handleSearch = async (searchQuery) => {
    if (searchQuery.trim().length < 3) {
      setResults([]);
      setShowResults(false);
      return;
    }

    setLoading(true);
    const searchResults = await searchAddress(searchQuery);
    setResults(searchResults);
    setShowResults(true);
    setLoading(false);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    // Clear previous timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Set new timer (wait 500ms after user stops typing)
    debounceTimer.current = setTimeout(() => {
      handleSearch(value);
    }, 500);
  };

  const handleSelectResult = (result) => {
    setQuery(result.displayName);
    setSelectedAddress(result.displayName);
    setShowResults(false);
    
    onLocationSelect({
      latitude: result.latitude,
      longitude: result.longitude,
      address: result.displayName,
      addressDetails: result.address
    });
  };

  const handleGetCurrentLocation = async () => {
    setGettingLocation(true);
    try {
      const location = await getCurrentLocation();
      const address = await reverseGeocode(location.latitude, location.longitude);
      
      if (address) {
        setQuery(address.formattedAddress);
        setSelectedAddress(address.formattedAddress);
        
        onLocationSelect({
          latitude: location.latitude,
          longitude: location.longitude,
          address: address.formattedAddress,
          addressDetails: address.address
        });
      }
    } catch (error) {
      console.error('Error getting location:', error);
      alert('Unable to get your location. Please enable location services or search manually.');
    } finally {
      setGettingLocation(false);
    }
  };

  const handleClear = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setQuery('');
    setSelectedAddress('');
    setResults([]);
    setShowResults(false);
  };

  return (
    <div ref={searchRef} className="relative">
      <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
        Search Location
      </label>
      
      <div className="relative">
        {/* Search Input */}
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            {loading ? (
              <Loader2 size={20} className="text-primary-400 animate-spin" />
            ) : (
              <Search size={20} className="text-gray-400" />
            )}
          </div>
          
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            onFocus={() => results.length > 0 && setShowResults(true)}
            placeholder="Search for a location or address..."
            className={`w-full rounded-xl pl-10 pr-24 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all ${
              isDark 
                ? 'bg-white/[0.03] border border-white/[0.08] text-white placeholder-gray-500'
                : 'bg-white border border-gray-300 text-gray-900 placeholder-gray-400'
            }`}
          />

          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {query && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleClear}
                type="button"
                className={`p-1.5 rounded-lg transition-colors ${
                  isDark ? 'hover:bg-white/10' : 'hover:bg-gray-200'
                }`}
              >
                <X size={16} className={isDark ? 'text-gray-400' : 'text-gray-600'} />
              </motion.button>
            )}
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleGetCurrentLocation}
              disabled={gettingLocation}
              type="button"
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                isDark
                  ? 'bg-primary-500/20 hover:bg-primary-500/30 disabled:bg-primary-500/10 text-primary-300'
                  : 'bg-primary-500 hover:bg-primary-600 disabled:bg-primary-300 text-white'
              }`}
              title="Use my current location"
            >
              {gettingLocation ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Navigation size={14} />
              )}
              <span className="hidden sm:inline">GPS</span>
            </motion.button>
          </div>
        </div>

        {/* Search Results Dropdown */}
        <AnimatePresence>
          {showResults && results.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`absolute z-50 w-full mt-2 rounded-xl p-0 max-h-80 overflow-y-auto shadow-2xl backdrop-blur-xl ${
                isDark
                  ? 'bg-slate-900/95 border border-white/10'
                  : 'bg-white border-2 border-gray-200 shadow-xl'
              }`}
            >
              {results.map((result, index) => (
                <motion.button
                  key={result.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ 
                    x: 4, 
                    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(59, 130, 246, 0.05)' 
                  }}
                  onClick={() => handleSelectResult(result)}
                  type="button"
                  className={`w-full px-4 py-3 text-left border-b last:border-b-0 transition-all ${
                    isDark ? 'border-white/[0.05]' : 'border-gray-100'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <MapPin size={18} className="text-primary-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${
                        isDark ? 'text-white' : 'text-gray-900'
                      }`}>
                        {result.address?.road || result.displayName.split(',')[0]}
                      </p>
                      <p className={`text-xs line-clamp-2 mt-0.5 ${
                        isDark ? 'text-gray-200' : 'text-gray-700'
                      }`}>
                        {result.displayName}
                      </p>
                      {result.address?.postcode && (
                        <p className={`text-xs mt-1 ${
                          isDark ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                          PIN: {result.address.postcode}
                        </p>
                      )}
                    </div>
                  </div>
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* No Results */}
        {showResults && query.length >= 3 && results.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`absolute z-50 w-full mt-2 rounded-xl px-4 py-6 text-center shadow-2xl backdrop-blur-xl ${
              isDark
                ? 'bg-slate-900/95 border border-white/10'
                : 'bg-white border-2 border-gray-200 shadow-xl'
            }`}
          >
            <MapPin size={32} className={`mx-auto mb-2 ${
              isDark ? 'text-gray-400' : 'text-gray-500'
            }`} />
            <p className={`text-sm ${
              isDark ? 'text-gray-200' : 'text-gray-700'
            }`}>No locations found</p>
            <p className={`text-xs mt-1 ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>Try a different search term</p>
          </motion.div>
        )}
      </div>

      {/* Selected Address Display */}
      {selectedAddress && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-2 px-3 py-2 border rounded-lg flex items-start gap-2 ${
            isDark
              ? 'bg-success-500/10 border-success-500/30'
              : 'bg-success-50 border-success-300'
          }`}
        >
          <MapPin size={16} className={isDark ? 'text-success-400' : 'text-success-600'} />
          <div className="flex-1 min-w-0">
            <p className={`text-xs font-medium ${
              isDark ? 'text-success-300' : 'text-success-700'
            }`}>Selected Location:</p>
            <p className={`text-xs mt-0.5 line-clamp-2 ${
              isDark ? 'text-gray-300' : 'text-gray-700'
            }`}>{selectedAddress}</p>
          </div>
        </motion.div>
      )}

      {/* Help Text */}
      <p className={`text-xs mt-2 ${
        isDark ? 'text-gray-400' : 'text-gray-600'
      }`}>
        💡 Search by landmark, street name, or area. Or use GPS to detect your current location.
      </p>
    </div>
  );
};

export default AddressSearch;
