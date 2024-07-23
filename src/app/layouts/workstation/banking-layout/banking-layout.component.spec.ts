import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankingLayoutComponent } from './banking-layout.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';

describe('BankingLayoutComponent', () => {
  let component: BankingLayoutComponent;
  let fixture: ComponentFixture<BankingLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BankingLayoutComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: {},
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BankingLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
