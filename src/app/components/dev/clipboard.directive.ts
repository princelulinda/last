import {
  Directive,
  HostListener,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { Tooltip } from 'bootstrap';

@Directive({
  selector: '[appClipboard]',
  standalone: true,
})
export class ClipboardDirective implements AfterViewInit {
  constructor(private element: ElementRef) {}

  @HostListener('click', ['$event'])
  public onClick(event: MouseEvent): void {
    event.preventDefault();
    const Text_a_Copier = this.element.nativeElement.textContent;
    if (!Text_a_Copier) {
      return;
    }
    navigator.clipboard
      .writeText(Text_a_Copier)
      .then(() => {
        console.log('texte est copie.');
      })
      .catch(err => {
        console.error('le text est pas copié', err);
      });
  }

  ngAfterViewInit(): void {
    const tooltipTriggerEl = this.element.nativeElement;
    new Tooltip(tooltipTriggerEl);
  }
}
