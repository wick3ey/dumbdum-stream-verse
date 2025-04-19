import React from 'react';

type VideoFeedProps = {
  targetReached: boolean;
  targetText: string;
};

const VideoFeed: React.FC<VideoFeedProps> = ({ targetReached, targetText }) => {
  return (
    <div className="relative w-full h-full overflow-hidden bg-black crt-effect border border-stream-border">
      {/* Video content (placeholder) */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-full h-full bg-black">
          {/* Live stream video placeholder */}
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-stream-panel to-black">
            <div className="text-3xl font-bold text-white animate-pulse">
              LIVE STREAM
            </div>
          </div>
        </div>
      </div>

      {/* Target reached overlay */}
      {targetReached && (
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 
            className="text-5xl md:text-7xl font-bold text-white glitch-text"
            data-text="TARGET REACHED!"
          >
            TARGET REACHED!
          </h1>
        </div>
      )}

      {/* Challenge name on bottom */}
      <div className="absolute bottom-4 left-4 bg-stream-panel bg-opacity-80 px-3 py-1 rounded">
        <span className="text-neon-green text-sm font-bold">{targetText}</span>
      </div>

      {/* Scanlines overlay */}
      <div className="scanlines"></div>
    </div>
  );
};

export default VideoFeed;
