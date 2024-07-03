import {
  AfterContentInit,
  Directive,
  ElementRef,
  Input,
  Renderer2,
} from '@angular/core';

@Directive({
  selector: '[appShowMore]',
  standalone: true,
})
export class ShowMoreDirective implements AfterContentInit {
  @Input() maxLength = 100;

  private fullText = '';
  private truncatedText = '';
  private isCollapsed = true;
  private contentElement: HTMLElement;
  private toggleElement!: HTMLElement;

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2
  ) {
    this.contentElement = elementRef.nativeElement;
  }

  ngAfterContentInit(): void {
    console.log('11111111111111111----------ngAfterContentInit called');
    this.fullText = this.contentElement.innerHTML.trim();
    console.log(
      '222222222---------------Full text after view init:',
      this.fullText
    );
    this.truncatedText =
      this.fullText.length > this.maxLength
        ? this.fullText.slice(0, this.maxLength) + '...'
        : this.fullText;
    console.log(
      '333333333333333333333-------------------------truncated text:',
      this.truncatedText
    );
    this.createToggleElement();
    this.updateContent();
  }

  private toggleCollapse(): void {
    console.log(
      '4444444444----------------is Collapsed before toggle:',
      this.isCollapsed
    );
    this.isCollapsed = !this.isCollapsed;

    console.log(
      '55555555----------------is Collapsed after toggle:',
      this.isCollapsed
    );

    this.updateContent();
    this.updateToggleText();
  }

  private updateContent(): void {
    const contentToShow = this.isCollapsed ? this.truncatedText : this.fullText;
    this.renderer.setProperty(this.contentElement, 'innerHTML', contentToShow);
    this.renderer.appendChild(this.contentElement, this.toggleElement);
  }

  private createToggleElement(): void {
    this.toggleElement = this.renderer.createElement('a');
    this.renderer.setAttribute(
      this.toggleElement,
      'href',
      'javascript:void(0)'
    );
    this.renderer.addClass(this.toggleElement, 'fw-bold');
    this.renderer.listen(this.toggleElement, 'click', (event: Event) => {
      event.stopPropagation();
      this.toggleCollapse();
    });
    this.updateToggleText();
  }

  private updateToggleText(): void {
    this.renderer.setProperty(
      this.toggleElement,
      'innerText',
      this.isCollapsed ? 'Voir plus' : 'Voir moins'
    );
  }
}
