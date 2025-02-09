import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CounterDetailsComponent } from './counter-details.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('CounterDetailsComponent', () => {
  let component: CounterDetailsComponent;
  let fixture: ComponentFixture<CounterDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CounterDetailsComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: '123' }),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CounterDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
