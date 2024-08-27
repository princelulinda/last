import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SleepModeComponent } from './sleep-mode.component';

describe('SleepModeComponent', () => {
  let component: SleepModeComponent;
  let fixture: ComponentFixture<SleepModeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SleepModeComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SleepModeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
