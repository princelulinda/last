import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditRequestComponent } from './credit-request.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('CreditRequestComponent', () => {
  let component: CreditRequestComponent;
  let fixture: ComponentFixture<CreditRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreditRequestComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreditRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
