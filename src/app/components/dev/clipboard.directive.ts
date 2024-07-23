import {
  Directive,
  HostListener,
  ElementRef,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';

@Directive({
  selector: '[appClipboard]',
  standalone: true,
})
export class ClipboardDirective {
  @Input() valueTickIcon!: boolean;
  @Output() sendValueTickIcon = new EventEmitter<boolean>();

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
        this.valueTickIcon = true;
        this.sendValueTickIcon.emit(this.valueTickIcon);
      })
      .catch(err => {
        console.error('element est pas copie', err);
      });
  }
}
