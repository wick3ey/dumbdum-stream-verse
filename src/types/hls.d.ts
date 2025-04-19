
// This file provides TypeScript type declarations for dynamically loaded HLS.js

interface HlsConfig {
  autoStartLoad?: boolean;
  startPosition?: number;
  debug?: boolean;
  capLevelToPlayerSize?: boolean;
  progressive?: boolean;
  lowLatencyMode?: boolean;
}

interface HlsEventMap {
  MANIFEST_PARSED: string;
  ERROR: string;
  MEDIA_ATTACHED: string;
}

declare global {
  interface Window {
    Hls: {
      new(config?: HlsConfig): HlsInstance;
      isSupported(): boolean;
      Events: HlsEventMap;
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
