import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperatorDesignTestComponent } from './operator-design-test.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('OperatorDesignTestComponent', () => {
  let component: OperatorDesignTestComponent;
  let fixture: ComponentFixture<OperatorDesignTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OperatorDesignTestComponent],
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

    fixture = TestBed.createComponent(OperatorDesignTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
