import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoicesByGroupComponent } from './invoices-by-group.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';

describe('InvoicesByGroupComponent', () => {
  let component: InvoicesByGroupComponent;
  let fixture: ComponentFixture<InvoicesByGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvoicesByGroupComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: {},
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(InvoicesByGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
