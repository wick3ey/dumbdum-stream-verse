
import React from 'react';

type DonateButtonProps = {
  amount: number;
  onDonate: (amount: number) => void;
};

const DonateButton: React.FC<DonateButtonProps> = ({ amount, onDonate }) => {
  return (
    <button
      onClick={() => onDonate(amount)}
      className="bg-neon-yellow hover:bg-yellow-400 text-black font-bold py-2 px-4 rounded transition-all hover:scale-105 active:scale-95 animate-glitch-slow"
    >
      DONATE ${amount}
    </button>
  );
};

export default DonateButton;
