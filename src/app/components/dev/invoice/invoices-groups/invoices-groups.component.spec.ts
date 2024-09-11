import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvoicesGroupsComponent } from './invoices-groups.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';

describe('InvoicesGroupsComponent', () => {
  let component: InvoicesGroupsComponent;
  let fixture: ComponentFixture<InvoicesGroupsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvoicesGroupsComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: {},
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(InvoicesGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
