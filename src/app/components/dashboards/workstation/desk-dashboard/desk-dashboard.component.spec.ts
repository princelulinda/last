import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { DeskDashboardComponent } from './desk-dashboard.component';

describe('DeskDashboardComponent', () => {
  let component: DeskDashboardComponent;
  let fixture: ComponentFixture<DeskDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeskDashboardComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(DeskDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
