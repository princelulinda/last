import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentTransferComponent } from './agent-transfer.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

describe('AgentTransferComponent', () => {
  let component: AgentTransferComponent;
  let fixture: ComponentFixture<AgentTransferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgentTransferComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(AgentTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
