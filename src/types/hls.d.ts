
// This file provides simplified TypeScript type declarations for dynamically loaded HLS.js

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
    attachMedia(video: HTMLMediaElement): void;
    on(event: string, callback: (...args: any[]) => void): void;
    destroy(): void;
  }
}

export {};
