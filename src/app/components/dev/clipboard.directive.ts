// import { Directive, HostListener, ElementRef } from '@angular/core';
// import { TooltipcssDirective } from './tooltipcss.directive';

// @Directive({
//   selector: '[appClipboard]',
//   standalone: true,
//   hostDirectives: [TooltipcssDirective],
// })
// export class ClipboardDirective {
//   constructor(
//     private tooltipDirective: TooltipcssDirective,
//     private element: ElementRef
//   ) {}

//   @HostListener('click', ['$event'])
//   public onClick(event: MouseEvent): void {
//     event.preventDefault();
//     const TextACopier = this.element.nativeElement.textContent;

//     if (!TextACopier) {
//       return;
//     }

//     // cacher le tooltip qui contient le texte "Copy"
//     this.tooltipDirective.hide();

//     navigator.clipboard
//       .writeText(TextACopier)
//       .then(() => {
//         console.log('le texte est copié');

//         // afficher le tooltip avec le text "Copied"
//         this.updateTooltipTitle('Copied');

//         // cacher le tooltip et reinitialiser le title du tooltip apres avoir affiche "Copied" dans 1.5 secondes
//         setTimeout(() => {
//           this.tooltipDirective.hide();
//           this.resetTooltipTitle();
//         }, 1500);
//       })
//       .catch(err => {
//         console.error("le texte n'est pas copié", err);
//       });
//   }

//   //fonction pour mettre  jour le texte du tooltip
//   private updateTooltipTitle(newTitle: string): void {
//     this.tooltipDirective.tooltipTitle = newTitle;

//     //afficher le tooltip avec le text modifie
//     this.tooltipDirective.show();
//   }

//   //fonction pour renitialiser la valeur du tooltip
//   private resetTooltipTitle(): void {
//     this.tooltipDirective.tooltipTitle = 'Copy';
//   }
// }

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
  private tooltipTitle = 'copy';

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
      this.updateTooltip('copied');

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
