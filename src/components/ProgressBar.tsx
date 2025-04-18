
import { cn } from '@/lib/utils';

type ProgressBarProps = {
  progress: number;
  color: string;
  className?: string;
};

const ProgressBar = ({ progress, color, className }: ProgressBarProps) => {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);
  
  return (
    <div className={cn("w-full h-2 bg-stream-panel rounded-full overflow-hidden relative", className)}>
      <div 
        className={`h-full ${color} transition-all duration-700 rounded-full relative overflow-hidden`}
        style={{ width: `${clampedProgress}%` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-[shimmer_2s_infinite]"></div>
      </div>
    </div>
  );
};

export default ProgressBar;
