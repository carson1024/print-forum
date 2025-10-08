import React from 'react';

interface ProgressBarProps {
  progress: number; // expects a value from 0 to 100
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  return (
    <div className="w-full bg-[#18171b] rounded-full h-3">
      <div
        className="h-3 rounded-full bg-lime-400"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};

export default ProgressBar;
