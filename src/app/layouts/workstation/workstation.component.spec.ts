import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkstationComponent } from './workstation.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('WorkstationComponent', () => {
  let component: WorkstationComponent;
  let fixture: ComponentFixture<WorkstationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkstationComponent],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkstationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
