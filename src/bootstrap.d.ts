declare module 'bootstrap' {
  interface TooltipOptions {
    title?: string | Element | (() => string);
    placement?: 'top' | 'bottom' | 'left' | 'right';
    trigger?: 'hover' | 'focus' | 'click' | 'manual';
    container?: string | boolean;
  }

  export class Tooltip {
    constructor(element: Element, options?: TooltipOptions);

    show(): void;
    hide(): void;
    setContent(content: string | Element): void;
  }
}
