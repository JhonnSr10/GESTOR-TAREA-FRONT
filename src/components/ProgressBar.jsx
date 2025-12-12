import React from 'react';
import { motion } from 'framer-motion';

const ProgressBar = ({ progress, size = 'medium' }) => {
  const heights = {
    small: 'h-1.5',
    medium: 'h-2',
    large: 'h-2.5',
  };

  const getProgressColor = (progress) => {
    if (progress === 100) return 'from-green-500 to-emerald-500';
    if (progress >= 75) return 'from-blue-500 to-cyan-500';
    if (progress >= 50) return 'from-yellow-500 to-orange-500';
    if (progress >= 25) return 'from-orange-500 to-red-500';
    return 'from-red-500 to-pink-500';
  };

  return (
    <div className={`w-full ${heights[size]} bg-slate-200 rounded-full overflow-hidden`}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`h-full bg-gradient-to-r ${getProgressColor(progress)} rounded-full`}
      />
    </div>
  );
};

export default ProgressBar;