import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, ZoomOut, Download } from 'lucide-react';
import { useState } from 'react';

/**
 * ImageModal Component
 * Full-screen image viewer with zoom and download capabilities
 */
const ImageModal = ({ imageUrl, alt, onClose }) => {
  const [zoom, setZoom] = useState(1);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.5));

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `complaint-image-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
        onClick={handleBackdropClick}
      >
        {/* Close button */}
        <motion.button
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all z-10"
        >
          <X size={24} />
        </motion.button>

        {/* Control buttons */}
        <div className="absolute top-6 left-6 flex items-center gap-2 z-10">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleZoomIn}
            disabled={zoom >= 3}
            className="p-3 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed rounded-full text-white transition-all"
          >
            <ZoomIn size={20} />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleZoomOut}
            disabled={zoom <= 0.5}
            className="p-3 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed rounded-full text-white transition-all"
          >
            <ZoomOut size={20} />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleDownload}
            className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all"
          >
            <Download size={20} />
          </motion.button>

          <div className="ml-2 px-4 py-2 bg-white/10 rounded-full text-white text-sm font-medium">
            {Math.round(zoom * 100)}%
          </div>
        </div>

        {/* Image */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: 'spring', damping: 25 }}
          className="max-w-[90vw] max-h-[90vh] overflow-auto"
        >
          <motion.img
            src={imageUrl}
            alt={alt}
            style={{ transform: `scale(${zoom})` }}
            className="max-w-full max-h-[90vh] object-contain transition-transform duration-300 cursor-zoom-in"
            onClick={handleZoomIn}
          />
        </motion.div>

        {/* Instructions */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm">
          Click image to zoom • Click outside to close
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ImageModal;
