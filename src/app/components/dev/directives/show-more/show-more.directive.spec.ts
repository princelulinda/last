import { ElementRef, Renderer2 } from '@angular/core';
import { ShowMoreDirective } from './show-more.directive';

describe('ShowMoreDirective', () => {
  const elementRef: ElementRef = new ElementRef(null);
  let renderer: Renderer2;

  beforeEach(() => {
    renderer = {
      createElement: () => document.createElement('a'),
    } as unknown as Renderer2;
  });

  it('should create an instance', () => {
    const directive = new ShowMoreDirective(elementRef, renderer);
    expect(directive).toBeTruthy();
  });
});
