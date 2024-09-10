// import { ElementRef, Renderer2 } from '@angular/core';
import { TooltipcssDirective } from './tooltipcss.directive';

describe('TooltipcssDirective', () => {
  it('should create an instance', () => {
    // const mockElementRef = {
    //   nativeElement: document.createElement('div'),
    // } as ElementRef;
    // const mockRenderer2 = {} as Renderer2;

    const directive = new TooltipcssDirective();
    expect(directive).toBeTruthy();
  });
});
