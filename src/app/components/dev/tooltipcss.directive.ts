import {
  Directive,
  Input,
  AfterViewInit,
  // ElementRef,
  // HostListener,
  // Renderer2,
} from '@angular/core';
import { Popover, Tooltip } from 'bootstrap';

declare let bootstrap: {
  Popover: typeof Popover;
  Tooltip: typeof Tooltip;
};

@Directive({
  selector: '[appTooltipcss]',
  standalone: true,
})
export class TooltipcssDirective implements AfterViewInit {
  @Input() tooltipTitle!: string;
  @Input() placement: 'top' | 'bottom' | 'right' | 'left' = 'top';
  @Input() delay!: number;
  // tooltip: HTMLElement | null = null;

  // Distance entre le tooltip et l'element sur lequel la directive du tooltip est applique
  offset = 10;

  // constructor(
  //   // private el: ElementRef,
  //   // private renderer: Renderer2
  // ) {}

  // @HostListener('mouseenter') onMouseEnter() {
  //   if (!this.tooltip) {
  //     this.show();
  //   }
  // }

  // @HostListener('mouseleave') onMouseLeave() {
  //   if (this.tooltip) {
  //     this.hide();
  //   }
  // }

  // //fonction pour afficher le tooltip
  // show() {
  //   // this.create();
  //   if (this.tooltip) {
  //     // this.setPosition();
  //     this.renderer.setStyle(this.tooltip, 'opacity', '1');
  //   }
  // }

  // //la fonction pour cacher le tooltip
  // hide() {
  //   this.renderer.setStyle(this.tooltip, 'opacity', '0');
  //   window.setTimeout(() => {
  //     if (this.tooltip) {
  //       this.renderer.removeChild(document.body, this.tooltip);
  //       this.tooltip = null;
  //     }
  //   }, this.delay);
  // }

  // //le tooltip
  // create() {
  //   this.tooltip = this.renderer.createElement('span');
  //   this.renderer.appendChild(
  //     this.tooltip,
  //     this.renderer.createText(this.tooltipTitle)
  //   );

  //   //creation de la fleche
  //   const arrow = this.renderer.createElement('div');
  //   this.renderer.appendChild(this.tooltip, arrow);

  //   this.renderer.appendChild(document.body, this.tooltip);

  //   //creation du tooltip
  //   this.renderer.setStyle(this.tooltip, 'position', 'absolute');
  //   this.renderer.setStyle(this.tooltip, 'opacity', '0');
  //   this.renderer.setStyle(this.tooltip, 'pointer-events', 'none');
  //   this.renderer.setStyle(this.tooltip, 'background-color', '#333');
  //   this.renderer.setStyle(this.tooltip, 'color', '#fff');
  //   this.renderer.setStyle(this.tooltip, 'padding', '5px 10px');
  //   this.renderer.setStyle(this.tooltip, 'border-radius', '4px');
  //   this.renderer.setStyle(this.tooltip, 'font-size', '12px');

  //   // stylisation de la fleche
  //   this.renderer.setStyle(arrow, 'position', 'absolute');
  //   this.renderer.setStyle(arrow, 'width', '0');
  //   this.renderer.setStyle(arrow, 'height', '0');
  //   this.renderer.setStyle(arrow, 'border-left', '5px solid transparent');
  //   this.renderer.setStyle(arrow, 'border-right', '5px solid transparent');
  //   this.renderer.setStyle(arrow, 'border-top', '5px solid #333');
  //   this.renderer.setStyle(arrow, 'bottom', '-5px');
  //   this.renderer.setStyle(arrow, 'left', '50%');
  //   this.renderer.setStyle(arrow, 'transform', 'translateX(-50%)');
  // }

  // //positionnement du tooltip
  // setPosition() {
  //   if (!this.tooltip) return;

  //   const hostPos = this.el.nativeElement.getBoundingClientRect();

  //   const tooltipPos = this.tooltip.getBoundingClientRect();

  //   const scrollPos =
  //     window.scrollY ||
  //     document.documentElement.scrollTop ||
  //     document.body.scrollTop ||
  //     0;

  //   const top = hostPos.top - tooltipPos.height - this.offset + scrollPos;
  //   const left = hostPos.left + (hostPos.width - tooltipPos.width) / 2;

  //   this.renderer.setStyle(this.tooltip, 'top', `${top}px`);
  //   this.renderer.setStyle(this.tooltip, 'left', `${left}px`);
  // }
  ngAfterViewInit() {
    const tooltipTriggerList = [].slice.call(
      document.querySelectorAll('[data-bs-toggle="tooltip"]')
    );
    tooltipTriggerList.map(tooltipTriggerEl => {
      return new bootstrap.Tooltip(tooltipTriggerEl, {
        placement: this.placement,
        title: this.tooltipTitle,
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
