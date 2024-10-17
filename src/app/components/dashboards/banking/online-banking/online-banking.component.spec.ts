import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlineBankingComponent } from './online-banking.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
describe('OnlineBankingComponent', () => {
  let component: OnlineBankingComponent;
  let fixture: ComponentFixture<OnlineBankingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OnlineBankingComponent, RouterTestingModule],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(OnlineBankingComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
