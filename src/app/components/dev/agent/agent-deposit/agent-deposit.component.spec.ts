import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentDepositComponent } from './agent-deposit.component';

describe('AgentDepositComponent', () => {
  let component: AgentDepositComponent;
  let fixture: ComponentFixture<AgentDepositComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
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
