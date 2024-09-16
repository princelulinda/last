import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkstationMenuComponent } from './workstation-menu.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';

describe('WorkstationMenuComponent', () => {
  let component: WorkstationMenuComponent;
  let fixture: ComponentFixture<WorkstationMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkstationMenuComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: {},
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkstationMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
