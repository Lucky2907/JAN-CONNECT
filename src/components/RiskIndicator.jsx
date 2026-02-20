import { getRiskLevel } from '../utils/calculations';

const RiskIndicator = ({ score, size = 'md' }) => {
  const risk = getRiskLevel(score);
  
  const sizes = {
    sm: 'w-16 h-16 text-xs',
    md: 'w-24 h-24 text-sm',
    lg: 'w-32 h-32 text-lg'
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className={`${sizes[size]} rounded-full ${risk.color} flex items-center justify-center font-bold text-white shadow-lg`}>
        {score.toFixed(1)}
      </div>
      <span className="text-sm font-medium text-gray-300">{risk.label}</span>
    </div>
  );
};

export default RiskIndicator;
