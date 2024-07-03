import { ElementRef, Renderer2 } from '@angular/core';
import { ShowMoreDirective } from './show-more.directive';
import { TestBed } from '@angular/core/testing';

describe('ShowMoreDirective', () => {
  const elementRef: ElementRef = new ElementRef(null);
  let renderer: Renderer2;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ShowMoreDirective],
    });
    renderer = TestBed.inject(Renderer2);
  });

  it('should create an instance', () => {
    const directive = new ShowMoreDirective(elementRef, renderer);
    expect(directive).toBeTruthy();
  });
});
