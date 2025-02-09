import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { AgentCreationComponent } from './agent-creation.component';
import { ActivatedRoute } from '@angular/router';

describe('AgentCreationComponent', () => {
  let component: AgentCreationComponent;
  let fixture: ComponentFixture<AgentCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgentCreationComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: {},
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AgentCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
