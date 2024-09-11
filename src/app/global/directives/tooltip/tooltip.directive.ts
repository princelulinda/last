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
  @Input({ required: true }) appTooltip = 'Salut les gens';
  @Input() placement: 'top' | 'bottom' | 'right' | 'left' = 'top';
  @Input() popoverContent = '';
  @Input() popoverTitle = '';

  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    if (this.appTooltip) {
      const tooltipTriggerEl = this.el.nativeElement;
      new bootstrap.Tooltip(tooltipTriggerEl, {
        placement: this.placement,
        title: this.appTooltip,
      });
    }

    if (this.popoverContent || this.popoverTitle) {
      const popoverTriggerEl = this.el.nativeElement;
      new bootstrap.Popover(popoverTriggerEl, {
        placement: this.placement,
        content: this.popoverContent,
        title: this.popoverTitle,
      });
    }
  }
}
