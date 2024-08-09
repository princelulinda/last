import { Directive, HostListener, ElementRef } from '@angular/core';
import { TooltipcssDirective } from './tooltipcss.directive';

@Directive({
  selector: '[appClipboard]',
  standalone: true,
  hostDirectives: [TooltipcssDirective],
})
export class ClipboardDirective {
  constructor(
    private tooltipDirective: TooltipcssDirective,
    private element: ElementRef
  ) {}

  @HostListener('click', ['$event'])
  public onClick(event: MouseEvent): void {
    event.preventDefault();
    const TextACopier = this.element.nativeElement.textContent;

    if (!TextACopier) {
      return;
    }

    // cacher le tooltip qui contient le texte "Copy"
    this.tooltipDirective.hide();

    navigator.clipboard
      .writeText(TextACopier)
      .then(() => {
        console.log('le texte est copié');

        // afficher le tooltip avec le text "Copied"
        this.updateTooltipTitle('Copied');

        // cacher le tooltip et reinitialiser le title du tooltip apres avoir affiche "Copied" dans 1.5 secondes
        setTimeout(() => {
          this.tooltipDirective.hide();
          this.resetTooltipTitle();
        }, 1500);
      })
      .catch(err => {
        console.error("le texte n'est pas copié", err);
      });
  }

  //fonction pour mettre  jour le texte du tooltip
  private updateTooltipTitle(newTitle: string): void {
    this.tooltipDirective.tooltipTitle = newTitle;

    //afficher le tooltip avec le text modifie
    this.tooltipDirective.show();
  }

  //fonction pour renitialiser la valeur du tooltip
  private resetTooltipTitle(): void {
    this.tooltipDirective.tooltipTitle = 'Copy';
  }
}
