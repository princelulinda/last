import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditAccountWorkstastionComponent } from './credit-account-workstastion.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('CreditAccountWorkstastionComponent', () => {
  let component: CreditAccountWorkstastionComponent;
  let fixture: ComponentFixture<CreditAccountWorkstastionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreditAccountWorkstastionComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(CreditAccountWorkstastionComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
