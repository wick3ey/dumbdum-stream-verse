
import React from 'react';

type ViewerCountProps = {
  count: number;
};

const ViewerCount: React.FC<ViewerCountProps> = ({ count }) => {
  return (
    <div className="flex items-center gap-2 text-neon-orange">
      <span className="font-bold">{count}</span>
      <span>watching</span>
    </div>
  );
};

export default ViewerCount;
