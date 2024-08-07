import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeskLayoutComponent } from './desk-layout.component';

describe('DeskLayoutComponent', () => {
  let component: DeskLayoutComponent;
  let fixture: ComponentFixture<DeskLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeskLayoutComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DeskLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
