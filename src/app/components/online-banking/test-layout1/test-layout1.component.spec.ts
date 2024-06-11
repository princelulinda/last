import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestLayout1Component } from './test-layout1.component';

describe('TestLayout1Component', () => {
  let component: TestLayout1Component;
  let fixture: ComponentFixture<TestLayout1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestLayout1Component],
    }).compileComponents();

    fixture = TestBed.createComponent(TestLayout1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
