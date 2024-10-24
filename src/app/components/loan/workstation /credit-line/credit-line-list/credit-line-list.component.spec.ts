import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditLineListComponent } from './credit-line-list.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';

describe('CreditLineListComponent', () => {
  let component: CreditLineListComponent;
  let fixture: ComponentFixture<CreditLineListComponent>;

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
      imports: [CreditLineListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreditLineListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
