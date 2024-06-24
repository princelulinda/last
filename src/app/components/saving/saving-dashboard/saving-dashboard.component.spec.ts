import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavingDashboardComponent } from './saving-dashboard.component';

describe('SavingDashboardComponent', () => {
  let component: SavingDashboardComponent;
  let fixture: ComponentFixture<SavingDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SavingDashboardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SavingDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
