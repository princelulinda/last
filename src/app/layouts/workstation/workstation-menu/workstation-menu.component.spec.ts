import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkstationMenuComponent } from './workstation-menu.component';

describe('WorkstationMenuComponent', () => {
  let component: WorkstationMenuComponent;
  let fixture: ComponentFixture<WorkstationMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkstationMenuComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(WorkstationMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
