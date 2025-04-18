
import React from 'react';
import { cn } from '@/lib/utils';

type AvatarProps = {
  color: string;
  emoji: string;
  className?: string;
};

const Avatar: React.FC<AvatarProps> = ({ color, emoji, className }) => {
  return (
    <div 
      className={cn(
        'flex items-center justify-center w-10 h-10 rounded', 
        color,
        className
      )}
    >
      <span className="text-lg">{emoji}</span>
    </div>
  );
};

export default Avatar;
