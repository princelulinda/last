import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentListComponent } from './agent-list.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';

describe('AgentListComponent', () => {
  let component: AgentListComponent;
  let fixture: ComponentFixture<AgentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgentListComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: {},
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AgentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
