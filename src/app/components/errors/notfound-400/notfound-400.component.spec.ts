import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Notfound400Component } from './notfound-400.component';

describe('Notfound400Component', () => {
  let component: Notfound400Component;
  let fixture: ComponentFixture<Notfound400Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Notfound400Component],
    }).compileComponents();

    fixture = TestBed.createComponent(Notfound400Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
