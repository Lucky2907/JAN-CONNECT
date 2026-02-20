import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Upload, AlertCircle, Send, X, Image as ImageIcon } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { detectDuplicateComplaints } from '../utils/calculations';
import { categories } from '../data/mockData';
import MapView from '../components/MapView';
import GlassCard from '../components/GlassCard';
import { PageWrapper, FadeIn } from '../components/MotionWrapper';
import AddressSearch from '../components/AddressSearch';

const SubmitComplaint = () => {
  const navigate = useNavigate();
  const { addComplaint, complaints } = useApp();
  const { isDark } = useTheme();
  const { t } = useLanguage();
  const [showMap, setShowMap] = useState(false);
  const [duplicates, setDuplicates] = useState([]);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'road',
    severity: 'medium',
    latitude: 28.6139,
    longitude: 77.2090,
    imageUrl: null
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMapClick = (e) => {
    setFormData(prev => ({
      ...prev,
      latitude: e.latlng.lat,
      longitude: e.latlng.lng
    }));
  };

  const handleLocationSelect = (location) => {
    setFormData(prev => ({
      ...prev,
      latitude: location.latitude,
      longitude: location.longitude
    }));
  };

  const handleFileSelect = (file) => {
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert('Please upload a valid image file (JPG, PNG, GIF, or WebP)');
      return;
    }

    // Validate file size (10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      alert('File size must be less than 10MB');
      return;
    }

    setImageFile(file);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
      setFormData(prev => ({ ...prev, imageUrl: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    handleFileSelect(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setFormData(prev => ({ ...prev, imageUrl: null }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const checkDuplicates = () => {
    const found = detectDuplicateComplaints(formData, complaints);
    setDuplicates(found);
    return found;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await addComplaint({
        ...formData,
        assignedDepartment: categories.find(c => c.value === formData.category)?.label || 'General'
      });

      if (result.upvoted) {
        // Upvoted existing complaint
        if (result.alreadyUpvoted) {
          alert(`ℹ️ You've already reported this issue!\n\n` +
                `Similar issue found within 100m.\n` +
                `Complaint: "${result.title}"\n` +
                `Status: ${result.status}\n` +
                `Total Reports: ${result.upvotes || 1}\n\n` +
                `Your original report is still active.`);
        } else {
          alert(`✅ Your report has been added to an existing complaint!\n\n` +
                `Similar issue found within 100m.\n` +
                `Complaint: "${result.title}"\n` +
                `Status: ${result.status}\n` +
                `Total Reports: ${result.upvotes || 1}\n\n` +
                `By combining reports, we can prioritize and resolve issues faster!`);
        }
      } else {
        // Created new complaint
        alert('✅ Complaint submitted successfully!\n\nTracking ID: #' + result.id);
      }

      navigate('/my-complaints');
    } catch (error) {
      console.error('Error submitting complaint:', error);
      alert('❌ Failed to submit complaint. Please try again.');
    }
  };

  return (
    <PageWrapper>
      <div className="max-w-4xl mx-auto">
        <FadeIn delay={0.1}>
          <div className="mb-8">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold font-display text-gradient mb-2"
            >
              {t('submitComplaint.title')}
            </motion.h1>
            <p className={`text-lg ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}>{t('submitComplaint.descriptionPlaceholder')}</p>
          </div>
        </FadeIn>

        <form onSubmit={handleSubmit} className="space-y-6">
          <FadeIn delay={0.2}>
            <GlassCard>
              <h2 className={`text-2xl font-semibold font-display mb-6 ${
                isDark ? 'text-white' : 'text-gray-900'
              }`}>Complaint Details</h2>
              
              <div className="space-y-5">
                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>Title</label>
                  <motion.input
                    whileFocus={{ scale: 1.01 }}
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className={`w-full rounded-xl px-4 py-3 focus:outline-none focus:ring-2 transition-all ${
                      isDark
                        ? 'bg-white/[0.03] border border-white/[0.08] text-white placeholder-gray-500 focus:ring-primary-500/50 focus:border-primary-500/50'
                        : 'bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-primary-500 focus:border-primary-500'
                    }`}
                    placeholder="Brief description of the issue"
                  />
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>{t('submitComplaint.description')}</label>
                  <motion.textarea
                    whileFocus={{ scale: 1.01 }}
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows={4}
                    className={`w-full rounded-xl px-4 py-3 focus:outline-none focus:ring-2 transition-all resize-none ${
                      isDark
                        ? 'bg-white/[0.03] border border-white/[0.08] text-white placeholder-gray-500 focus:ring-primary-500/50 focus:border-primary-500/50'
                        : 'bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:ring-primary-500 focus:border-primary-500'
                    }`}
                    placeholder={t('submitComplaint.descriptionPlaceholder')}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}>{t('submitComplaint.category')}</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className={`w-full rounded-xl px-4 py-3 focus:outline-none focus:ring-2 transition-all ${
                        isDark
                          ? 'bg-white/[0.03] border border-white/[0.08] text-white focus:ring-primary-500/50 focus:border-primary-500/50'
                          : 'bg-white border border-gray-300 text-gray-900 focus:ring-primary-500 focus:border-primary-500'
                      }`}
                    >
                      {categories.map(cat => (
                        <option key={cat.value} value={cat.value}>
                          {cat.icon} {cat.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className={`block text-sm font-medium mb-2 ${
                      isDark ? 'text-gray-300' : 'text-gray-700'
                    }`}>{t('submitComplaint.severity')}</label>
                    <select
                      name="severity"
                      value={formData.severity}
                      onChange={handleChange}
                      className={`w-full rounded-xl px-4 py-3 focus:outline-none focus:ring-2 transition-all ${
                        isDark
                          ? 'bg-white/[0.03] border border-white/[0.08] text-white focus:ring-primary-500/50 focus:border-primary-500/50'
                          : 'bg-white border border-gray-300 text-gray-900 focus:ring-primary-500 focus:border-primary-500'
                      }`}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className={`block text-sm font-medium mb-2 ${
                    isDark ? 'text-gray-300' : 'text-gray-700'
                  }`}>Upload Image (Optional)</label>
                  
                  {/* Hidden file input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                    onChange={handleFileInputChange}
                    className="hidden"
                  />

                  {/* Image Preview or Upload Zone */}
                  {imagePreview ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="relative border-2 border-white/[0.08] rounded-xl overflow-hidden group"
                    >
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-64 object-cover"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          type="button"
                          onClick={handleRemoveImage}
                          className="px-4 py-2 bg-red-500 text-white rounded-lg flex items-center gap-2 font-medium"
                        >
                          <X size={18} />
                          Remove Image
                        </motion.button>
                      </div>
                      <div className="absolute top-3 right-3 px-3 py-1 bg-black/70 backdrop-blur-sm rounded-lg text-xs text-white">
                        {imageFile && `${(imageFile.size / 1024 / 1024).toFixed(2)} MB`}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      onClick={triggerFileInput}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
                        isDragging
                          ? 'border-primary-500 bg-primary-500/10 scale-105'
                          : 'border-white/[0.08] hover:border-primary-500/50 hover:bg-white/[0.02]'
                      }`}
                    >
                      <motion.div
                        animate={{ y: isDragging ? -4 : 0 }}
                        className="inline-block"
                      >
                        <Upload className={`mx-auto mb-3 transition-colors ${
                          isDragging ? 'text-primary-400' : 'text-gray-400'
                        }`} size={40} />
                      </motion.div>
                      <p className={`text-sm font-medium ${
                        isDark ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {isDragging ? 'Drop your image here' : 'Click to upload or drag and drop'}
                      </p>
                      <p className={`text-xs mt-1 ${
                        isDark ? 'text-gray-500' : 'text-gray-600'
                      }`}>PNG, JPG, GIF, WebP up to 10MB</p>
                    </motion.div>
                  )}
                </div>
              </div>
            </GlassCard>
          </FadeIn>

          <FadeIn delay={0.3}>
            <GlassCard>
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-2xl font-semibold font-display ${
                  isDark ? 'text-white' : 'text-gray-900'
                }`}>Location</h2>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={() => setShowMap(!showMap)}
                  className={`px-4 py-2.5 border rounded-xl font-medium transition-all ${
                    isDark
                      ? 'bg-primary-500/20 border-primary-500/30 text-primary-300 hover:bg-primary-500/30'
                      : 'bg-primary-50 border-primary-300 text-primary-700 hover:bg-primary-100'
                  }`}
                >
                  <MapPin className="inline mr-2" size={16} />
                  {showMap ? 'Hide Map' : 'Select on Map'}
                </motion.button>
              </div>

              <div className="mb-5">
                <AddressSearch
                  onLocationSelect={handleLocationSelect}
                  initialLocation={{ latitude: formData.latitude, longitude: formData.longitude }}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Latitude</label>
                  <motion.input
                    whileFocus={{ scale: 1.01 }}
                    type="number"
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleChange}
                    step="0.0001"
                    required
                    className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Longitude</label>
                  <motion.input
                    whileFocus={{ scale: 1.01 }}
                    type="number"
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleChange}
                    step="0.0001"
                    required
                    className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all"
                  />
                </div>
              </div>

              <AnimatePresence>
                {showMap && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 384 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="rounded-xl overflow-hidden border border-white/[0.08]"
                  >
                    <MapView
                      complaints={[{ ...formData, id: 'temp', status: 'Submitted' }]}
                      center={[formData.latitude, formData.longitude]}
                      zoom={14}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </GlassCard>
          </FadeIn>

          <AnimatePresence>
            {duplicates.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <GlassCard className="border-warning-500/30 bg-warning-500/5">
                  <div className="flex items-start gap-4">
                    <motion.div
                      animate={{ rotate: [0, -10, 10, -10, 0] }}
                      transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                    >
                      <AlertCircle className="text-warning-400 flex-shrink-0 mt-1" size={24} />
                    </motion.div>
                    <div className="flex-1">
                      <h3 className="text-warning-300 font-semibold text-lg mb-2">Similar Complaints Found</h3>
                      <p className="text-sm text-gray-300 mb-3">
                        {duplicates.length} similar complaint(s) found within 300 meters:
                      </p>
                      <ul className="text-sm text-gray-400 space-y-2">
                        {duplicates.map(dup => (
                          <motion.li
                            key={dup.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center gap-2 px-3 py-2 bg-white/[0.03] rounded-lg"
                          >
                            <span className="w-1.5 h-1.5 bg-warning-400 rounded-full" />
                            {dup.title} ({dup.status})
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            )}
          </AnimatePresence>

          <FadeIn delay={0.4}>
            <div className="flex gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="flex-1 btn-primary flex items-center justify-center gap-2 text-white px-6 py-4 rounded-xl font-semibold shadow-lg"
              >
                <Send size={20} />
                Submit Complaint
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => navigate(-1)}
                className="px-8 py-4 bg-white/[0.03] border border-white/[0.08] text-gray-300 rounded-xl hover:bg-white/[0.05] hover:border-white/[0.12] transition-all font-medium flex items-center gap-2"
              >
                <X size={20} />
                Cancel
              </motion.button>
            </div>
          </FadeIn>
        </form>
      </div>
    </PageWrapper>
  );
};

export default SubmitComplaint;
