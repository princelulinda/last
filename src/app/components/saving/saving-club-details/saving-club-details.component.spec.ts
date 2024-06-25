import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavingClubDetailsComponent } from './saving-club-details.component';

describe('SavingClubDetailsComponent', () => {
  let component: SavingClubDetailsComponent;
  let fixture: ComponentFixture<SavingClubDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SavingClubDetailsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SavingClubDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
