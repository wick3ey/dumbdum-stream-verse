
import React from 'react';
import ProgressBar from './ProgressBar';

type TargetDisplayProps = {
  challengeName: string;
  targetAmount: number;
  currentAmount: number;
  isTargetReached: boolean;
};

const TargetDisplay: React.FC<TargetDisplayProps> = ({
  challengeName,
  targetAmount,
  currentAmount,
  isTargetReached
}) => {
  const progress = (currentAmount / targetAmount) * 100;

  return (
    <div className="flex flex-col gap-1">
      {isTargetReached ? (
        <div className="bg-neon-red p-2 text-center font-bold animate-glitch-slow text-white">
          TARGET REACHED!
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <div className="text-neon-orange font-bold uppercase">{challengeName}</div>
          <div className="text-white">CURRENT TARGET</div>
        </div>
      )}

      <div className="bg-stream-panel border border-stream-border p-4 flex items-center justify-center">
        <div className="text-white text-3xl font-bold">${targetAmount.toFixed(0)}</div>
      </div>

      <div className="text-xs text-right text-neon-orange font-medium">
        {progress.toFixed(0)}% OF TARGET
      </div>

      <ProgressBar 
        progress={progress} 
        color={isTargetReached ? "bg-neon-red" : "bg-neon-green"} 
      />
    </div>
  );
};

export default TargetDisplay;
