import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DebitAccountWorkstationComponent } from './debit-account-workstation.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('DebitAccountWorkstationComponent', () => {
  let component: DebitAccountWorkstationComponent;
  let fixture: ComponentFixture<DebitAccountWorkstationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DebitAccountWorkstationComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(DebitAccountWorkstationComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
