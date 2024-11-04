import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditListComponent } from './credit-list.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('CreditListComponent', () => {
  let component: CreditListComponent;
  let fixture: ComponentFixture<CreditListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreditListComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(CreditListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
