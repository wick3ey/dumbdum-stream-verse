
/// <reference types="vite/client" />

// React core declarations
interface ReactModule {
  useState: any;
  useEffect: any;
  useRef: any;
  useContext: any;
  createContext: any;
  FC: any;
  ReactNode: any;
  Component: any;
  FormEvent: any;
  ComponentPropsWithoutRef: any;
  ElementRef: any;
  forwardRef: any;
  Children: any;
}

// React router declarations
interface ReactRouterModule {
  BrowserRouter: any;
  Routes: any;
  Route: any;
  Navigate: any;
  useLocation: any;
  useNavigate: any;
  Link: any;
  useParams: any;
}

// React Query declarations
interface ReactQueryModule {
  QueryClient: any;
  QueryClientProvider: any;
  useQuery: any;
  useMutation: any;
}

// Lucide React icons declarations
interface LucideReactModule {
  CircleDollarSign: any;
  Target: any;
  AlertTriangle: any;
  CheckCircle2: any;
  XCircle: any;
  Clock: any;
  ThumbsUp: any;
  Flame: any;
  AlertCircle: any;
  Zap: any;
  Skull: any;
  X: any;
  Send: any;
  Copy: any;
  Info: any;
  Eye: any;
  Video: any;
  ChevronDown: any;
  ChevronLeft: any;
  ChevronRight: any;
  ArrowLeft: any;
  ArrowRight: any;
  MoreHorizontal: any;
  CheckIcon: any;
  ChevronsUpDown: any;
  Circle: any;
  Dot: any;
}

// Sonner toast declarations
interface SonnerModule {
  Toaster: any;
  toast: any;
}

// Radix UI declarations
interface RadixAccordionModule {
  Root: any;
  Item: any;
  Header: any;
  Trigger: any;
  Content: any;
}

interface RadixProgressModule {
  Root: any;
  Indicator: any;
}

interface RadixUIModule {
  Slot: any;
}

// Add other module declarations as needed
declare module 'react' {
  const React: ReactModule;
  export = React;
}

declare module 'react/jsx-runtime' {
  export * from 'react/jsx-runtime';
}

declare module 'react-dom/client' {
  export function createRoot(container: Element | null): {
    render(element: React.ReactNode): void;
    unmount(): void;
  };
}

declare module 'react-router-dom' {
  const ReactRouterDom: ReactRouterModule;
  export = ReactRouterDom;
}

declare module '@tanstack/react-query' {
  const ReactQuery: ReactQueryModule;
  export = ReactQuery;
}

declare module 'lucide-react' {
  const LucideReact: LucideReactModule;
  export = LucideReact;
}

declare module 'sonner' {
  const Sonner: SonnerModule;
  export = Sonner;
}

declare module '@radix-ui/react-slot' {
  export * from '@radix-ui/react-slot';
}

declare module '@radix-ui/react-progress' {
  const RadixProgress: RadixProgressModule;
  export = RadixProgress;
}

declare module '@radix-ui/react-accordion' {
  const RadixAccordion: RadixAccordionModule;
  export = RadixAccordion;
}

declare module 'class-variance-authority' {
  export function cva(...args: any[]): any;
  export type VariantProps<T> = any;
}

declare module '@radix-ui/react-aspect-ratio' {
  export * from '@radix-ui/react-aspect-ratio';
}

declare module '@radix-ui/react-avatar' {
  export * from '@radix-ui/react-avatar';
}

declare module '@radix-ui/react-alert-dialog' {
  export * from '@radix-ui/react-alert-dialog';
}

// HLS.js declarations
interface HlsConfig {}

interface HlsInstance {
  loadSource(url: string): void;
  attachMedia(video: HTMLMediaElement): void;
  on(event: string, callback: (...args: any[]) => void): void;
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
    on(event: string, callback: (...args: any[]) => void): void;
    destroy(): void;
  }
}

interface Window {
  Hls: any;
}
