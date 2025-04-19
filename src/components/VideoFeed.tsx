
import React, { useRef, useEffect, useState } from 'react';

type VideoFeedProps = {
  targetReached: boolean;
  targetText: string;
  streamUrl?: string;
  isLive: boolean;
};

const VideoFeed = ({ targetReached, targetText, streamUrl, isLive }: VideoFeedProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hlsInstance, setHlsInstance] = useState<any>(null);

  // Clean up function for HLS
  const destroyHls = () => {
    if (hlsInstance) {
      hlsInstance.destroy();
      setHlsInstance(null);
    }
    
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.src = '';
      videoRef.current.load();
    }
  };

  useEffect(() => {
    // Reset loading state when stream URL changes
    setIsLoading(true);
    
    // Clean up previous HLS instance if it exists
    destroyHls();
    
    if (!streamUrl || !isLive || !videoRef.current) {
      return;
    }

    // For Safari - Native HLS support
    if (/^((?!chrome|android).)*safari/i.test(navigator.userAgent)) {
      if (videoRef.current) {
        videoRef.current.src = streamUrl;
        videoRef.current.addEventListener('loadedmetadata', () => {
          setIsLoading(false);
          videoRef.current?.play().catch(error => {
            console.error("Safari: Error playing video:", error);
          });
        });
      }
      return;
    }

    // For other browsers - Use HLS.js
    const loadHls = async () => {
      try {
        // Load HLS.js dynamically
        await new Promise<void>((resolve, reject) => {
          if (window.Hls && window.Hls.isSupported()) {
            // HLS.js is already loaded
            resolve();
            return;
          }
          
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/npm/hls.js@latest';
          script.async = true;
          script.onload = () => resolve();
          script.onerror = () => reject(new Error("Failed to load HLS.js"));
          document.body.appendChild(script);
        });

        // Check if HLS.js is supported and initialize
        if (window.Hls && window.Hls.isSupported() && videoRef.current) {
          const hls = new window.Hls();
          setHlsInstance(hls);
          
          hls.loadSource(streamUrl);
          hls.attachMedia(videoRef.current);
          
          hls.on('manifestParsed', () => {
            setIsLoading(false);
            videoRef.current?.play().catch(e => console.error("HLS: Error playing video:", e));
          });
          
          // Add error handling
          hls.on('error', (event: any, data: any) => {
            console.error("HLS error:", data);
            if (data.fatal) {
              destroyHls();
            }
          });
        } else {
          // Fallback for browsers without HLS.js support
          if (videoRef.current) {
            videoRef.current.src = streamUrl;
            videoRef.current.addEventListener('canplay', () => {
              setIsLoading(false);
            });
            videoRef.current.play().catch(e => {
              console.error("Fallback: Error playing video:", e);
              setIsLoading(false);
            });
          }
        }
      } catch (error) {
        console.error("Error initializing video player:", error);
        setIsLoading(false);
      }
    };

    loadHls();
    
    // Clean up on component unmount
    return destroyHls;
  }, [streamUrl, isLive]);

  return (
    <div className="relative w-full h-full overflow-hidden bg-black crt-effect border border-stream-border">
      {/* Video element */}
      <video 
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        controls={false}
        playsInline
        muted
        style={{ display: isLive && streamUrl ? 'block' : 'none' }}
      />
      
      {/* Loading or offline state */}
      {(!isLive || !streamUrl || isLoading) && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full h-full bg-black">
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

      {/* Live indicator */}
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
