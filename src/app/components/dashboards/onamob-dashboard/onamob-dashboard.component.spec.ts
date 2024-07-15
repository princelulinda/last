import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnamobDashboardComponent } from './onamob-dashboard.component';

describe('OnamobDashboardComponent', () => {
  let component: OnamobDashboardComponent;
  let fixture: ComponentFixture<OnamobDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OnamobDashboardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OnamobDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
