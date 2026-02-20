import { motion } from 'framer-motion';

const LoadingShimmer = ({ 
  type = 'card', 
  count = 1, 
  className = '' 
}) => {
  const ShimmerCard = () => (
    <div className={`glass-card animate-pulse ${className}`}>
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-white/10 rounded-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
        </div>
        <div className="flex-1 space-y-3">
          <div className="h-4 bg-white/10 rounded w-3/4 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
          </div>
          <div className="h-3 bg-white/10 rounded w-1/2 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
          </div>
        </div>
      </div>
    </div>
  );

  const ShimmerMetric = () => (
    <div className={`glass-card ${className}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 bg-white/10 rounded-xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
        </div>
      </div>
      <div className="h-10 bg-white/10 rounded w-1/3 mb-2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
      </div>
      <div className="h-3 bg-white/10 rounded w-2/3 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
      </div>
    </div>
  );

  const ShimmerList = () => (
    <div className={`glass-card ${className}`}>
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex items-center gap-3 py-3 border-b border-white/5 last:border-0">
          <div className="w-10 h-10 bg-white/10 rounded-lg relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
          </div>
          <div className="flex-1 space-y-2">
            <div className="h-3 bg-white/10 rounded w-3/4 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
            </div>
            <div className="h-2 bg-white/10 rounded w-1/2 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const ShimmerTable = () => (
    <div className={`glass-card ${className}`}>
      <div className="space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-12 bg-white/5 rounded-lg relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
          </div>
        ))}
      </div>
    </div>
  );

  const ShimmerText = () => (
    <div className="space-y-2">
      {[...Array(count)].map((_, i) => (
        <div key={i} className={`h-4 bg-white/10 rounded relative overflow-hidden ${className}`}>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
        </div>
      ))}
    </div>
  );

  const renderShimmer = () => {
    switch (type) {
      case 'card':
        return [...Array(count)].map((_, i) => <ShimmerCard key={i} />);
      case 'metric':
        return [...Array(count)].map((_, i) => <ShimmerMetric key={i} />);
      case 'list':
        return <ShimmerList />;
      case 'table':
        return <ShimmerTable />;
      case 'text':
        return <ShimmerText />;
      default:
        return <ShimmerCard />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className={type === 'card' || type === 'metric' ? 'grid grid-cols-1 gap-4' : ''}
    >
      {renderShimmer()}
    </motion.div>
  );
};

export default LoadingShimmer;
