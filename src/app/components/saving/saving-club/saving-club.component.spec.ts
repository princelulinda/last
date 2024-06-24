import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavingClubComponent } from './saving-club.component';

describe('SavingClubComponent', () => {
  let component: SavingClubComponent;
  let fixture: ComponentFixture<SavingClubComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SavingClubComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SavingClubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
