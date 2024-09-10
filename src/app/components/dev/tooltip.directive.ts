import { Directive, Input, AfterViewInit } from '@angular/core';
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

  ngAfterViewInit() {
    const tooltipTriggerList = [].slice.call(
      document.querySelectorAll('[data-bs-toggle="tooltip"]')
    );
    tooltipTriggerList.map(tooltipTriggerEl => {
      return new bootstrap.Tooltip(tooltipTriggerEl, {
        placement: this.placement,
        title: this.appTooltip,
      });
    });

    const popoverTriggerList = [].slice.call(
      document.querySelectorAll('[data-bs-toggle="popover"]')
    );
    popoverTriggerList.map(popoverTriggerEl => {
      return new bootstrap.Popover(popoverTriggerEl, {
        placement: this.placement,
      });
    });
  }
}
