import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestLayout2Component } from './test-layout2.component';

describe('TestLayout2Component', () => {
  let component: TestLayout2Component;
  let fixture: ComponentFixture<TestLayout2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestLayout2Component],
    }).compileComponents();

    fixture = TestBed.createComponent(TestLayout2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
