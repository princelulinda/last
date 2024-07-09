import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnlineBankingComponent } from './online-banking.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('OnlineBankingComponent', () => {
  let component: OnlineBankingComponent;
  let fixture: ComponentFixture<OnlineBankingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OnlineBankingComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(OnlineBankingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
