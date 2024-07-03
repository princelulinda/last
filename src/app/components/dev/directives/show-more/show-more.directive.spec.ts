import { ElementRef, Renderer2 } from '@angular/core';
import { ShowMoreDirective } from './show-more.directive';
import { TestBed } from '@angular/core/testing';

describe('ShowMoreDirective', () => {
  const elementRef: ElementRef = new ElementRef(null);
  let renderer: Renderer2;

  beforeEach(() => {
    const rendererMock: Partial<Renderer2> = {
      setProperty: jasmine.createSpy('setProperty'),
      createElement: jasmine
        .createSpy('createElement')
        .and.returnValue(document.createElement('a')),
      setAttribute: jasmine.createSpy('setAttribute'),
      addClass: jasmine.createSpy('addClass'),
      appendChild: jasmine.createSpy('appendChild'),
      listen: jasmine.createSpy('listen'),
    };

    TestBed.configureTestingModule({
      providers: [{ provide: Renderer2, useValue: rendererMock }],
    });

    renderer = TestBed.inject(Renderer2);
  });

  it('should create an instance', () => {
    const directive = new ShowMoreDirective(elementRef, renderer);
    expect(directive).toBeTruthy();
  });
});
