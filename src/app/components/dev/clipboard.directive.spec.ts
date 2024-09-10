import { ElementRef } from '@angular/core';
import { ClipboardDirective } from './clipboard.directive';
// import { TooltipcssDirective } from './tooltipcss.directive';

describe('ClipboardDirective', () => {
  it('should create an instance', () => {
    // const mockTooltipDirective = {} as TooltipcssDirective;
    const mockElementRef = {
      nativeElement: document.createElement('div'),
    } as ElementRef;

    const directive = new ClipboardDirective(
      // mockTooltipDirective,
      mockElementRef
    );
    expect(directive).toBeTruthy();
  });
});
