
import { cn } from '@/lib/utils';

type ProgressBarProps = {
  progress: number;  // 0 to 100
  color: string;
  className?: string;
};

const ProgressBar = ({ progress, color, className }: ProgressBarProps) => {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);
  
  return (
    <div className={cn("w-full h-2 bg-stream-panel rounded overflow-hidden", className)}>
      <div 
        className={`h-full ${color} transition-all duration-700 animate-pulse-bright`}
        style={{ width: `${clampedProgress}%` }}
      />
    </div>
  );
};

export default ProgressBar;
