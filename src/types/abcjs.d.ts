declare module 'abcjs' {
  export function renderAbc(
    element: HTMLElement,
    notation: string,
    options?: {
      responsive?: string;
      add_classes?: boolean;
      staffwidth?: number;
      [key: string]: unknown;
    }
  ): object;
}
