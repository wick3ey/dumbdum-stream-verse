
/// <reference types="vite/client" />

// Global deklaration av grundläggande moduler som saknas
declare module 'react' {
  export * from 'react';
}

declare module 'react/jsx-runtime' {
  export * from 'react/jsx-runtime';
}

declare module 'react-dom/client' {
  export * from 'react-dom/client';
}

declare module 'react-router-dom' {
  export * from 'react-router-dom';
}

declare module '@tanstack/react-query' {
  export * from '@tanstack/react-query';
}

declare module 'lucide-react' {
  export * from 'lucide-react';
}

declare module 'sonner' {
  export * from 'sonner';
}

declare module '@radix-ui/react-slot' {
  export * from '@radix-ui/react-slot';
}

declare module 'class-variance-authority' {
  export * from 'class-variance-authority';
}

declare module '@radix-ui/react-progress' {
  export * from '@radix-ui/react-progress';
}

declare module '@radix-ui/react-accordion' {
  export * from '@radix-ui/react-accordion';
}

declare module '@radix-ui/react-alert-dialog' {
  export * from '@radix-ui/react-alert-dialog';
}

declare module '@radix-ui/react-aspect-ratio' {
  export * from '@radix-ui/react-aspect-ratio';
}

declare module '@radix-ui/react-avatar' {
  export * from '@radix-ui/react-avatar';
}

// HLS.js förenklad typdeklaration
interface HlsConfig {}

interface HlsInstance {
  loadSource(url: string): void;
  attachMedia(video: HTMLMediaElement): void;
  on(event: string, callback: () => void): void;
  destroy(): void;
}

declare namespace Hls {
  export const isSupported: () => boolean;
  export const Events: {
    MANIFEST_PARSED: string;
    ERROR: string;
  };
  export class Hls {
    constructor(config?: HlsConfig);
    loadSource(url: string): void;
    attachMedia(video: HTMLMediaElement): void;
    on(event: string, callback: () => void): void;
    destroy(): void;
  }
}

interface Window {
  Hls: any;
}
