
import React from 'react';

const DumDummiesLogo: React.FC = () => {
  return (
    <div className="flex flex-col">
      <div className="flex items-baseline">
        <span className="text-neon-orange font-extrabold text-2xl tracking-tight animate-glitch-slow">
          DUM
        </span>
        <span className="text-white font-extrabold text-2xl tracking-tight">
          DUMMIES
        </span>
      </div>
      <span className="text-neon-green text-sm font-bold uppercase tracking-wider">
        CREATOR
      </span>
    </div>
  );
};

export default DumDummiesLogo;
