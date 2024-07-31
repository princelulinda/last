import { Directive, HostListener, ElementRef } from '@angular/core';
// import { Tooltip } from 'bootstrap';

@Directive({
  selector: '[appClipboard]',
  standalone: true,
})
export class ClipboardDirective {
  // private tooltip!: Tooltip;

  constructor(private element: ElementRef) {}

  @HostListener('click', ['$event'])
  public onClick(event: MouseEvent): void {
    event.preventDefault();
    const TextACopier = this.element.nativeElement.textContent;

    if (!TextACopier) {
      return;
    }

    //   navigator.clipboard
    //     .writeText(TextACopier)
    //     .then(() => {
    //       this.updateTooltipTitle('Copied');

    //       setTimeout(() => {
    //         this.updateTooltipTitle('Copy');
    //         this.tooltip.hide();
    //       }, 1500);
    //     })
    //     .catch(err => {
    //       console.error('le text est pas copié', err);
    //     });
  }

  // ngAfterViewInit(): void {
  // const tooltipTriggerEl = this.element.nativeElement;
  // this.tooltip = new Tooltip(tooltipTriggerEl);
  // }

  private updateTooltipTitle(newTitle: string): void {
    this.element.nativeElement.setAttribute('data-bs-original-title', newTitle);
    // this.tooltip.show();
  }
}
