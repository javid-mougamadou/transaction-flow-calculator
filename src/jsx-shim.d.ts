declare namespace JSX {
  interface IntrinsicElements {
    [elementName: string]: unknown;
  }
}

declare module 'react/jsx-runtime' {
  export const jsx: unknown;
  export const jsxs: unknown;
  export const Fragment: unknown;
}

declare module 'react' {
  export type Dispatch<A> = (value: A) => void;

  export function useState<S>(initialState: S): [S, Dispatch<S | ((prevState: S) => S)>];

  export function useMemo<T>(factory: () => T, deps: unknown[]): T;

  export function useEffect(effect: () => void | (() => void), deps?: unknown[]): void;

  export const StrictMode: (props: { children?: unknown }) => unknown;
}

declare module 'react-dom/client' {
  export function createRoot(container: Element | DocumentFragment): {
    render(children: unknown): void;
  };
}
