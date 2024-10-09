import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DebitAccountComponent } from './debit-account.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('DebitAccountComponent', () => {
  let component: DebitAccountComponent;
  let fixture: ComponentFixture<DebitAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DebitAccountComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(DebitAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
