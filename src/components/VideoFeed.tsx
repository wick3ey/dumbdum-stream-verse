
import React, { useRef, useEffect, useState } from 'react';
// We will conditionally load HLS.js instead of importing it directly

type VideoFeedProps = {
  targetReached: boolean;
  targetText: string;
  streamUrl?: string;
  isLive: boolean;
};

const VideoFeed: React.FC<VideoFeedProps> = ({ targetReached, targetText, streamUrl, isLive }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hlsInstance, setHlsInstance] = useState<any>(null);

  useEffect(() => {
    if (!streamUrl || !isLive || !videoRef.current) return;

    // Clean up any existing HLS instance
    if (hlsInstance) {
      hlsInstance.destroy();
      setHlsInstance(null);
    }

    let hlsObj: any = null;

    // Load video source dynamically
    try {
      if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
        // Native HLS support (Safari)
        videoRef.current.src = streamUrl;
        videoRef.current.addEventListener('loadedmetadata', () => {
          videoRef.current?.play().catch(error => {
            console.error("Error attempting to play video:", error);
          });
        });
      } else {
        // For browsers without native HLS support, dynamically load hls.js script
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/hls.js@latest';
        script.async = true;
        
        script.onload = () => {
          // Once the script is loaded, we can use the global HLS object
          if (window.Hls && window.Hls.isSupported() && videoRef.current) {
            hlsObj = new window.Hls();
            hlsObj.loadSource(streamUrl);
            hlsObj.attachMedia(videoRef.current);
            hlsObj.on(window.Hls.Events.MANIFEST_PARSED, () => {
              videoRef.current?.play().catch(error => {
                console.error("Error attempting to play video:", error);
              });
            });
            setHlsInstance(hlsObj);
          }
        };
        
        script.onerror = (err) => {
          console.error("Error loading HLS.js:", err);
        };
        
        document.body.appendChild(script);
        
        // Clean up function for script
        return () => {
          document.body.removeChild(script);
        };
      }
    } catch (error) {
      console.error("Error setting up video playback:", error);
    }

    // Cleanup function
    return () => {
      if (hlsObj) {
        hlsObj.destroy();
      }
    };
  }, [streamUrl, isLive]);

  return (
    <div className="relative w-full h-full overflow-hidden bg-black crt-effect border border-stream-border">
      {/* Real video stream */}
      {isLive && streamUrl ? (
        <video 
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          controls={false}
          playsInline
          muted
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full h-full bg-black">
            {/* Live stream video placeholder */}
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-stream-panel to-black">
              <div className="text-3xl font-bold text-white animate-pulse">
                {isLive ? "CONNECTING..." : "OFFLINE"}
              </div>
            </div>
          </div>
        </div>
      )}

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

      {/* Live indicator on left only - removed duplicate on right side */}
      {isLive && (
        <div className="absolute top-4 left-4 bg-neon-red/80 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-neon-red animate-pulse">
          <span className="font-bold text-white flex items-center gap-2">
            <span className="h-3 w-3 bg-white rounded-full animate-pulse"></span>
            LIVE
          </span>
        </div>
      )}

      {/* Scanlines overlay */}
      <div className="scanlines"></div>
    </div>
  );
};

export default VideoFeed;

// Add TypeScript declaration for the global Hls object
declare global {
  interface Window {
    Hls: any;
  }
}
