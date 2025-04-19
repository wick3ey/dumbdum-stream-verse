/// <reference types="vite/client" />

// React core
declare module 'react' {
  export const useState: any;
  export const useEffect: any;
  export const useRef: any;
  export const useContext: any;
  export const createContext: any;
  export type FC<P = {}> = React.FunctionComponent<P>;
  export type ReactNode = React.ReactNode;
  export const Component: any;
  export type FormEvent<T = any> = React.FormEvent<T>;
  export type ComponentPropsWithoutRef<T> = React.ComponentPropsWithoutRef<T>;
  export type ElementRef<T> = React.ElementRef<T>;
  export const forwardRef: any;
  export const Children: any;
  export default React;
}

// React namespaces
declare namespace React {
  export type ReactNode = any;
  export type FC<P = {}> = FunctionComponent<P>;
  export interface FunctionComponent<P = {}> {
    (props: P, context?: any): React.ReactElement<any, any> | null;
    displayName?: string;
  }
  export type ComponentPropsWithoutRef<T> = any;
  export type ElementRef<T> = any;
  export type FormEvent<T = any> = any;
  export type ReactElement<T = any, C = any> = any;
}

// React Router
declare module 'react-router-dom' {
  export const BrowserRouter: any;
  export const Routes: any;
  export const Route: any;
  export const Navigate: any;
  export const useLocation: any;
  export const useNavigate: any;
  export const Link: any;
  export const useParams: any;
  export default any;
}

// React Query
declare module '@tanstack/react-query' {
  export const QueryClient: any;
  export const QueryClientProvider: any;
  export const useQuery: any;
  export const useMutation: any;
}

// Lucide React
declare module 'lucide-react' {
  export const CircleDollarSign: any;
  export const Target: any;
  export const AlertTriangle: any;
  export const CheckCircle2: any;
  export const XCircle: any;
  export const Clock: any;
  export const ThumbsUp: any;
  export const Flame: any;
  export const AlertCircle: any;
  export const Zap: any;
  export const Skull: any;
  export const X: any;
  export const Send: any;
  export const Copy: any;
  export const Info: any;
  export const Eye: any;
  export const Video: any;
  export const ChevronDown: any;
  export const ChevronLeft: any;
  export const ChevronRight: any;
  export const ArrowLeft: any;
  export const ArrowRight: any;
  export const MoreHorizontal: any;
  export const Check: any;
  export const ChevronsUpDown: any;
  export const Circle: any;
  export const Dot: any;
  export const CheckIcon: any;
}

// Sonner
declare module 'sonner' {
  export const Toaster: any;
  export const toast: any;
}

// Radix UI modules
declare module '@radix-ui/react-accordion' {
  export const Root: any;
  export const Item: any;
  export const Header: any;
  export const Trigger: any;
  export const Content: any;
}

declare module '@radix-ui/react-alert-dialog' {
  export const Root: any;
  export const Trigger: any;
  export const Portal: any;
  export const Overlay: any;
  export const Content: any;
  export const Title: any;
  export const Description: any;
  export const Action: any;
  export const Cancel: any;
}

declare module '@radix-ui/react-aspect-ratio' {
  export const Root: any;
}

declare module '@radix-ui/react-avatar' {
  export const Root: any;
  export const Image: any;
  export const Fallback: any;
}

declare module '@radix-ui/react-checkbox' {
  export const Root: any;
  export const Indicator: any;
}

declare module '@radix-ui/react-collapsible' {
  export const Root: any;
  export const CollapsibleTrigger: any;
  export const CollapsibleContent: any;
}

declare module '@radix-ui/react-dialog' {
  export const Root: any;
  export const Trigger: any;
  export const Portal: any;
  export const Overlay: any;
  export const Content: any;
  export const Header: any;
  export const Footer: any;
  export const Title: any;
  export const Description: any;
  export const Close: any;
}

declare module '@radix-ui/react-hover-card' {
  export const Root: any;
  export const Trigger: any;
  export const Content: any;
}

declare module '@radix-ui/react-label' {
  export const Root: any;
}

declare module '@radix-ui/react-popover' {
  export const Root: any;
  export const Trigger: any;
  export const Content: any;
  export const Portal: any;
}

declare module '@radix-ui/react-progress' {
  export const Root: any;
  export const Indicator: any;
}

declare module '@radix-ui/react-radio-group' {
  export const Root: any;
  export const Item: any;
  export const Indicator: any;
}

declare module '@radix-ui/react-scroll-area' {
  export const Root: any;
  export const Viewport: any;
  export const Corner: any;
  export const ScrollAreaScrollbar: any;
  export const ScrollAreaThumb: any;
}

declare module '@radix-ui/react-select' {
  export const Root: any;
  export const Group: any;
  export const Value: any;
  export const Trigger: any;
  export const Content: any;
  export const Viewport: any;
  export const Item: any;
  export const ItemText: any;
  export const ItemIndicator: any;
  export const Label: any;
  export const Separator: any;
  export const ScrollUpButton: any;
  export const ScrollDownButton: any;
}

declare module '@radix-ui/react-separator' {
  export const Root: any;
}

declare module '@radix-ui/react-slider' {
  export const Root: any;
  export const Track: any;
  export const Range: any;
  export const Thumb: any;
}

declare module '@radix-ui/react-slot' {
  export const Slot: any;
}

declare module '@radix-ui/react-switch' {
  export const Root: any;
  export const Thumb: any;
}

declare module '@radix-ui/react-tabs' {
  export const Root: any;
  export const List: any;
  export const Trigger: any;
  export const Content: any;
}

declare module '@radix-ui/react-toast' {
  export const Provider: any;
  export const Root: any;
  export const Title: any;
  export const Description: any;
  export const Action: any;
  export const Close: any;
  export const Viewport: any;
}

declare module '@radix-ui/react-toggle' {
  export const Root: any;
}

declare module '@radix-ui/react-toggle-group' {
  export const Root: any;
  export const Item: any;
}

declare module '@radix-ui/react-tooltip' {
  export const Provider: any;
  export const Root: any;
  export const Trigger: any;
  export const Content: any;
}

// Class variance authority
declare module 'class-variance-authority' {
  export function cva(...args: any[]): any;
  export type VariantProps<T> = any;
}

// HLS.js declarations
declare module 'hls.js' {
  export class Hls {
    static isSupported(): boolean;
    static Events: {
      MANIFEST_PARSED: string;
      ERROR: string;
      MEDIA_ATTACHED: string;
    };
    
    constructor(config?: any);
    loadSource(url: string): void;
    attachMedia(video: HTMLVideoElement): void;
    on(event: string, callback: (...args: any[]) => void): void;
    destroy(): void;
  }
  
  export default Hls;
}

interface Window {
  Hls: any;
}

// ReactDOM declarations
declare module 'react-dom/client' {
  export function createRoot(container: Element | null): {
    render(element: React.ReactNode): void;
    unmount(): void;
  };
}

declare module 'react/jsx-runtime' {
  export const jsx: any;
  export const jsxs: any;
  export const Fragment: any;
}

// Other utils
declare module 'next-themes' {
  export function useTheme(): { theme: string; setTheme: (theme: string) => void };
}

declare module 'input-otp' {
  export const OTPInput: any;
  export const OTPInputContext: any;
}

declare module 'react-resizable-panels' {
  export const PanelGroup: any;
  export const Panel: any;
  export const PanelResizeHandle: any;
}
