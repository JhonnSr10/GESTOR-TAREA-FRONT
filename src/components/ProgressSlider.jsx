
import React from 'react';
import { Slider } from '@/components/ui/slider';

const ProgressSlider = ({ value, onChange }) => {
  const handleChange = (newValue) => {
    onChange(newValue[0]);
  };

  return (
    <div className="space-y-2">
      <Slider
        value={[value]}
        onValueChange={handleChange}
        max={100}
        step={5}
        className="w-full"
      />
      <div className="flex justify-between text-xs text-slate-500">
        <span>0%</span>
        <span>50%</span>
        <span>100%</span>
      </div>
    </div>
  );
};

export default ProgressSlider;
