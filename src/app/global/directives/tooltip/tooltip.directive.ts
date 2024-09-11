import { Directive, Input, AfterViewInit, ElementRef } from '@angular/core';
import { Popover, Tooltip } from 'bootstrap';

declare let bootstrap: {
  Popover: typeof Popover;
  Tooltip: typeof Tooltip;
};

@Directive({
  selector: '[appTooltip]',
  standalone: true,
})
export class TooltipDirective implements AfterViewInit {
  @Input({ required: true }) appTooltip!: {
    title: string;
    placement?: 'top' | 'bottom' | 'right' | 'left';
    content?: string;
  };

  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    const { title, content, placement = 'top' } = this.appTooltip;
    if (title && !content) {
      const tooltipTriggerEl = this.el.nativeElement;
      new bootstrap.Tooltip(tooltipTriggerEl, {
        placement,
        title,
      });
    }

    if (title && content) {
      const popoverTriggerEl = this.el.nativeElement;
      new bootstrap.Popover(popoverTriggerEl, {
        placement,
        content,
        title,
      });
    }
  }
}
