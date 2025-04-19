
import React, { useRef, useEffect, useState } from 'react';

type VideoFeedProps = {
  targetReached: boolean;
  targetText: string;
  streamUrl?: string;
  isLive: boolean;
};

const VideoFeed: React.FC<VideoFeedProps> = ({ targetReached, targetText, streamUrl, isLive }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Reset loading state when stream URL changes
    setIsLoading(true);
    
    if (!streamUrl || !isLive || !videoRef.current) {
      return;
    }

    // Declare cleanup function
    let cleanup = () => {};

    // Simple function to initialize video playback
    const initializeVideo = () => {
      if (!videoRef.current || !streamUrl) return;
      
      // For Safari - Native HLS support
      if (/^((?!chrome|android).)*safari/i.test(navigator.userAgent)) {
        videoRef.current.src = streamUrl;
        videoRef.current.addEventListener('loadedmetadata', () => {
          setIsLoading(false);
          videoRef.current?.play().catch(error => {
            console.error("Safari: Error playing video:", error);
          });
        });
        return;
      }

      // For other browsers - Use HLS.js
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/hls.js@latest';
      script.async = true;
      
      script.onload = () => {
        // Check if window.Hls exists and is supported
        if (window.Hls && window.Hls.isSupported && window.Hls.isSupported() && videoRef.current) {
          try {
            const hls = new window.Hls();
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
                hls.destroy();
              }
            });
            
            // Setup cleanup
            cleanup = () => {
              hls.destroy();
              document.body.removeChild(script);
            };
          } catch (error) {
            console.error("Error initializing HLS:", error);
            setIsLoading(false);
          }
        } else {
          // Fallback for unsupported browsers
          if (videoRef.current) {
            try {
              videoRef.current.src = streamUrl;
              videoRef.current.play().catch(e => console.error("Fallback: Error playing video:", e));
              setIsLoading(false);
            } catch (error) {
              console.error("Fallback video error:", error);
              setIsLoading(false);
            }
          }
        }
      };
      
      script.onerror = () => {
        console.error("Failed to load HLS.js library");
        setIsLoading(false);
      };
      
      document.body.appendChild(script);
    };

    // Start playback
    initializeVideo();
    
    // Clean up
    return () => {
      cleanup();
      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.src = '';
        videoRef.current.load();
      }
    };
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
