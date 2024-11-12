import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentDepositComponent } from './agent-deposit.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';

describe('AgentDepositComponent', () => {
  let component: AgentDepositComponent;
  let fixture: ComponentFixture<AgentDepositComponent>;

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
      imports: [AgentDepositComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AgentDepositComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
