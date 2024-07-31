import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavingDashboardComponent } from './saving-dashboard.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
describe('SavingDashboardComponent', () => {
  let component: SavingDashboardComponent;
  let fixture: ComponentFixture<SavingDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SavingDashboardComponent, RouterTestingModule],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(SavingDashboardComponent);
    component = fixture.componentInstance;
    //fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
