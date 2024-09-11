import {
  Directive,
  ElementRef,
  HostListener,
  AfterViewInit,
} from '@angular/core';
import { Tooltip } from 'bootstrap';

declare let bootstrap: {
  Tooltip: typeof Tooltip;
};

@Directive({
  selector: '[appClipboard]',
  standalone: true,
})
export class ClipboardDirective implements AfterViewInit {
  private tooltip!: Tooltip;
  private tooltipTitle = 'Copy To Clipboard';

  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    this.initializeTooltip();
  }

  initializeTooltip() {
    this.tooltip = new bootstrap.Tooltip(this.el.nativeElement, {
      title: this.tooltipTitle,
      placement: 'bottom',
    });
  }

  @HostListener('mouseenter') onMouseEnter() {
    this.tooltip.show();
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.tooltip.hide();
  }

  @HostListener('click') onClick() {
    const text = this.el.nativeElement.innerText;

    navigator.clipboard.writeText(text).then(() => {
      this.updateTooltip('Copied');

      setTimeout(() => {
        this.updateTooltip(this.tooltipTitle);
      }, 1000);
    });
  }

  updateTooltip(newTitle: string) {
    this.tooltip.dispose();
    this.tooltip = new bootstrap.Tooltip(this.el.nativeElement, {
      title: newTitle,
      placement: 'bottom',
    });
    this.tooltip.show();
  }
}
