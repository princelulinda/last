import { ClipboardDirective } from './clipboard.directive';
import { ElementRef } from '@angular/core';

describe('ClipboardDirective', () => {
  it('should create an instance', () => {
    const mockElementRef = {} as ElementRef;

    const directive = new ClipboardDirective(mockElementRef);
    expect(directive).toBeTruthy();
  });
});
