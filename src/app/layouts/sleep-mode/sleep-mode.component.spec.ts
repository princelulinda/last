import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SleepModeComponent } from './sleep-mode.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('SleepModeComponent', () => {
  let component: SleepModeComponent;
  let fixture: ComponentFixture<SleepModeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SleepModeComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(SleepModeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
