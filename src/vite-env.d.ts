
/// <reference types="vite/client" />

// Lägg till grundläggande typdeklarationer för React JSX
declare namespace React {
  interface ReactElement<P = any, T extends string | JSXElementConstructor<any> = string | JSXElementConstructor<any>> {
    type: T;
    props: P;
    key: Key | null;
  }
  
  type ComponentType<P = {}> = ComponentClass<P> | FunctionComponent<P>;
  type ElementType<P = any> = {
    [K in keyof JSX.IntrinsicElements]: P extends JSX.IntrinsicElements[K] ? K : never
  }[keyof JSX.IntrinsicElements] | ComponentType<P>;
  interface FunctionComponent<P = {}> {
    (props: P, context?: any): ReactElement<any, any> | null;
    displayName?: string;
  }
  interface ComponentClass<P = {}, S = ComponentState> extends StaticLifecycle<P, S> {
    new(props: P, context?: any): Component<P, S>;
    displayName?: string;
  }
  type ComponentState = any;
  interface Component<P, S> {
    render(): ReactNode;
  }
  interface StaticLifecycle<P, S> {}
  type Key = string | number;
  type ReactText = string | number;
  type ReactChild = ReactElement | ReactText;
  type ReactFragment = {} | ReactNodeArray;
  interface ReactNodeArray extends Array<ReactNode> {}
  type ReactNode = ReactChild | ReactFragment | boolean | null | undefined;
  type JSXElementConstructor<P> = ((props: P) => ReactElement<any, any> | null);
}

declare namespace JSX {
  interface Element extends React.ReactElement<any, any> {}
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}

// HLS.js typdeklarationer
interface HlsInstance {
  loadSource(url: string): void;
  attachMedia(video: HTMLVideoElement): void;
  on(event: string, callback: () => void): void;
  destroy(): void;
}

interface Window {
  Hls: {
    new(): HlsInstance;
    isSupported(): boolean;
    Events: {
      MANIFEST_PARSED: string;
      ERROR: string;
      MEDIA_ATTACHED: string;
    };
  };
}
