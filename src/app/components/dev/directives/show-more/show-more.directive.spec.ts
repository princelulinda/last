import { ElementRef } from '@angular/core';
import { ShowMoreDirective } from './show-more.directive';

describe('ShowMoreDirective', () => {
  const elementRef: ElementRef = new ElementRef(null);

  it('should create an instance', () => {
    const directive = new ShowMoreDirective(elementRef);
    expect(directive).toBeTruthy();
  });
});
