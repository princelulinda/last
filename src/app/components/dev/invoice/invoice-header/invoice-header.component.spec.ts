import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoiceHeaderComponent } from './invoice-header.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';

describe('InvoiceHeaderComponent', () => {
  let component: InvoiceHeaderComponent;
  let fixture: ComponentFixture<InvoiceHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: {},
        },
      ],
      imports: [InvoiceHeaderComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InvoiceHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
