import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleInvoicesComponent } from './single-invoices.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';

describe('SingleInvoicesComponent', () => {
  let component: SingleInvoicesComponent;
  let fixture: ComponentFixture<SingleInvoicesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SingleInvoicesComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: {},
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SingleInvoicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
