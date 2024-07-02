import {
  AfterViewInit,
  Directive,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';

@Directive({
  selector: '[appShowMore]',
  standalone: true,
})
export class ShowMoreDirective implements AfterViewInit, OnChanges {
  @Input() maxLength = 100;
  private fullText = '';
  private elementRef: ElementRef<HTMLElement>;
  showMoreBtn = false;

  constructor(elementRef: ElementRef) {
    this.elementRef = elementRef;
  }

  ngAfterViewInit(): void {
    console.log('11111111111111111----------ngAfterViewInit called');
    this.fullText = this.elementRef.nativeElement.textContent || '';
    console.log(
      '222222222---------------Full text after view init:',
      this.fullText
    );
    this.truncateText();
    this.showMoreBtn = this.fullText.length > this.maxLength;
    console.log(
      '333333333333333333333-------------------------Show more button state:',
      this.showMoreBtn
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('444444444444444------------ngOnChanges called', changes);
    if (changes['maxLength']) {
      this.truncateText();
      this.showMoreBtn = this.fullText.length > this.maxLength;
      console.log(
        '55555555555555-----------------Show more button state:',
        this.showMoreBtn
      );
    }
  }

  private truncateText(): void {
    console.log('66666666666666666-----------------Truncate text called');
    if (this.fullText.length > this.maxLength) {
      this.elementRef.nativeElement.textContent =
        this.fullText.slice(0, this.maxLength) + '...';
    } else {
      this.elementRef.nativeElement.textContent = this.fullText;
    }
    console.log(
      '66666666666666666666----------------Text after truncation:',
      this.elementRef.nativeElement.textContent
    );
  }

  toggleCollapse(showText: boolean): void {
    console.log(
      '7777777777----------------Toggle collapse called with:',
      showText
    );
    if (showText) {
      this.elementRef.nativeElement.textContent = this.fullText;
    } else {
      this.truncateText();
    }
    console.log(
      '8888888888888----------------Text after toggle:',
      this.elementRef.nativeElement.textContent
    );
  }
}
