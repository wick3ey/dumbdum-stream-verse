
// This file provides TypeScript type declarations for dynamically loaded HLS.js

declare global {
  interface Window {
    Hls: {
      new(config?: any): HlsInstance;
      isSupported(): boolean;
      Events: {
        MANIFEST_PARSED: string;
        ERROR: string;
        MEDIA_ATTACHED: string;
      };
    };
  }
  
  interface HlsInstance {
    loadSource(url: string): void;
    attachMedia(video: HTMLVideoElement): void;
    on(event: string, callback: () => void): void;
    destroy(): void;
  }
}

export {};
