import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentTransferComponent } from './agent-transfer.component';

describe('AgentTransferComponent', () => {
  let component: AgentTransferComponent;
  let fixture: ComponentFixture<AgentTransferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgentTransferComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AgentTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
