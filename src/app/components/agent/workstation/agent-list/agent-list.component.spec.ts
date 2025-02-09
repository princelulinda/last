import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgentListComponent } from './agent-list.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('AgentListComponent', () => {
  let component: AgentListComponent;
  let fixture: ComponentFixture<AgentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgentListComponent, RouterTestingModule],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        // RouterModule.forRoot(AuthRoutes),
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
